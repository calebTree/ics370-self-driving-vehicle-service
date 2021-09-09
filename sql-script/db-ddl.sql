CREATE DATABASE self_driving_car_service;
USE self_driving_car_service;

CREATE TABLE `users` (
  `userID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` char(20) NOT NULL,
  `dateCreated` char(255) DEFAULT NULL,
  `location` char(255) DEFAULT NULL,
  UNIQUE KEY `username` (`username`)
);

CREATE TABLE `authentication` (
  `userID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `password` char(255) NOT NULL,
  `SALT` char(255) DEFAULT NULL,
  FOREIGN KEY(`userID`) REFERENCES users(`userID`) ON DELETE CASCADE
);
