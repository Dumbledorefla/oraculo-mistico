CREATE TABLE `mercado_pago_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`order_id` int NOT NULL,
	`preference_id` varchar(255) NOT NULL,
	`payment_id` varchar(255),
	`status` enum('pending','approved','authorized','in_process','in_mediation','rejected','cancelled','refunded','charged_back') NOT NULL DEFAULT 'pending',
	`status_detail` varchar(100),
	`payment_type` varchar(50),
	`amount` decimal(10,2) NOT NULL,
	`paid_amount` decimal(10,2),
	`payer_email` varchar(255),
	`webhook_data` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mercado_pago_transactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `mercado_pago_transactions_preference_id_unique` UNIQUE(`preference_id`),
	CONSTRAINT `mercado_pago_transactions_payment_id_unique` UNIQUE(`payment_id`)
);
--> statement-breakpoint
CREATE TABLE `payment_methods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`type` enum('credit_card','pix','boleto','wallet','manual') NOT NULL,
	`provider` varchar(50) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`config` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payment_methods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payment_proofs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`order_id` int NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`file_url` varchar(500) NOT NULL,
	`file_name` varchar(255) NOT NULL,
	`file_size` int NOT NULL,
	`payment_method` varchar(50) NOT NULL,
	`payment_date` timestamp NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`notes` text,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`reviewed_by` varchar(255),
	`reviewed_at` timestamp,
	`review_notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payment_proofs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payment_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` text NOT NULL,
	`description` text,
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payment_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `payment_settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `pix_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`order_id` int NOT NULL,
	`txid` varchar(255) NOT NULL,
	`qr_code` text NOT NULL,
	`qr_code_text` text NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`status` enum('pending','paid','expired','cancelled') NOT NULL DEFAULT 'pending',
	`payer_name` varchar(255),
	`payer_document` varchar(20),
	`paid_at` timestamp,
	`expires_at` timestamp NOT NULL,
	`webhook_data` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pix_transactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `pix_transactions_txid_unique` UNIQUE(`txid`)
);
--> statement-breakpoint
CREATE TABLE `webhook_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`provider` varchar(50) NOT NULL,
	`event_type` varchar(100) NOT NULL,
	`payload` text NOT NULL,
	`processed` boolean NOT NULL DEFAULT false,
	`processed_at` timestamp,
	`error_message` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `webhook_logs_id` PRIMARY KEY(`id`)
);
