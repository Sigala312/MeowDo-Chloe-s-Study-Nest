/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,userId]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Tag_name_key` ON `tag`;

-- AlterTable
ALTER TABLE `category` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `tag` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Category_userId_idx` ON `Category`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `Category_name_userId_key` ON `Category`(`name`, `userId`);

-- CreateIndex
CREATE INDEX `Tag_userId_idx` ON `Tag`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `Tag_name_userId_key` ON `Tag`(`name`, `userId`);

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tag` ADD CONSTRAINT `Tag_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
