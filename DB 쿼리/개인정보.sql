#CREATE TABLE `jolup`.`privacy` (
#  `user_id` INT NOT NULL AUTO_INCREMENT,
#  `name` VARCHAR(45) NOT NULL,
#  `id` VARCHAR(45) NOT NULL,
#  `password` VARCHAR(45) NOT NULL,
#  `live_code` INT NULL,
#  PRIMARY KEY (`user_id`, `id`))
#ENGINE = InnoDB
#DEFAULT CHARACTER SET = utf8
#COLLATE = utf8_bin
#COMMENT = '유저들의 개인정보이다';

#alter table jolup.privacy add admin boolean not null; 

#INSERT INTO jolup.privacy (`name`, `id`, `password`) VALUES ('박준희', 'tkfyd123', '1q2w3e4r!!');
#INSERT INTO jolup.privacy (`name`, `id`, `password`, `live_code`, `admin`) VALUES ('김성우', 'voicemaker', 'aas212', 0, 0);
#DELETE FROM jolup.privacy WHERE user_id > 0;
#ALTER TABLE jolup.privacy AUTO_INCREMENT=1;
SELECT * FROM jolup.privacy