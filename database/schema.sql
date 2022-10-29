-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema heatmaps
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema heatmaps
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `heatmaps` DEFAULT CHARACTER SET utf8 ;
USE `heatmaps` ;

-- -----------------------------------------------------
-- Table `heatmaps`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heatmaps`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(265) NOT NULL,
  `email` VARCHAR(265) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `heatmaps`.`habit`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heatmaps`.`habit` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `title` VARCHAR(245) NOT NULL,
  `color` CHAR(6) NOT NULL,
  `type` ENUM('binary', 'timer') NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_habit_user_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_habit_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `heatmaps`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `heatmaps`.`habit_log`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heatmaps`.`habit_log` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `habit_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `day` DATE NOT NULL,
  `binary_value` TINYINT NULL,
  `timer_value` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_habit_log_habit1_idx` (`habit_id` ASC) VISIBLE,
  INDEX `fk_habit_log_user1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_habit_log_habit1`
    FOREIGN KEY (`habit_id`)
    REFERENCES `heatmaps`.`habit` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_habit_log_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `heatmaps`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
