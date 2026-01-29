CREATE TABLE `chunks` (
	`id` text PRIMARY KEY NOT NULL,
	`run_id` text NOT NULL,
	`sequence_number` integer NOT NULL,
	`channel` text NOT NULL,
	`file_path` text NOT NULL,
	`client_timestamp` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch('now', 'subsec') * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch('now', 'subsec') * 1000) NOT NULL,
	FOREIGN KEY (`run_id`) REFERENCES `runs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `runs` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`noStream` integer DEFAULT false NOT NULL,
	`command` text NOT NULL,
	`status` text DEFAULT 'running' NOT NULL,
	`exit_code` integer,
	`client_timestamp` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch('now', 'subsec') * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch('now', 'subsec') * 1000) NOT NULL
);
