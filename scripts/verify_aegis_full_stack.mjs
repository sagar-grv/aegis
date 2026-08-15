import { eq } from "drizzle-orm";
import { assessEvidence, getLiveEvidence } from "../server/aegis.ts";
import { getDb, getLatestAegisFieldReport, saveAegisDecisionReceipt, saveAegisFieldReport } from "../server/db.ts";
import { aegisDecisionReceipts, aegisFieldReports, users } from "../drizzle/schema.ts";

const probeId = `aegis-probe-${crypto.randomUUID()}`;
let userId = null;
let fieldReportId = null;
let receiptId = null;

try {
  const db = await getDb();
  if (!db) throw new Error("Database is not available for the Aegis integration probe.");
  const liveEvidence = await getLiveEvidence(12.9716, 77.5946);
  const refusal = assessEvidence(liveEvidence, {}, ["weather"]);
  if (refusal.decision !== "refuse") throw new Error(`Expected refusal under weather evidence loss, received ${refusal.decision}.`);

  const userInsert = await db.insert(users).values({ openId: probeId, name: "Aegis temporary integration probe", role: "admin" });
  userId = Number(userInsert[0].insertId);
  fieldReportId = await saveAegisFieldReport({
    operatorUserId: userId, latitude: 12.9716, longitude: 77.5946, siteLabel: "Aegis temporary integration probe",
    fieldCondition: "clear", observedWindKph: null, note: "Temporary automated verification only. This is not an operational field observation and will be deleted.",
  });
  const latest = await getLatestAegisFieldReport(userId, 12.9716, 77.5946);
  if (!latest || latest.id !== fieldReportId) throw new Error("Persisted field report was not retrievable.");
  const assessment = assessEvidence(liveEvidence, { fieldCondition: latest.fieldCondition, observedWindKph: latest.observedWindKph, note: latest.note }, []);
  receiptId = await saveAegisDecisionReceipt({
    operatorUserId: userId, latitude: 12.9716, longitude: 77.5946, siteLabel: "Aegis temporary integration probe", decision: assessment.decision,
    confidence: assessment.confidence, riskScore: assessment.riskScore, operatorAction: "request_check", operatorNote: "Temporary automated verification only; delete after test.", evidenceSnapshot: assessment,
  });
  console.log(JSON.stringify({ status: "passed", liveEvidence: { timezone: liveEvidence.location.timezone, windGusts: liveEvidence.weather.windGusts, usAqi: liveEvidence.air.usAqi }, refusal: refusal.decision, assessment: assessment.decision, coverage: assessment.coverage, fieldReportId, receiptId }, null, 2));
} finally {
  const db = await getDb();
  if (db && userId) {
    if (receiptId) await db.delete(aegisDecisionReceipts).where(eq(aegisDecisionReceipts.id, receiptId));
    if (fieldReportId) await db.delete(aegisFieldReports).where(eq(aegisFieldReports.id, fieldReportId));
    await db.delete(users).where(eq(users.id, userId));
  }
}
