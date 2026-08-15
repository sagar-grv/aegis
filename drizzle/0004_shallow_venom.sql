ALTER TABLE `aegis_decision_receipts` MODIFY COLUMN `operatorUserId` int;--> statement-breakpoint
ALTER TABLE `aegis_field_reports` MODIFY COLUMN `operatorUserId` int;--> statement-breakpoint
ALTER TABLE `aegis_decision_receipts` ADD `attribution` enum('authenticated','unattributed') DEFAULT 'authenticated' NOT NULL;--> statement-breakpoint
ALTER TABLE `aegis_field_reports` ADD `attribution` enum('authenticated','unattributed') DEFAULT 'authenticated' NOT NULL;