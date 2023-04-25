create table Supermarket
(
    id        VARCHAR(191) not null,
    `name`    VARCHAR(191) not null,
    userId    VARCHAR(191) not null,
    FOREIGN KEY (userId) REFERENCES User (id),
    createdAt DATETIME(3)  not null default current_timestamp(3),
    PRIMARY KEY (id)
) charset utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Category`
(
    `id`            varchar(191) NOT NULL,
    `name`          varchar(191) NOT NULL,
    `supermarketId` varchar(191) NOT NULL,
    `createdAt`     datetime(3)  NOT NULL DEFAULT current_timestamp(3),
    FOREIGN KEY (supermarketId) REFERENCES Supermarket (id),
    PRIMARY KEY (`id`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Product`
(
    `id`            varchar(191) NOT NULL,
    `code`          varchar(191) NOT NULL,
    `name`          text         NOT NULL,
    `description`   text         NOT NULL,
    `unit`          varchar(191) NOT NULL,
    `cost`          int          NOT NULL,
    `quantityLeft`  int          NOT NULL,
    `dateDelivered` datetime(3),
    `supplierId`    varchar(191) NOT NULL,
    `categoryId`    varchar(191) NOT NULL,
    `supermarketId` varchar(191) NOT NULL,
    `createdAt`     datetime(3)  NOT NULL DEFAULT current_timestamp(3),
    FOREIGN KEY (supermarketId) REFERENCES Supermarket (id),
    FOREIGN KEY (supplierId) REFERENCES Supplier (id),
    PRIMARY KEY (`id`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Sale`
(
    `id`            varchar(191) NOT NULL,
    `productId`     varchar(191) NOT NULL,
    `supermarketId` varchar(191) NOT NULL,
    `quantity`      int          NOT NULL,
    `saleDate`      datetime(3)  NOT NULL DEFAULT current_timestamp(3),
    FOREIGN KEY (productId) REFERENCES Product (id),
    FOREIGN KEY (supermarketId) REFERENCES Supermarket (id),
    PRIMARY KEY (`id`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Supplier`
(
    `id`            varchar(191) NOT NULL,
    `name`          varchar(191) NOT NULL,
    `email`         varchar(191) NOT NULL,
    `supermarketId` varchar(191) NOT NULL,
    `createdAt`     datetime(3)  NOT NULL DEFAULT current_timestamp(3),
    FOREIGN KEY (supermarketId) REFERENCES Supermarket (id),
    PRIMARY KEY (`id`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `SupplierOrder`
(
    `id`           varchar(191) NOT NULL,
    `deliveryDate` datetime(3)  NOT NULL,
    `productId`    varchar(191) NOT NULL,
    `supplierId`   varchar(191) NOT NULL,
    `quantity`     int          NOT NULL,
    `status`       varchar(191) NOT NULL,
    `createdAt`    datetime(3)  NOT NULL DEFAULT current_timestamp(3),
    FOREIGN KEY (supplierId) REFERENCES Supplier (id),
    PRIMARY KEY (`id`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;
