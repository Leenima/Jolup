#CREATE TABLE `jolup`.`code` (
#  `id` INT NOT NULL AUTO_INCREMENT,
#  `name` VARCHAR(45) NOT NULL,
#  `GuestName` VARCHAR(45) NOT NULL,
#  `GuestOther` TEXT(200) NOT NULL,
#  `Date` DATE NOT NULL,
#  `password` VARCHAR(45) NOT NULL,
#  `machine_id` INT NOT NULL,
#  PRIMARY KEY (`id`))
#ENGINE = InnoDB
#DEFAULT CHARACTER SET = utf8
#COLLATE = utf8_bin
#COMMENT = '비밀번호 저장장소';


#INSERT INTO jolup.notice (`name`, `name`, `date`, `notice`) VALUES ('공지사항입니다', '박민철', '11.1.01', '지금 이거 확인중인데요 한번 잘 되나 봅시다 어디어디.... 흠....');
#DELETE FROM jolup.notice WHERE id > 0;
#ALTER TABLE jolup.notice AUTO_INCREMENT=1;

SELECT * FROM jolup.code
