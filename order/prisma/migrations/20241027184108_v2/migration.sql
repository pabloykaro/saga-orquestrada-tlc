/*
  Warnings:

  - Added the required column `created_at` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `approved_at` DATETIME(3) NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL,
    ADD COLUMN `rejected_at` DATETIME(3) NULL,
    ADD COLUMN `status` VARCHAR(12) NOT NULL;
