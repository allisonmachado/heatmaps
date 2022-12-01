/*
  Warnings:

  - You are about to drop the column `binary_value` on the `habit_log` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `habit_log` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `habit_log` DROP FOREIGN KEY `fk_habit_log_user1`;

-- AlterTable
ALTER TABLE `habit_log` DROP COLUMN `binary_value`,
    DROP COLUMN `user_id`;
