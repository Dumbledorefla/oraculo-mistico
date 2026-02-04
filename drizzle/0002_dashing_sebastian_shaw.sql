CREATE TABLE `order_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`productName` varchar(256) NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`status` enum('pending','paid','cancelled','refunded') NOT NULL DEFAULT 'pending',
	`totalAmount` decimal(10,2) NOT NULL,
	`paymentMethod` varchar(64),
	`stripeSessionId` varchar(256),
	`stripePaymentIntentId` varchar(256),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`paidAt` timestamp,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(128) NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` text,
	`shortDescription` varchar(512),
	`category` enum('tarot','numerologia','astrologia','runas','combo') NOT NULL,
	`lifeArea` enum('amor','carreira','dinheiro','saude','familia','autoconhecimento','espiritualidade','geral') DEFAULT 'geral',
	`price` decimal(10,2) NOT NULL,
	`originalPrice` decimal(10,2),
	`imageUrl` text,
	`hasSample` boolean DEFAULT true,
	`sampleDescription` text,
	`isActive` boolean DEFAULT true,
	`isFeatured` boolean DEFAULT false,
	`isCombo` boolean DEFAULT false,
	`comboProducts` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `sample_accesses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`accessedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sample_accesses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`orderId` int,
	`grantedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	CONSTRAINT `user_products_id` PRIMARY KEY(`id`)
);
