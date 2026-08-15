import { describe, expect, it } from "vitest";
import { MAX_AEGIS_FIELD_PHOTO_BYTES, parseAegisPhotoDataUrl } from "./aegisPhoto";

describe("Aegis field-photo validation", () => {
  it("accepts a bounded JPEG data URL and returns storage-ready bytes", () => {
    const value = `data:image/jpeg;base64,${Buffer.from("field-photo").toString("base64")}`;
    const result = parseAegisPhotoDataUrl(value);
    expect(result.mimeType).toBe("image/jpeg");
    expect(result.extension).toBe("jpg");
    expect(result.bytes.toString()).toBe("field-photo");
  });

  it("rejects unapproved file types and payloads beyond the safety bound", () => {
    expect(() => parseAegisPhotoDataUrl("data:image/gif;base64,ZmFrZQ==")).toThrow("JPEG, PNG, or WebP");
    const oversized = `data:image/png;base64,${Buffer.alloc(MAX_AEGIS_FIELD_PHOTO_BYTES + 1).toString("base64")}`;
    expect(() => parseAegisPhotoDataUrl(oversized)).toThrow("2.5 MB or less");
  });
});
