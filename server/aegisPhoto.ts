import { z } from "zod";
import { invokeLLM } from "./_core/llm";

export const MAX_AEGIS_FIELD_PHOTO_BYTES = 2_500_000;

const photoMimeTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

const observationSchema = z.object({
  visualSummary: z.string().trim().min(1).max(450),
  surfaceCondition: z.enum(["dry", "wet", "obstructed", "not_determinable"]),
  visibility: z.enum(["clear", "reduced", "not_determinable"]),
  weatherIndicators: z.string().trim().min(1).max(240),
  requiresHumanCheck: z.boolean(),
}).strict();

export type AegisVisualObservation = z.infer<typeof observationSchema>;

export function parseAegisPhotoDataUrl(dataUrl: string) {
  const matched = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!matched) {
    throw new Error("Aegis accepts JPEG, PNG, or WebP field photos only.");
  }

  const mimeType = matched[1] as keyof typeof photoMimeTypes;
  const bytes = Buffer.from(matched[2], "base64");
  if (bytes.length === 0 || bytes.length > MAX_AEGIS_FIELD_PHOTO_BYTES) {
    throw new Error("Field photos must be a non-empty image of 2.5 MB or less.");
  }

  return { bytes, mimeType, extension: photoMimeTypes[mimeType] };
}

export async function extractAegisVisualObservation(dataUrl: string): Promise<AegisVisualObservation> {
  const completion = await invokeLLM({
    model: "gemini-3-flash-preview",
    max_tokens: 1024,
    outputSchema: {
      name: "aegis_visual_observation",
      strict: true,
      schema: {
        type: "object",
        additionalProperties: false,
        required: ["visualSummary", "surfaceCondition", "visibility", "weatherIndicators", "requiresHumanCheck"],
        properties: {
          visualSummary: { type: "string", maxLength: 450 },
          surfaceCondition: { type: "string", enum: ["dry", "wet", "obstructed", "not_determinable"] },
          visibility: { type: "string", enum: ["clear", "reduced", "not_determinable"] },
          weatherIndicators: { type: "string", maxLength: 240 },
          requiresHumanCheck: { type: "boolean" },
        },
      },
    },
    messages: [
      {
        role: "system",
        content: "You extract a neutral, attributable visual observation from one operator field photo for a safety evidence ledger. Describe only visible scene conditions. Never decide whether operations may proceed, never rate safety, never identify people, and do not invent details that are not visible. When uncertain, use not_determinable and set requiresHumanCheck to true.",
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Extract a concise visual observation for an outdoor-operations evidence record. This observation is context for a human operator, not a decision." },
          { type: "image_url", image_url: { url: dataUrl, detail: "low" } },
        ],
      },
    ],
  });

  const message = completion.choices[0]?.message.content;
  const content = typeof message === "string"
    ? message
    : message?.find(part => part.type === "text")?.text;

  if (!content) throw new Error("Aegis could not extract a visual observation from this field photo.");
  return observationSchema.parse(JSON.parse(content));
}
