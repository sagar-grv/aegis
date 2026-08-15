import { describe, expect, it } from "vitest";
import { parseLearningDiagnosis, pathStatusFor } from "./learning";

const validDiagnosis = JSON.stringify({
  misconceptionLabel: "Combining unlike terms",
  misconceptionExplanation: "The learner treats terms with different variables as though they can be added together.",
  masteryEstimate: 42,
  confidence: 86,
  feedback: "Keep the variable part attached to each term before you combine anything.",
  targetSkill: "Identify like terms",
  nextPrompt: "Can 3x and 3y be combined? Explain your reasoning.",
  whyThisNext: "It directly tests whether the learner distinguishes matching variable parts.",
});

describe("InsightLoop diagnosis safeguards", () => {
  it("accepts a complete bounded structured diagnosis", () => {
    expect(parseLearningDiagnosis(validDiagnosis).masteryEstimate).toBe(42);
  });

  it("rejects out-of-range mastery values", () => {
    expect(() => parseLearningDiagnosis(validDiagnosis.replace('"masteryEstimate":42', '"masteryEstimate":142'))).toThrow();
  });

  it("maps mastery estimates to an explicit path status", () => {
    expect(pathStatusFor(42)).toBe("active");
    expect(pathStatusFor(65)).toBe("ready_for_review");
    expect(pathStatusFor(90)).toBe("mastered");
  });
});
