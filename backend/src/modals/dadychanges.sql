ALTER TABLE `form` ADD `address` VARCHAR(100) NOT NULL AFTER `updatedAt`, 
ADD `phone_no` VARCHAR(100) NOT NULL AFTER `address`,
 ADD `type` VARCHAR(100) NOT NULL AFTER `phone_no`;