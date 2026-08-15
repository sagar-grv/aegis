import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function contextFor(user: TrpcContext["user"]): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

describe("InsightLoop protected learning routes", () => {
  it("rejects an unauthenticated learner workspace request", async () => {
    const caller = appRouter.createCaller(contextFor(null));
    await expect(caller.learning.mine()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects a standard learner from teacher analytics", async () => {
    const caller = appRouter.createCaller(contextFor({
      id: 7,
      openId: "learner-7",
      name: "Learner",
      email: "learner@example.test",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }));
    await expect(caller.learning.teacherAnalytics()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects a malformed learner submission before the model or database is called", async () => {
    const caller = appRouter.createCaller(contextFor({
      id: 8,
      openId: "learner-8",
      name: "Learner",
      email: "learner@example.test",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }));
    await expect(caller.learning.submit({ topic: "x", prompt: "short", learnerAnswer: "short", selfConfidence: 40 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
