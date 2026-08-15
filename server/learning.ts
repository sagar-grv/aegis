import { z } from "zod";
import { invokeLLM } from "./_core/llm";

export const diagnosisSchema = z.object({
  misconceptionLabel: z.string().min(3).max(180),
  misconceptionExplanation: z.string().min(20).max(500),
  masteryEstimate: z.number().int().min(0).max(100),
  confidence: z.number().int().min(0).max(100),
  feedback: z.string().min(20).max(600),
  targetSkill: z.string().min(3).max(180),
  nextPrompt: z.string().min(15).max(500),
  whyThisNext: z.string().min(15).max(350),
});

export type LearningDiagnosis = z.infer<typeof diagnosisSchema>;

export function pathStatusFor(masteryEstimate: number): "active" | "ready_for_review" | "mastered" {
  if (masteryEstimate >= 82) return "mastered";
  if (masteryEstimate >= 58) return "ready_for_review";
  return "active";
}

export function parseLearningDiagnosis(content: string): LearningDiagnosis {
  const parsed: unknown = JSON.parse(content);
  return diagnosisSchema.parse(parsed);
}

export async function diagnoseLearnerWork(input: {
  topic: string;
  prompt: string;
  learnerAnswer: string;
  selfConfidence: number;
}): Promise<LearningDiagnosis> {
  const response = await invokeLLM({
    model: "gpt-5-mini",
    maxCompletionTokens: 1600,
    messages: [
      {
        role: "system",
        content:
          "You are InsightLoop, an educational diagnostic assistant. Analyse only the learner's reasoning in the supplied response. Do not infer identity, do not make health or psychological claims, and do not insult or label the learner. Identify the likely underlying misconception, produce a bounded mastery estimate and confidence, offer concise constructive feedback, then write exactly one short next diagnostic question that tests the targeted skill. The next question must not reveal the answer to the original prompt. Return only structured JSON that fits the requested schema.",
      },
      {
        role: "user",
        content: `Topic: ${input.topic}\nQuestion: ${input.prompt}\nLearner answer: ${input.learnerAnswer}\nLearner self-confidence (0-100): ${input.selfConfidence}`,
      },
    ],
    outputSchema: {
      name: "learning_diagnosis",
      strict: true,
      schema: {
        type: "object",
        properties: {
          misconceptionLabel: { type: "string" },
          misconceptionExplanation: { type: "string" },
          masteryEstimate: { type: "integer", minimum: 0, maximum: 100 },
          confidence: { type: "integer", minimum: 0, maximum: 100 },
          feedback: { type: "string" },
          targetSkill: { type: "string" },
          nextPrompt: { type: "string" },
          whyThisNext: { type: "string" },
        },
        required: [
          "misconceptionLabel",
          "misconceptionExplanation",
          "masteryEstimate",
          "confidence",
          "feedback",
          "targetSkill",
          "nextPrompt",
          "whyThisNext",
        ],
        additionalProperties: false,
      },
    },
  });

  const content = response.choices[0]?.message.content;
  if (typeof content !== "string") {
    throw new Error("InsightLoop did not receive a usable structured diagnosis.");
  }
  return parseLearningDiagnosis(content);
}
