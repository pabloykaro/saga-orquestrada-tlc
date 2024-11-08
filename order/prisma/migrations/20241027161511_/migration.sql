-- CreateTable
CREATE TABLE `orders` (
    `id` VARCHAR(60) NOT NULL,
    `customer_id` VARCHAR(60) NOT NULL,
    `product_name` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
