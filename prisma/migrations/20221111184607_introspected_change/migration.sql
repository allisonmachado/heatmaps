-- CreateTable
CREATE TABLE `habit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `title` VARCHAR(245) NOT NULL,
    `color` CHAR(6) NOT NULL,
    `type` ENUM('binary', 'timer') NOT NULL,

    INDEX `fk_habit_user_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `habit_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `habit_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `day` DATE NOT NULL,
    `binary_value` TINYINT NULL,
    `timer_value` INTEGER NULL,

    INDEX `fk_habit_log_habit1_idx`(`habit_id`),
    INDEX `fk_habit_log_user1_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(265) NOT NULL,
    `email` VARCHAR(265) NOT NULL,

    UNIQUE INDEX `email_UNIQUE`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `habit` ADD CONSTRAINT `fk_habit_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `habit_log` ADD CONSTRAINT `fk_habit_log_habit1` FOREIGN KEY (`habit_id`) REFERENCES `habit`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `habit_log` ADD CONSTRAINT `fk_habit_log_user1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
