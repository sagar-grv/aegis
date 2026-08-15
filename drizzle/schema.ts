import { index, int, json, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/** Core user table backing the built-in analyst authentication flow. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "analyst", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/**
 * A de-duplicated inbound gateway event. The original raw payload is never persisted;
 * only its SHA-256 digest and a deliberately redacted operational summary are retained.
 */
export const paymentEvents = mysqlTable("payment_events", {
  id: int("id").autoincrement().primaryKey(),
  provider: varchar("provider", { length: 40 }).notNull(),
  providerEventId: varchar("providerEventId", { length: 128 }).notNull(),
  providerPaymentId: varchar("providerPaymentId", { length: 128 }),
  eventType: varchar("eventType", { length: 100 }).notNull(),
  paymentStatus: varchar("paymentStatus", { length: 64 }),
  amountPaise: varchar("amountPaise", { length: 24 }),
  currency: varchar("currency", { length: 8 }),
  customerReferenceHash: varchar("customerReferenceHash", { length: 64 }),
  payloadDigest: varchar("payloadDigest", { length: 64 }).notNull(),
  redactedSummary: json("redactedSummary").notNull(),
  receivedAt: timestamp("receivedAt").defaultNow().notNull(),
  occurredAt: timestamp("occurredAt"),
}, table => ({
  providerEventUnique: uniqueIndex("payment_events_provider_event_uq").on(table.provider, table.providerEventId),
  receivedAtIdx: index("payment_events_received_idx").on(table.receivedAt),
  eventTypeIdx: index("payment_events_type_idx").on(table.eventType),
}));

/** A human-review case created from a configured gateway-risk rule. */
export const fraudCases = mysqlTable("fraud_cases", {
  id: int("id").autoincrement().primaryKey(),
  caseNumber: varchar("caseNumber", { length: 40 }).notNull(),
  sourceEventId: int("sourceEventId").notNull(),
  status: mysqlEnum("status", ["new", "in_review", "monitoring", "closed"]).default("new").notNull(),
  riskBand: mysqlEnum("riskBand", ["low", "elevated", "high", "critical"]).notNull(),
  riskScore: int("riskScore").notNull(),
  recommendedAction: varchar("recommendedAction", { length: 120 }).notNull(),
  riskNarrative: text("riskNarrative").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({
  caseNumberUnique: uniqueIndex("fraud_cases_number_uq").on(table.caseNumber),
  statusIdx: index("fraud_cases_status_idx").on(table.status),
  createdAtIdx: index("fraud_cases_created_idx").on(table.createdAt),
}));

/** Individual, explainable rule outputs tied to a review case. */
export const caseEvidence = mysqlTable("case_evidence", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("caseId").notNull(),
  evidenceCode: varchar("evidenceCode", { length: 64 }).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  explanation: text("explanation").notNull(),
  contribution: int("contribution").notNull(),
  strength: mysqlEnum("strength", ["context", "medium", "high", "critical"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ caseIdx: index("case_evidence_case_idx").on(table.caseId) }));

/** Analyst decisions only; the product never performs provider-side money movement. */
export const caseDecisions = mysqlTable("case_decisions", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("caseId").notNull(),
  analystUserId: int("analystUserId").notNull(),
  decision: mysqlEnum("decision", ["start_review", "monitor", "close"]).notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ caseIdx: index("case_decisions_case_idx").on(table.caseId) }));

/** Append-only activity audit for provider intake and human case actions. */
export const auditEvents = mysqlTable("audit_events", {
  id: int("id").autoincrement().primaryKey(),
  actorType: mysqlEnum("actorType", ["provider", "analyst", "system"]).notNull(),
  actorReference: varchar("actorReference", { length: 128 }),
  eventType: varchar("eventType", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 64 }).notNull(),
  entityId: varchar("entityId", { length: 64 }).notNull(),
  details: json("details").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ entityIdx: index("audit_events_entity_idx").on(table.entityType, table.entityId) }));

/** A real learner response submitted through the authenticated learner workspace. */
export const learningAttempts = mysqlTable("learning_attempts", {
  id: int("id").autoincrement().primaryKey(),
  learnerUserId: int("learnerUserId").notNull(),
  topic: varchar("topic", { length: 160 }).notNull(),
  prompt: text("prompt").notNull(),
  learnerAnswer: text("learnerAnswer").notNull(),
  selfConfidence: int("selfConfidence").notNull(),
  diagnosis: json("diagnosis").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({
  learnerCreatedIdx: index("learning_attempts_learner_created_idx").on(table.learnerUserId, table.createdAt),
  topicIdx: index("learning_attempts_topic_idx").on(table.topic),
}));

/** The latest adaptive next step for each learner-topic pair. */
export const learningPaths = mysqlTable("learning_paths", {
  id: int("id").autoincrement().primaryKey(),
  learnerUserId: int("learnerUserId").notNull(),
  topic: varchar("topic", { length: 160 }).notNull(),
  targetSkill: varchar("targetSkill", { length: 180 }).notNull(),
  misconceptionLabel: varchar("misconceptionLabel", { length: 180 }).notNull(),
  masteryEstimate: int("masteryEstimate").notNull(),
  nextPrompt: text("nextPrompt").notNull(),
  status: mysqlEnum("status", ["active", "ready_for_review", "mastered"]).default("active").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({
  learnerTopicUnique: uniqueIndex("learning_paths_learner_topic_uq").on(table.learnerUserId, table.topic),
  learnerUpdatedIdx: index("learning_paths_learner_updated_idx").on(table.learnerUserId, table.updatedAt),
}));

/** Genuine operator observations supplied through the Aegis Live Decision Desk. */
export const aegisFieldReports = mysqlTable("aegis_field_reports", {
  id: int("id").autoincrement().primaryKey(),
  operatorUserId: int("operatorUserId").notNull(),
  latitude: varchar("latitude", { length: 24 }).notNull(),
  longitude: varchar("longitude", { length: 24 }).notNull(),
  siteLabel: varchar("siteLabel", { length: 140 }).notNull(),
  fieldCondition: mysqlEnum("fieldCondition", ["clear", "wet", "unsafe", "unknown"]).notNull(),
  observedWindKph: int("observedWindKph"),
  note: text("note").notNull(),
  photoUrl: varchar("photoUrl", { length: 512 }),
  visualObservation: json("visualObservation"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ operatorCreatedIdx: index("aegis_field_operator_created_idx").on(table.operatorUserId, table.createdAt) }));

/** Human confirmation is recorded separately from the recommendation, preserving accountability. */
export const aegisDecisionReceipts = mysqlTable("aegis_decision_receipts", {
  id: int("id").autoincrement().primaryKey(),
  operatorUserId: int("operatorUserId").notNull(),
  latitude: varchar("latitude", { length: 24 }).notNull(),
  longitude: varchar("longitude", { length: 24 }).notNull(),
  siteLabel: varchar("siteLabel", { length: 140 }).notNull(),
  decision: mysqlEnum("decision", ["proceed", "restrict", "refuse"]).notNull(),
  confidence: int("confidence").notNull(),
  riskScore: int("riskScore").notNull(),
  operatorAction: mysqlEnum("operatorAction", ["approve", "request_check", "defer"]).notNull(),
  operatorNote: text("operatorNote").notNull(),
  evidenceSnapshot: json("evidenceSnapshot").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ operatorCreatedIdx: index("aegis_receipt_operator_created_idx").on(table.operatorUserId, table.createdAt) }));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
