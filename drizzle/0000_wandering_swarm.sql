CREATE TABLE `audit_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`actorType` enum('provider','analyst','system') NOT NULL,
	`actorReference` varchar(128),
	`eventType` varchar(100) NOT NULL,
	`entityType` varchar(64) NOT NULL,
	`entityId` varchar(64) NOT NULL,
	`details` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `case_decisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseId` int NOT NULL,
	`analystUserId` int NOT NULL,
	`decision` enum('start_review','monitor','close') NOT NULL,
	`note` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `case_decisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `case_evidence` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseId` int NOT NULL,
	`evidenceCode` varchar(64) NOT NULL,
	`title` varchar(160) NOT NULL,
	`explanation` text NOT NULL,
	`contribution` int NOT NULL,
	`strength` enum('context','medium','high','critical') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `case_evidence_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fraud_cases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseNumber` varchar(40) NOT NULL,
	`sourceEventId` int NOT NULL,
	`status` enum('new','in_review','monitoring','closed') NOT NULL DEFAULT 'new',
	`riskBand` enum('low','elevated','high','critical') NOT NULL,
	`riskScore` int NOT NULL,
	`recommendedAction` varchar(120) NOT NULL,
	`riskNarrative` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fraud_cases_id` PRIMARY KEY(`id`),
	CONSTRAINT `fraud_cases_number_uq` UNIQUE(`caseNumber`)
);
--> statement-breakpoint
CREATE TABLE `payment_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`provider` varchar(40) NOT NULL,
	`providerEventId` varchar(128) NOT NULL,
	`providerPaymentId` varchar(128),
	`eventType` varchar(100) NOT NULL,
	`paymentStatus` varchar(64),
	`amountPaise` varchar(24),
	`currency` varchar(8),
	`customerReferenceHash` varchar(64),
	`payloadDigest` varchar(64) NOT NULL,
	`redactedSummary` json NOT NULL,
	`receivedAt` timestamp NOT NULL DEFAULT (now()),
	`occurredAt` timestamp,
	CONSTRAINT `payment_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `payment_events_provider_event_uq` UNIQUE(`provider`,`providerEventId`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','analyst','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE INDEX `audit_events_entity_idx` ON `audit_events` (`entityType`,`entityId`);--> statement-breakpoint
CREATE INDEX `case_decisions_case_idx` ON `case_decisions` (`caseId`);--> statement-breakpoint
CREATE INDEX `case_evidence_case_idx` ON `case_evidence` (`caseId`);--> statement-breakpoint
CREATE INDEX `fraud_cases_status_idx` ON `fraud_cases` (`status`);--> statement-breakpoint
CREATE INDEX `fraud_cases_created_idx` ON `fraud_cases` (`createdAt`);--> statement-breakpoint
CREATE INDEX `payment_events_received_idx` ON `payment_events` (`receivedAt`);--> statement-breakpoint
CREATE INDEX `payment_events_type_idx` ON `payment_events` (`eventType`);