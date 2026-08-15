import { count, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { aegisDecisionReceipts, aegisFieldReports, learningAttempts, learningPaths, type InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";
import type { LearningDiagnosis } from "./learning";
import { pathStatusFor } from "./learning";
import type { AegisDecision, FieldReportInput } from "./aegis";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const values: InsertUser = { openId: user.openId, lastSignedIn: new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: new Date() };
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  values.role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user");
  updateSet.role = values.role;
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function saveLearnerAttempt(input: {
  learnerUserId: number;
  topic: string;
  prompt: string;
  learnerAnswer: string;
  selfConfidence: number;
  diagnosis: LearningDiagnosis;
}) {
  const db = await getDb();
  if (!db) throw new Error("Learning records are temporarily unavailable.");

  const result = await db.transaction(async tx => {
    const inserted = await tx.insert(learningAttempts).values({
      learnerUserId: input.learnerUserId,
      topic: input.topic,
      prompt: input.prompt,
      learnerAnswer: input.learnerAnswer,
      selfConfidence: input.selfConfidence,
      diagnosis: input.diagnosis,
    });
    const status = pathStatusFor(input.diagnosis.masteryEstimate);
    await tx.insert(learningPaths).values({
      learnerUserId: input.learnerUserId,
      topic: input.topic,
      targetSkill: input.diagnosis.targetSkill,
      misconceptionLabel: input.diagnosis.misconceptionLabel,
      masteryEstimate: input.diagnosis.masteryEstimate,
      nextPrompt: input.diagnosis.nextPrompt,
      status,
    }).onDuplicateKeyUpdate({ set: {
      targetSkill: input.diagnosis.targetSkill,
      misconceptionLabel: input.diagnosis.misconceptionLabel,
      masteryEstimate: input.diagnosis.masteryEstimate,
      nextPrompt: input.diagnosis.nextPrompt,
      status,
      updatedAt: new Date(),
    } });
    return Number(inserted[0].insertId);
  });
  return result;
}

export async function getLearnerWorkspace(learnerUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("Learning records are temporarily unavailable.");
  const [paths, attempts] = await Promise.all([
    db.select().from(learningPaths).where(eq(learningPaths.learnerUserId, learnerUserId)).orderBy(desc(learningPaths.updatedAt)).limit(12),
    db.select().from(learningAttempts).where(eq(learningAttempts.learnerUserId, learnerUserId)).orderBy(desc(learningAttempts.createdAt)).limit(8),
  ]);
  return { paths, attempts };
}

export async function getTeacherAnalytics() {
  const db = await getDb();
  if (!db) throw new Error("Learning records are temporarily unavailable.");
  const submissionCount = sql<number>`count(*)`;
  const learnerCount = sql<number>`count(distinct ${learningAttempts.learnerUserId})`;
  const [summary] = await db.select({ submissions: submissionCount, learners: learnerCount }).from(learningAttempts);
  const topicRows = await db.select({ topic: learningAttempts.topic, submissions: count() })
    .from(learningAttempts).groupBy(learningAttempts.topic).orderBy(desc(count())).limit(8);
  const activePaths = await db.select({ status: learningPaths.status, total: count() })
    .from(learningPaths).groupBy(learningPaths.status);
  return { summary: { submissions: Number(summary?.submissions ?? 0), learners: Number(summary?.learners ?? 0) }, topicRows, activePaths };
}

export async function saveAegisFieldReport(input: {
  operatorUserId: number; latitude: number; longitude: number; siteLabel: string; fieldCondition: NonNullable<FieldReportInput["fieldCondition"]>; observedWindKph?: number | null; note: string; photoUrl?: string | null; visualObservation?: unknown | null;
}) {
  const db = await getDb();
  if (!db) throw new Error("Aegis evidence storage is temporarily unavailable.");
  const result = await db.insert(aegisFieldReports).values({
    operatorUserId: input.operatorUserId, latitude: String(input.latitude), longitude: String(input.longitude), siteLabel: input.siteLabel,
    fieldCondition: input.fieldCondition, observedWindKph: input.observedWindKph ?? null, note: input.note,
    photoUrl: input.photoUrl ?? null, visualObservation: input.visualObservation ?? null,
  });
  return Number(result[0].insertId);
}

export async function getLatestAegisFieldReport(operatorUserId: number, latitude: number, longitude: number) {
  const db = await getDb();
  if (!db) throw new Error("Aegis evidence storage is temporarily unavailable.");
  const rows = await db.select().from(aegisFieldReports)
    .where(eq(aegisFieldReports.operatorUserId, operatorUserId)).orderBy(desc(aegisFieldReports.createdAt)).limit(8);
  return rows.find(row => Math.abs(Number(row.latitude) - latitude) < 0.02 && Math.abs(Number(row.longitude) - longitude) < 0.02) ?? null;
}

export async function saveAegisDecisionReceipt(input: {
  operatorUserId: number; latitude: number; longitude: number; siteLabel: string; decision: AegisDecision; confidence: number; riskScore: number;
  operatorAction: "approve" | "request_check" | "defer"; operatorNote: string; evidenceSnapshot: unknown;
}) {
  const db = await getDb();
  if (!db) throw new Error("Aegis receipt storage is temporarily unavailable.");
  const result = await db.insert(aegisDecisionReceipts).values({
    operatorUserId: input.operatorUserId, latitude: String(input.latitude), longitude: String(input.longitude), siteLabel: input.siteLabel,
    decision: input.decision, confidence: input.confidence, riskScore: input.riskScore, operatorAction: input.operatorAction,
    operatorNote: input.operatorNote, evidenceSnapshot: input.evidenceSnapshot,
  });
  return Number(result[0].insertId);
}
