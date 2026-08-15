export type AegisSourceId = "weather" | "rain" | "air" | "field";
export type SourceState = "live" | "operator" | "missing" | "fault_injected";
export type AegisDecision = "proceed" | "restrict" | "refuse";

export type FieldReportInput = {
  siteLabel?: string;
  fieldCondition?: "clear" | "wet" | "unsafe" | "unknown";
  observedWindKph?: number | null;
  note?: string;
  visualObservation?: { visualSummary?: string; surfaceCondition?: string; visibility?: string; weatherIndicators?: string; requiresHumanCheck?: boolean } | null;
};

export type LiveEvidence = {
  weather: { temperature: number; apparentTemperature: number; precipitation: number; windSpeed: number; windGusts: number; code: number; observedAt: string };
  rain: { probability: number; forecastAt: string };
  air: { pm25: number; pm10: number; nitrogenDioxide: number; ozone: number; usAqi: number; observedAt: string };
  location: { latitude: number; longitude: number; timezone: string };
};

const OPEN_METEO = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY = "https://air-quality-api.open-meteo.com/v1/air-quality";

export async function getLiveEvidence(latitude: number, longitude: number): Promise<LiveEvidence> {
  const weatherUrl = new URL(OPEN_METEO);
  weatherUrl.searchParams.set("latitude", String(latitude));
  weatherUrl.searchParams.set("longitude", String(longitude));
  weatherUrl.searchParams.set("current", "temperature_2m,apparent_temperature,precipitation,wind_speed_10m,wind_gusts_10m,weather_code");
  weatherUrl.searchParams.set("hourly", "precipitation_probability");
  weatherUrl.searchParams.set("forecast_days", "1");
  weatherUrl.searchParams.set("timezone", "auto");

  const airUrl = new URL(AIR_QUALITY);
  airUrl.searchParams.set("latitude", String(latitude));
  airUrl.searchParams.set("longitude", String(longitude));
  airUrl.searchParams.set("current", "pm2_5,pm10,nitrogen_dioxide,ozone,us_aqi");
  airUrl.searchParams.set("timezone", "auto");

  const [weatherResponse, airResponse] = await Promise.all([fetch(weatherUrl, { signal: AbortSignal.timeout(10_000) }), fetch(airUrl, { signal: AbortSignal.timeout(10_000) })]);
  if (!weatherResponse.ok || !airResponse.ok) throw new Error("Live environmental sources are temporarily unavailable.");
  const weather = await weatherResponse.json();
  const air = await airResponse.json();
  const currentHour = new Date(weather.current.time).getHours();
  const probability = Number(weather.hourly?.precipitation_probability?.[currentHour] ?? 0);

  return {
    location: { latitude: Number(weather.latitude ?? latitude), longitude: Number(weather.longitude ?? longitude), timezone: String(weather.timezone ?? "UTC") },
    weather: {
      temperature: Number(weather.current.temperature_2m), apparentTemperature: Number(weather.current.apparent_temperature), precipitation: Number(weather.current.precipitation),
      windSpeed: Number(weather.current.wind_speed_10m), windGusts: Number(weather.current.wind_gusts_10m), code: Number(weather.current.weather_code), observedAt: String(weather.current.time),
    },
    rain: { probability, forecastAt: String(weather.current.time) },
    air: {
      pm25: Number(air.current.pm2_5), pm10: Number(air.current.pm10), nitrogenDioxide: Number(air.current.nitrogen_dioxide), ozone: Number(air.current.ozone), usAqi: Number(air.current.us_aqi), observedAt: String(air.current.time),
    },
  };
}

function clamp(value: number) { return Math.max(0, Math.min(100, Math.round(value))); }
function sourceState(id: AegisSourceId, disabled: AegisSourceId[], hasField: boolean): SourceState {
  if (disabled.includes(id)) return "fault_injected";
  if (id === "field") return hasField ? "operator" : "missing";
  return "live";
}

export function assessEvidence(evidence: LiveEvidence, field: FieldReportInput = {}, disabled: AegisSourceId[] = []) {
  const hasField = Boolean(field.note?.trim()) || Boolean(field.fieldCondition && field.fieldCondition !== "unknown") || typeof field.observedWindKph === "number";
  const sources = (Object.keys({ weather: 1, rain: 1, air: 1, field: 1 }) as AegisSourceId[]).map(id => ({ id, state: sourceState(id, disabled, hasField) }));
  const present = sources.filter(source => source.state === "live" || source.state === "operator").length;
  const coverage = Math.round((present / sources.length) * 100);
  const weatherMissing = sources.find(source => source.id === "weather")?.state !== "live";
  const airMissing = sources.find(source => source.id === "air")?.state !== "live";
  const rainMissing = sources.find(source => source.id === "rain")?.state !== "live";
  const fieldMissing = sources.find(source => source.id === "field")?.state === "missing";

  const anomalies: { label: string; explanation: string; severity: "watch" | "high" }[] = [];
  if (!weatherMissing && hasField && typeof field.observedWindKph === "number" && Math.abs(field.observedWindKph - evidence.weather.windGusts) >= 18) anomalies.push({ label: "Wind disagreement", explanation: `Field observation (${field.observedWindKph} km/h) differs materially from the live gust estimate (${evidence.weather.windGusts} km/h).`, severity: "high" });
  if (!weatherMissing && evidence.weather.windGusts >= 45) anomalies.push({ label: "High gust exposure", explanation: `Live gust estimate is ${evidence.weather.windGusts} km/h.`, severity: "high" });
  if (!airMissing && evidence.air.usAqi >= 101) anomalies.push({ label: "Air-quality degradation", explanation: `Current US AQI is ${evidence.air.usAqi}.`, severity: evidence.air.usAqi >= 151 ? "high" : "watch" });
  if (!rainMissing && evidence.rain.probability >= 70) anomalies.push({ label: "High rain likelihood", explanation: `Near-term precipitation probability is ${evidence.rain.probability}%.`, severity: "watch" });
  if (field.fieldCondition === "unsafe") anomalies.push({ label: "Operator safety concern", explanation: "The operator marked the current field condition unsafe.", severity: "high" });

  let riskScore = 0;
  if (!weatherMissing) riskScore += Math.min(30, Math.max(0, evidence.weather.windGusts - 20));
  if (!airMissing) riskScore += Math.min(30, Math.max(0, evidence.air.usAqi - 50) * 0.35);
  if (!rainMissing) riskScore += evidence.rain.probability * 0.16;
  if (field.fieldCondition === "wet") riskScore += 12;
  if (field.fieldCondition === "unsafe") riskScore += 38;
  riskScore = clamp(riskScore);

  const confidence = clamp(coverage - anomalies.filter(item => item.label === "Wind disagreement").length * 18 - (weatherMissing ? 10 : 0));
  let smallestMissingFact = "A current operator observation of ground condition and wind exposure.";
  if (weatherMissing) smallestMissingFact = "A fresh on-site wind-gust reading, because wind changes the immediate safety recommendation most.";
  else if (airMissing) smallestMissingFact = "A current local air-quality reading, because it resolves exposure risk for outdoor teams.";
  else if (rainMissing) smallestMissingFact = "A short-range precipitation observation, because it resolves surface and electrical risk.";
  else if (fieldMissing) smallestMissingFact = "A current operator field condition report, because it validates whether sensor conditions match the site.";

  const refuses = confidence < 60 || (weatherMissing && fieldMissing);
  const hasHighSeverityAnomaly = anomalies.some(item => item.severity === "high");
  const decision: AegisDecision = refuses ? "refuse" : riskScore >= 45 || hasHighSeverityAnomaly ? "restrict" : "proceed";
  const action = decision === "refuse" ? "Do not issue an autonomous operational recommendation." : decision === "restrict" ? "Restrict exposed outdoor activity and require operator acknowledgement." : "Proceed with normal monitoring and refresh on material change.";
  const rationale = decision === "refuse" ? `Evidence coverage is ${coverage}% and confidence is ${confidence}%. Aegis declines to convert uncertainty into a false recommendation.` : decision === "restrict" ? `Evidence is sufficiently complete (${coverage}%), but observed conditions produce a risk score of ${riskScore}.` : `Evidence is sufficiently complete (${coverage}%) and no high-severity conflict requires restriction.`;

  return { decision, action, rationale, confidence, coverage, riskScore, smallestMissingFact, sources, anomalies, liveEvidence: evidence };
}
