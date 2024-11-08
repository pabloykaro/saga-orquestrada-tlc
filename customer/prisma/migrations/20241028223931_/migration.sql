-- CreateTable
CREATE TABLE `customers` (
    `id` VARCHAR(60) NOT NULL,
    `balance` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
