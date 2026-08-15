import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getLearnerWorkspace, getTeacherAnalytics, saveLearnerAttempt } from "./db";
import { diagnoseLearnerWork } from "./learning";

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
});

export type AppRouter = typeof appRouter;
