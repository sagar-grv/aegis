CREATE TABLE `learning_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`learnerUserId` int NOT NULL,
	`topic` varchar(160) NOT NULL,
	`prompt` text NOT NULL,
	`learnerAnswer` text NOT NULL,
	`selfConfidence` int NOT NULL,
	`diagnosis` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `learning_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `learning_paths` (
	`id` int AUTO_INCREMENT NOT NULL,
	`learnerUserId` int NOT NULL,
	`topic` varchar(160) NOT NULL,
	`targetSkill` varchar(180) NOT NULL,
	`misconceptionLabel` varchar(180) NOT NULL,
	`masteryEstimate` int NOT NULL,
	`nextPrompt` text NOT NULL,
	`status` enum('active','ready_for_review','mastered') NOT NULL DEFAULT 'active',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `learning_paths_id` PRIMARY KEY(`id`),
	CONSTRAINT `learning_paths_learner_topic_uq` UNIQUE(`learnerUserId`,`topic`)
);
--> statement-breakpoint
CREATE INDEX `learning_attempts_learner_created_idx` ON `learning_attempts` (`learnerUserId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `learning_attempts_topic_idx` ON `learning_attempts` (`topic`);--> statement-breakpoint
CREATE INDEX `learning_paths_learner_updated_idx` ON `learning_paths` (`learnerUserId`,`updatedAt`);