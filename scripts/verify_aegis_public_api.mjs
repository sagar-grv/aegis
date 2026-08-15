import { eq } from "drizzle-orm";
import { getDb } from "../server/db.ts";
import { aegisDecisionReceipts, aegisFieldReports } from "../drizzle/schema.ts";

const apiBase = "http://localhost:3000/api/trpc";
const location = { latitude: 12.9716, longitude: 77.5946, siteLabel: "Bengaluru — Cubbon Park" };
let fieldReportId = null;
let receiptId = null;

async function mutation(path, input) {
  const response = await fetch(`${apiBase}/${path}?batch=1`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ 0: { json: input } }),
  });
  if (!response.ok) throw new Error(`Public ${path} returned HTTP ${response.status}.`);
  const payload = await response.json();
  if (payload[0]?.error) throw new Error(payload[0].error.json?.message ?? `Public ${path} failed.`);
  return payload[0]?.result?.data?.json;
}

try {
  const db = await getDb();
  if (!db) throw new Error("Database is not available for the public API probe.");

  const report = await mutation("aegis.reportField", {
    ...location,
    fieldCondition: "unknown",
    observedWindKph: null,
    note: "Temporary automated public API verification only. This is not an operational observation and will be deleted.",
  });
  fieldReportId = Number(report.id);
  if (report.attribution !== "unattributed") throw new Error("Public field report did not return unattributed attribution.");

  const [storedReport] = await db.select().from(aegisFieldReports).where(eq(aegisFieldReports.id, fieldReportId));
  if (!storedReport || storedReport.operatorUserId !== null || storedReport.attribution !== "unattributed") {
    throw new Error("Public field report was not persisted as an explicitly unattributed record.");
  }

  const receipt = await mutation("aegis.recordReview", {
    ...location,
    disabled: [],
    operatorAction: "request_check",
    operatorNote: "Temporary automated public API verification only; delete after test.",
  });
  receiptId = Number(receipt.receiptId);

  const [storedReceipt] = await db.select().from(aegisDecisionReceipts).where(eq(aegisDecisionReceipts.id, receiptId));
  if (!storedReceipt || storedReceipt.operatorUserId !== null || storedReceipt.attribution !== "unattributed") {
    throw new Error("Public decision receipt was not persisted as an explicitly unattributed record.");
  }

  console.log(JSON.stringify({
    status: "passed",
    publicFieldReportId: fieldReportId,
    publicReceiptId: receiptId,
    reportAttribution: storedReport.attribution,
    receiptAttribution: storedReceipt.attribution,
  }, null, 2));
} finally {
  const db = await getDb();
  if (db) {
    if (receiptId) await db.delete(aegisDecisionReceipts).where(eq(aegisDecisionReceipts.id, receiptId));
    if (fieldReportId) await db.delete(aegisFieldReports).where(eq(aegisFieldReports.id, fieldReportId));
  }
}
