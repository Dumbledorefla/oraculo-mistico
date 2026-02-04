CREATE TABLE `tarot_readings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`readingType` varchar(64) NOT NULL,
	`cards` json NOT NULL,
	`interpretation` text,
	`userName` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tarot_readings_id` PRIMARY KEY(`id`)
);
