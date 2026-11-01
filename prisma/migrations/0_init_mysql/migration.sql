-- CreateTable
CREATE TABLE `AdminUser` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'STAFF',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AdminUser_username_key`(`username`),
    UNIQUE INDEX `AdminUser_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Room` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `price` DOUBLE NOT NULL,
    `maximumOccupancy` INTEGER NOT NULL DEFAULT 2,
    `bedConfiguration` VARCHAR(191) NOT NULL DEFAULT '1 King Bed',
    `roomType` VARCHAR(191) NOT NULL DEFAULT 'Cottage',
    `isAc` BOOLEAN NOT NULL DEFAULT false,
    `hasAttachedBath` BOOLEAN NOT NULL DEFAULT true,
    `extraBedAvailable` BOOLEAN NOT NULL DEFAULT false,
    `foodInclusion` VARCHAR(191) NOT NULL DEFAULT 'Morning Tea / Meal options available on request',
    `amenities` TEXT NOT NULL,
    `mainImage` TEXT NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Room_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoomImage` (
    `id` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,
    `imageUrl` TEXT NOT NULL,
    `caption` VARCHAR(191) NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GalleryImage` (
    `id` VARCHAR(191) NOT NULL,
    `imageUrl` TEXT NOT NULL,
    `caption` VARCHAR(191) NULL,
    `category` VARCHAR(191) NOT NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Facility` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `icon` VARCHAR(191) NOT NULL DEFAULT 'Sparkles',
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WebsiteSettings` (
    `id` VARCHAR(191) NOT NULL,
    `resortName` VARCHAR(191) NOT NULL DEFAULT 'Hill Queen Eco Resort',
    `tagline` VARCHAR(191) NOT NULL DEFAULT 'Escape Into Nature. Stay Close to Serenity.',
    `address` VARCHAR(191) NOT NULL DEFAULT 'Mamudi, Murguma, Purulia, West Bengal, India',
    `phonePrimary` VARCHAR(191) NOT NULL DEFAULT '9735888106',
    `phoneSecondary` VARCHAR(191) NOT NULL DEFAULT '9733713255',
    `phoneTertiary` VARCHAR(191) NOT NULL DEFAULT '8670214030',
    `whatsappNumber` VARCHAR(191) NOT NULL DEFAULT '9735888106',
    `email` VARCHAR(191) NOT NULL DEFAULT 'hillqueenecoresort@gmail.com',
    `websiteUrl` VARCHAR(191) NOT NULL DEFAULT 'https://hillqueenecoresorts.com',
    `googleMapsUrl` TEXT NULL,
    `checkInTime` VARCHAR(191) NOT NULL DEFAULT '11:00 AM',
    `checkOutTime` VARCHAR(191) NOT NULL DEFAULT '10:00 AM',
    `heroHeading` VARCHAR(191) NOT NULL DEFAULT 'Discover Your Peaceful Escape.',
    `heroSubheading` VARCHAR(191) NOT NULL DEFAULT 'Experience the beauty of nature and a relaxing stay at Hill Queen Eco Resort, Murguma, Purulia.',
    `aboutText` TEXT NULL,
    `seoTitle` VARCHAR(191) NOT NULL DEFAULT 'Hill Queen Eco Resort | Luxury Nature Resort in Murguma, Purulia',
    `seoDescription` TEXT NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PageContent` (
    `id` VARCHAR(191) NOT NULL,
    `pageKey` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PageContent_pageKey_key`(`pageKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RoomImage` ADD CONSTRAINT `RoomImage_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

