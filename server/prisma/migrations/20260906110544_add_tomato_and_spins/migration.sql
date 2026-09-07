/*
  Warnings:

  - Added the required column `updatedAt` to the `WheelReward` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `WheelReward` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `wheeldrawlog` DROP FOREIGN KEY `WheelDrawLog_rewardId_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `lastTomatoDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `todayTomatoesCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `tomatoes` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `wheeldrawlog` ADD COLUMN `isRedeemed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `redeemedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `wheelreward` ADD COLUMN `categoryTag` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `WheelReward_userId_idx` ON `WheelReward`(`userId`);

-- AddForeignKey
ALTER TABLE `WheelReward` ADD CONSTRAINT `WheelReward_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WheelDrawLog` ADD CONSTRAINT `WheelDrawLog_rewardId_fkey` FOREIGN KEY (`rewardId`) REFERENCES `WheelReward`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `wheeldrawlog` RENAME INDEX `WheelDrawLog_rewardId_fkey` TO `WheelDrawLog_rewardId_idx`;

-- RenameIndex
ALTER TABLE `wheeldrawlog` RENAME INDEX `WheelDrawLog_userId_fkey` TO `WheelDrawLog_userId_idx`;
