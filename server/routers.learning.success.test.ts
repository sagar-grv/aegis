import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  getLearnerWorkspace: vi.fn(),
  getTeacherAnalytics: vi.fn(),
  saveLearnerAttempt: vi.fn(),
  diagnoseLearnerWork: vi.fn(),
}));

vi.mock("./db", () => ({
  getLearnerWorkspace: mocks.getLearnerWorkspace,
  getTeacherAnalytics: mocks.getTeacherAnalytics,
  saveLearnerAttempt: mocks.saveLearnerAttempt,
}));

vi.mock("./learning", () => ({
  diagnoseLearnerWork: mocks.diagnoseLearnerWork,
}));

const { appRouter } = await import("./routers");

const learner = {
  id: 42, openId: "integration-learner", name: "Learner", email: "learner@example.test", loginMethod: "manus" as const,
  role: "user" as const, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
};
const teacher = { ...learner, id: 43, openId: "integration-teacher", role: "admin" as const };
const diagnosis = {
  misconceptionLabel: "Place value confusion", misconceptionExplanation: "The submitted method treats digits independently.", masteryEstimate: 40,
  confidence: 84, feedback: "Keep the number together before choosing an operation.", targetSkill: "Place value", nextPrompt: "Explain why 15 is one number.", whyThisNext: "It checks whether whole-number reasoning is present.",
};

function contextFor(user: TrpcContext["user"]): TrpcContext {
  return { user, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: { clearCookie: () => undefined } as TrpcContext["res"] };
}

describe("InsightLoop positive protected routes", () => {
  it("returns an authenticated learner workspace", async () => {
    mocks.getLearnerWorkspace.mockResolvedValueOnce({ paths: [], attempts: [] });
    await expect(appRouter.createCaller(contextFor(learner)).learning.mine()).resolves.toEqual({ paths: [], attempts: [] });
    expect(mocks.getLearnerWorkspace).toHaveBeenCalledWith(42);
  });

  it("diagnoses and persists a valid authenticated learner submission", async () => {
    mocks.diagnoseLearnerWork.mockResolvedValueOnce(diagnosis);
    mocks.saveLearnerAttempt.mockResolvedValueOnce(91);
    const input = { topic: "Arithmetic", prompt: "What is 12 divided by 3?", learnerAnswer: "I divided the digits.", selfConfidence: 55 };
    await expect(appRouter.createCaller(contextFor(learner)).learning.submit(input)).resolves.toEqual({ attemptId: 91, diagnosis });
    expect(mocks.diagnoseLearnerWork).toHaveBeenCalledWith(input);
    expect(mocks.saveLearnerAttempt).toHaveBeenCalledWith({ learnerUserId: 42, ...input, diagnosis });
  });

  it("returns aggregated data to an authorised teacher", async () => {
    const aggregate = { summary: { submissions: 2, learners: 1 }, topicRows: [{ topic: "Arithmetic", submissions: 2 }], activePaths: [{ status: "active", total: 1 }] };
    mocks.getTeacherAnalytics.mockResolvedValueOnce(aggregate);
    await expect(appRouter.createCaller(contextFor(teacher)).learning.teacherAnalytics()).resolves.toEqual(aggregate);
  });
});
