/*
  Warnings:

  - You are about to drop the column `userId` on the `wheelreward` table. All the data in the column will be lost.
  - Added the required column `rarity` to the `WheelReward` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `wheelreward` DROP FOREIGN KEY `WheelReward_userId_fkey`;

-- DropIndex
DROP INDEX `WheelReward_userId_idx` ON `wheelreward`;

-- AlterTable
ALTER TABLE `wheelreward` DROP COLUMN `userId`,
    ADD COLUMN `imageKey` VARCHAR(191) NULL,
    ADD COLUMN `rarity` VARCHAR(191) NOT NULL;
