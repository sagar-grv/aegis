CREATE TABLE `aegis_decision_receipts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`operatorUserId` int NOT NULL,
	`latitude` varchar(24) NOT NULL,
	`longitude` varchar(24) NOT NULL,
	`siteLabel` varchar(140) NOT NULL,
	`decision` enum('proceed','restrict','refuse') NOT NULL,
	`confidence` int NOT NULL,
	`riskScore` int NOT NULL,
	`operatorAction` enum('approve','request_check','defer') NOT NULL,
	`operatorNote` text NOT NULL,
	`evidenceSnapshot` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `aegis_decision_receipts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `aegis_field_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`operatorUserId` int NOT NULL,
	`latitude` varchar(24) NOT NULL,
	`longitude` varchar(24) NOT NULL,
	`siteLabel` varchar(140) NOT NULL,
	`fieldCondition` enum('clear','wet','unsafe','unknown') NOT NULL,
	`observedWindKph` int,
	`note` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `aegis_field_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `aegis_receipt_operator_created_idx` ON `aegis_decision_receipts` (`operatorUserId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `aegis_field_operator_created_idx` ON `aegis_field_reports` (`operatorUserId`,`createdAt`);