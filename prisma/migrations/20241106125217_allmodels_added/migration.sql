/*
  Warnings:

  - You are about to drop the column `endDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - Added the required column `showId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Booking` DROP COLUMN `endDate`,
    DROP COLUMN `startDate`,
    ADD COLUMN `paymentId` VARCHAR(191) NULL,
    ADD COLUMN `showId` INTEGER NOT NULL,
    ADD COLUMN `totalAmount` DECIMAL(10, 2) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `User` DROP COLUMN `password`,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `role` ENUM('ADMIN', 'THEATRE_ADMIN', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER';

-- CreateTable
CREATE TABLE `City` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `City_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Theatre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `cityId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Theatre_cityId_idx`(`cityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Screen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `theatreId` INTEGER NOT NULL,
    `capacity` INTEGER NOT NULL,
    `screenType` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Screen_theatreId_idx`(`theatreId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SeatCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `screenId` INTEGER NOT NULL,
    `basePrice` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SeatCategory_screenId_idx`(`screenId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Seat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `seatNumber` VARCHAR(191) NOT NULL,
    `row` VARCHAR(191) NOT NULL,
    `categoryId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Seat_categoryId_idx`(`categoryId`),
    UNIQUE INDEX `Seat_seatNumber_categoryId_key`(`seatNumber`, `categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Movie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `duration` INTEGER NOT NULL,
    `language` VARCHAR(191) NOT NULL,
    `rating` DOUBLE NULL,
    `releaseDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `posterUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Movie_releaseDate_idx`(`releaseDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Show` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `movieId` INTEGER NOT NULL,
    `screenId` INTEGER NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `status` ENUM('SCHEDULED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'SCHEDULED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Show_movieId_idx`(`movieId`),
    INDEX `Show_screenId_idx`(`screenId`),
    INDEX `Show_startTime_idx`(`startTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SeatLock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `showId` INTEGER NOT NULL,
    `seatId` INTEGER NOT NULL,
    `lockExpiresAt` DATETIME(3) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `SeatLock_lockExpiresAt_idx`(`lockExpiresAt`),
    UNIQUE INDEX `SeatLock_showId_seatId_key`(`showId`, `seatId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BookingToSeat` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_BookingToSeat_AB_unique`(`A`, `B`),
    INDEX `_BookingToSeat_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Booking_showId_idx` ON `Booking`(`showId`);

-- AddForeignKey
ALTER TABLE `Theatre` ADD CONSTRAINT `Theatre_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Screen` ADD CONSTRAINT `Screen_theatreId_fkey` FOREIGN KEY (`theatreId`) REFERENCES `Theatre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SeatCategory` ADD CONSTRAINT `SeatCategory_screenId_fkey` FOREIGN KEY (`screenId`) REFERENCES `Screen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Seat` ADD CONSTRAINT `Seat_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `SeatCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Show` ADD CONSTRAINT `Show_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Show` ADD CONSTRAINT `Show_screenId_fkey` FOREIGN KEY (`screenId`) REFERENCES `Screen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_showId_fkey` FOREIGN KEY (`showId`) REFERENCES `Show`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SeatLock` ADD CONSTRAINT `SeatLock_showId_fkey` FOREIGN KEY (`showId`) REFERENCES `Show`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BookingToSeat` ADD CONSTRAINT `_BookingToSeat_A_fkey` FOREIGN KEY (`A`) REFERENCES `Booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BookingToSeat` ADD CONSTRAINT `_BookingToSeat_B_fkey` FOREIGN KEY (`B`) REFERENCES `Seat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
