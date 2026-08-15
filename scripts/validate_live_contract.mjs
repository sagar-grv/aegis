import { readFile } from "node:fs/promises";

const result = JSON.parse(await readFile(new URL("../docs/llm_full_contract_probe_result.json", import.meta.url), "utf8"));
const content = result.choices?.[0]?.message?.content;
if (typeof content !== "string") throw new Error("The model returned no visible structured content.");
const diagnosis = JSON.parse(content);
const required = ["misconceptionLabel", "misconceptionExplanation", "masteryEstimate", "confidence", "feedback", "targetSkill", "nextPrompt", "whyThisNext"];
for (const field of required) {
  if (!(field in diagnosis)) throw new Error(`Missing diagnosis field: ${field}`);
}
if (!Number.isInteger(diagnosis.masteryEstimate) || diagnosis.masteryEstimate < 0 || diagnosis.masteryEstimate > 100) throw new Error("Invalid mastery estimate.");
if (!Number.isInteger(diagnosis.confidence) || diagnosis.confidence < 0 || diagnosis.confidence > 100) throw new Error("Invalid confidence score.");
console.log("Live InsightLoop diagnosis contract passed.");
