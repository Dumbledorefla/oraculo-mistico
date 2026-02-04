CREATE TABLE `course_enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`status` enum('active','completed','cancelled') DEFAULT 'active',
	`progress` int DEFAULT 0,
	`completedLessons` int DEFAULT 0,
	`orderId` int,
	`stripeSessionId` varchar(256),
	`enrolledAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `course_enrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_lessons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleId` int NOT NULL,
	`courseId` int NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`contentType` enum('video','text','quiz','exercise') DEFAULT 'video',
	`videoUrl` text,
	`textContent` text,
	`duration` int DEFAULT 0,
	`orderIndex` int DEFAULT 0,
	`isFree` boolean DEFAULT false,
	`isActive` boolean DEFAULT true,
	CONSTRAINT `course_lessons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`orderIndex` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	CONSTRAINT `course_modules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(128) NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`shortDescription` varchar(512),
	`category` enum('tarot','numerologia','astrologia','runas','espiritualidade','autoconhecimento') NOT NULL,
	`level` enum('iniciante','intermediario','avancado') DEFAULT 'iniciante',
	`imageUrl` text,
	`instructorId` int,
	`instructorName` varchar(256),
	`price` decimal(10,2) DEFAULT '0',
	`isFree` boolean DEFAULT true,
	`isActive` boolean DEFAULT true,
	`isFeatured` boolean DEFAULT false,
	`totalModules` int DEFAULT 0,
	`totalLessons` int DEFAULT 0,
	`totalDuration` int DEFAULT 0,
	`enrollmentCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`),
	CONSTRAINT `courses_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `lesson_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lessonId` int NOT NULL,
	`courseId` int NOT NULL,
	`isCompleted` boolean DEFAULT false,
	`watchedSeconds` int DEFAULT 0,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lesson_progress_id` PRIMARY KEY(`id`)
);
