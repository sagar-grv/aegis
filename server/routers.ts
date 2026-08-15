import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getLatestAegisFieldReport, getLearnerWorkspace, getTeacherAnalytics, saveAegisDecisionReceipt, saveAegisFieldReport, saveLearnerAttempt } from "./db";
import { diagnoseLearnerWork } from "./learning";
import { assessEvidence, getLiveEvidence, type AegisSourceId } from "./aegis";
import { extractAegisVisualObservation, parseAegisPhotoDataUrl } from "./aegisPhoto";
import { storagePut } from "./storage";

const teacherProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin" && ctx.user.role !== "analyst") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Teacher access is required." });
  }
  return next({ ctx });
});

const learnerSubmission = z.object({
  topic: z.string().trim().min(2).max(160),
  prompt: z.string().trim().min(8).max(2000),
  learnerAnswer: z.string().trim().min(8).max(5000),
  selfConfidence: z.number().int().min(0).max(100),
});

const locationInput = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  siteLabel: z.string().trim().min(2).max(140),
});
const disabledSources = z.array(z.enum(["weather", "rain", "air", "field"])).max(2).default([]);
const fieldInput = locationInput.extend({
  fieldCondition: z.enum(["clear", "wet", "unsafe", "unknown"]),
  observedWindKph: z.number().int().min(0).max(200).nullable().optional(),
  note: z.string().trim().min(4).max(2000),
  photoDataUrl: z.string().max(3_500_000).optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  learning: router({
    mine: protectedProcedure.query(({ ctx }) => getLearnerWorkspace(ctx.user.id)),
    submit: protectedProcedure.input(learnerSubmission).mutation(async ({ ctx, input }) => {
      const diagnosis = await diagnoseLearnerWork(input);
      const attemptId = await saveLearnerAttempt({ learnerUserId: ctx.user.id, ...input, diagnosis });
      return { attemptId, diagnosis };
    }),
    teacherAnalytics: teacherProcedure.query(() => getTeacherAnalytics()),
  }),
  aegis: router({
    live: publicProcedure.input(locationInput.pick({ latitude: true, longitude: true })).query(({ input }) => getLiveEvidence(input.latitude, input.longitude)),
    preview: publicProcedure.input(locationInput.extend({ disabled: disabledSources })).query(async ({ input }) => {
      const evidence = await getLiveEvidence(input.latitude, input.longitude);
      return { assessment: assessEvidence(evidence, {}, input.disabled as AegisSourceId[]) };
    }),
    assess: protectedProcedure.input(locationInput.extend({ disabled: disabledSources })).query(async ({ ctx, input }) => {
      const [evidence, latest] = await Promise.all([getLiveEvidence(input.latitude, input.longitude), getLatestAegisFieldReport(ctx.user.id, input.latitude, input.longitude)]);
      const field = latest ? { siteLabel: latest.siteLabel, fieldCondition: latest.fieldCondition, observedWindKph: latest.observedWindKph, note: latest.note, visualObservation: latest.visualObservation as Record<string, unknown> | null } : {};
      return { assessment: assessEvidence(evidence, field, input.disabled as AegisSourceId[]), fieldReport: latest };
    }),
    reportField: protectedProcedure.input(fieldInput).mutation(async ({ ctx, input }) => {
      let photoUrl: string | null = null;
      let visualObservation = null;
      if (input.photoDataUrl) {
        const photo = parseAegisPhotoDataUrl(input.photoDataUrl);
        visualObservation = await extractAegisVisualObservation(input.photoDataUrl);
        const stored = await storagePut(
          `aegis/${ctx.user.id}/field-evidence/${Date.now()}.${photo.extension}`,
          photo.bytes,
          photo.mimeType,
        );
        photoUrl = stored.url;
      }
      const { photoDataUrl: _photoDataUrl, ...report } = input;
      const id = await saveAegisFieldReport({ operatorUserId: ctx.user.id, ...report, photoUrl, visualObservation });
      return { id, photoEvidence: photoUrl ? { photoUrl, visualObservation } : null };
    }),
    recordReview: protectedProcedure.input(locationInput.extend({ disabled: disabledSources, operatorAction: z.enum(["approve", "request_check", "defer"]), operatorNote: z.string().trim().min(3).max(2000) })).mutation(async ({ ctx, input }) => {
      const [evidence, latest] = await Promise.all([getLiveEvidence(input.latitude, input.longitude), getLatestAegisFieldReport(ctx.user.id, input.latitude, input.longitude)]);
      const field = latest ? { siteLabel: latest.siteLabel, fieldCondition: latest.fieldCondition, observedWindKph: latest.observedWindKph, note: latest.note, visualObservation: latest.visualObservation as Record<string, unknown> | null } : {};
      const assessment = assessEvidence(evidence, field, input.disabled as AegisSourceId[]);
      const receiptId = await saveAegisDecisionReceipt({
        operatorUserId: ctx.user.id, latitude: input.latitude, longitude: input.longitude, siteLabel: input.siteLabel,
        decision: assessment.decision, confidence: assessment.confidence, riskScore: assessment.riskScore,
        operatorAction: input.operatorAction, operatorNote: input.operatorNote, evidenceSnapshot: assessment,
      });
      return { receiptId, assessment };
    }),
  }),
});

export type AppRouter = typeof appRouter;
