CREATE DATABASE self_driving_car_service;
USE self_driving_car_service;

CREATE TABLE `users` (
  `userID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` char(20) NOT NULL,
  `password` char(255) NOT NULL,
  `dateCreated` blob DEFAULT NULL,
  `location` blob DEFAULT NULL,
  UNIQUE KEY `username` (`username`)
);
