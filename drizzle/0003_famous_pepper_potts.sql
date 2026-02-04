CREATE TABLE `consultation_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`consultationId` int NOT NULL,
	`userId` int NOT NULL,
	`taromanteId` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`isPublic` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `consultation_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `consultations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`taromanteId` int NOT NULL,
	`scheduledAt` timestamp NOT NULL,
	`duration` int NOT NULL DEFAULT 30,
	`status` enum('pending','confirmed','completed','cancelled','no_show') NOT NULL DEFAULT 'pending',
	`consultationType` enum('video','chat','phone') NOT NULL DEFAULT 'video',
	`topic` varchar(256),
	`notes` text,
	`price` decimal(10,2) NOT NULL,
	`stripeSessionId` varchar(256),
	`stripePaymentIntentId` varchar(256),
	`paidAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `consultations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `taromante_availability` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taromanteId` int NOT NULL,
	`dayOfWeek` int NOT NULL,
	`startTime` varchar(5) NOT NULL,
	`endTime` varchar(5) NOT NULL,
	`isActive` boolean DEFAULT true,
	CONSTRAINT `taromante_availability_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `taromante_services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taromanteId` int NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` text,
	`duration` int NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`isActive` boolean DEFAULT true,
	CONSTRAINT `taromante_services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `taromantes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`slug` varchar(128) NOT NULL,
	`name` varchar(256) NOT NULL,
	`title` varchar(256),
	`bio` text,
	`shortBio` varchar(512),
	`photoUrl` text,
	`specialties` json,
	`experience` int,
	`rating` decimal(2,1) DEFAULT '5.0',
	`totalReviews` int DEFAULT 0,
	`totalConsultations` int DEFAULT 0,
	`pricePerHour` decimal(10,2) NOT NULL,
	`pricePerSession` decimal(10,2),
	`isActive` boolean DEFAULT true,
	`isFeatured` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `taromantes_id` PRIMARY KEY(`id`),
	CONSTRAINT `taromantes_slug_unique` UNIQUE(`slug`)
);
