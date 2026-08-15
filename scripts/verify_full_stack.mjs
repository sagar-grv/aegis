import { eq } from "drizzle-orm";
import { getDb, getLearnerWorkspace, getTeacherAnalytics, getUserByOpenId, saveLearnerAttempt, upsertUser } from "../server/db.ts";
import { diagnoseLearnerWork } from "../server/learning.ts";
import { learningAttempts, learningPaths, users } from "../drizzle/schema.ts";

const openId = `integration-probe-${Date.now()}`;
let userId;

try {
  await upsertUser({ openId, name: "Temporary Integration Probe", role: "user", loginMethod: "system" });
  const user = await getUserByOpenId(openId);
  if (!user) throw new Error("Temporary integration user was not created.");
  userId = user.id;

  const input = {
    topic: "Arithmetic",
    prompt: "What is 12 divided by 3?",
    learnerAnswer: "I think the answer is 3 because I divided the digits separately.",
    selfConfidence: 70,
  };
  const diagnosis = await diagnoseLearnerWork(input);
  const attemptId = await saveLearnerAttempt({ learnerUserId: userId, ...input, diagnosis });
  const workspace = await getLearnerWorkspace(userId);
  const analytics = await getTeacherAnalytics();

  if (!attemptId || workspace.attempts.length !== 1 || workspace.paths.length !== 1) throw new Error("Learner persistence or path update did not complete.");
  if (!analytics.summary.submissions || !analytics.summary.learners) throw new Error("Teacher aggregate did not include the temporary learner attempt.");
  console.log("Full-stack integration probe passed: live diagnosis, attempt persistence, adaptive path, and teacher aggregate verified.");
} finally {
  if (userId) {
    const db = await getDb();
    if (db) {
      await db.delete(learningAttempts).where(eq(learningAttempts.learnerUserId, userId));
      await db.delete(learningPaths).where(eq(learningPaths.learnerUserId, userId));
      await db.delete(users).where(eq(users.id, userId));
    }
  }
}
