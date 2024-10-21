-- CreateTable
CREATE TABLE `properties` (
    `propertyID` INTEGER NOT NULL AUTO_INCREMENT,
    `propertyTag` VARCHAR(100) NOT NULL,
    `propertyName` VARCHAR(100) NOT NULL,
    `propertyServer` VARCHAR(2048) NOT NULL,
    `propertyPort` INTEGER NULL,
    `propertyConnectionString` VARCHAR(2048) NULL,

    PRIMARY KEY (`propertyID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `requestRecords` (
    `requestID` INTEGER NOT NULL AUTO_INCREMENT,
    `requestBody` TEXT NOT NULL,
    `requestType` VARCHAR(8192) NOT NULL,
    `requestDateTime` DATETIME(0) NOT NULL,
    `responseStatus` VARCHAR(20) NULL,
    `responseBody` TEXT NULL,
    `propertyID` INTEGER NOT NULL,
    `seen` BOOLEAN NULL,

    PRIMARY KEY (`requestID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `userID` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(50) NOT NULL,
    `secondName` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`userID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usersProperties` (
    `userID` INTEGER NOT NULL,
    `propertyID` INTEGER NOT NULL,

    PRIMARY KEY (`userID`, `propertyID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usersProperties` ADD CONSTRAINT `usersProperties_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `users`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usersProperties` ADD CONSTRAINT `usersProperties_propertyID_fkey` FOREIGN KEY (`propertyID`) REFERENCES `properties`(`propertyID`) ON DELETE CASCADE ON UPDATE CASCADE;
