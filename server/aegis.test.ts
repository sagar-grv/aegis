import { describe, expect, it } from "vitest";
import { assessEvidence, type LiveEvidence } from "./aegis";

const evidence: LiveEvidence = {
  location: { latitude: 12.97, longitude: 77.59, timezone: "Asia/Kolkata" },
  weather: { temperature: 26, apparentTemperature: 27, precipitation: 0, windSpeed: 9, windGusts: 22, code: 1, observedAt: "2026-08-15T12:00" },
  rain: { probability: 12, forecastAt: "2026-08-15T12:00" },
  air: { pm25: 10, pm10: 18, nitrogenDioxide: 7, ozone: 12, usAqi: 32, observedAt: "2026-08-15T12:00" },
};

describe("Aegis evidence-weighted decision engine", () => {
  it("proceeds only when the live evidence is sufficiently complete and benign", () => {
    const result = assessEvidence(evidence, { fieldCondition: "clear", note: "Ground is dry and access is normal." });
    expect(result.decision).toBe("proceed");
    expect(result.confidence).toBeGreaterThanOrEqual(90);
  });

  it("restricts operations when live evidence indicates meaningful exposure", () => {
    const result = assessEvidence({ ...evidence, weather: { ...evidence.weather, windGusts: 56 } }, { fieldCondition: "wet", note: "Loose equipment is moving in exposed areas." });
    expect(result.decision).toBe("restrict");
    expect(result.anomalies.some(item => item.label === "High gust exposure")).toBe(true);
  });

  it("refuses to act when 30% evidence loss removes decisive weather context", () => {
    const result = assessEvidence(evidence, {}, ["weather"]);
    expect(result.decision).toBe("refuse");
    expect(result.smallestMissingFact).toContain("wind-gust");
  });

  it("does not let a visual observation independently change evidence coverage or decision authority", () => {
    const withoutVisualObservation = assessEvidence(evidence, {});
    const withVisualObservationOnly = assessEvidence(evidence, {
      visualObservation: {
        visualSummary: "A paved walkway and open sky are visible.",
        surfaceCondition: "dry",
        visibility: "clear",
        weatherIndicators: "No visible precipitation.",
        requiresHumanCheck: false,
      },
    });

    expect(withVisualObservationOnly.decision).toBe(withoutVisualObservation.decision);
    expect(withVisualObservationOnly.coverage).toBe(withoutVisualObservation.coverage);
    expect(withVisualObservationOnly.sources.find(source => source.id === "field")?.state).toBe("missing");
  });
});
