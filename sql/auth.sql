set
foreign_key_checks=0;

CREATE TABLE `Account`
(
    `id`                varchar(191) NOT NULL,
    `userId`            varchar(191) NOT NULL,
    `type`              varchar(191) NOT NULL,
    `provider`          varchar(191) NOT NULL,
    `providerAccountId` varchar(191) NOT NULL,
    `refresh_token`     text,
    `access_token`      text,
    `expires_at`        int,
    `token_type`        varchar(191),
    `scope`             varchar(191),
    `id_token`          text,
    `session_state`     varchar(191),
    PRIMARY KEY (`id`),
    UNIQUE KEY `Account_provider_providerAccountId_key` (`provider`, `providerAccountId`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Example`
(
    `id`        varchar(191) NOT NULL,
    `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp (3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Session`
(
    `id`           varchar(191) NOT NULL,
    `sessionToken` varchar(191) NOT NULL,
    `userId`       varchar(191) NOT NULL,
    `expires`      datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `Session_sessionToken_key` (`sessionToken`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `User`
(
    `id`            varchar(191) NOT NULL,
    `name`          varchar(191),
    `email`         varchar(191),
    `emailVerified` datetime(3),
    `image`         varchar(191),
    PRIMARY KEY (`id`),
    UNIQUE KEY `User_email_key` (`email`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `VerificationToken`
(
    `identifier` varchar(191) NOT NULL,
    `token`      varchar(191) NOT NULL,
    `expires`    datetime(3) NOT NULL,
    UNIQUE KEY `VerificationToken_token_key` (`token`),
    UNIQUE KEY `VerificationToken_identifier_token_key` (`identifier`, `token`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;
