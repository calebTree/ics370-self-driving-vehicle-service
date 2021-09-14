CREATE DATABASE self_driving_car_service;
USE self_driving_car_service;

CREATE TABLE `users` (
  `userID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` char(20) NOT NULL,
  `dateCreated` char(28) DEFAULT NULL,
  `location` char(255) DEFAULT NULL,
  UNIQUE KEY `username` (`username`)
);

CREATE TABLE `authentication` (
  `userID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `password` char(28) NOT NULL,
  `salt` char(12) NOT NULL,
  FOREIGN KEY(`userID`) REFERENCES users(`userID`) ON DELETE CASCADE
);
