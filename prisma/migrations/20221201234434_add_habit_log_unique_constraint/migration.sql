/*
  Warnings:

  - A unique constraint covering the columns `[habit_id,day]` on the table `habit_log` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `habit_log_habit_id_day_key` ON `habit_log`(`habit_id`, `day`);
