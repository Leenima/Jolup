#CREATE TABLE `jolup`.`notice` (
#  `id` INT NOT NULL AUTO_INCREMENT,
#  `title` VARCHAR(45) NOT NULL,
#  `name` VARCHAR(45) NOT NULL,
#  `date` DATE NOT NULL,
#  `notice` TEXT(10000) NOT NULL,
#  PRIMARY KEY (`id`))
#ENGINE = InnoDB
#DEFAULT CHARACTER SET = utf8
#COLLATE = utf8_bin
#COMMENT = '공지사항을 저장한다.';

#alter table jolup.privacy add admin boolean not null; 


#INSERT INTO jolup.notice (`title`, `name`, `date`, `notice`) VALUES ('공지사항입니다', '박민철', '11.1.01', '지금 이거 확인중인데요 한번 잘 되나 봅시다 어디어디.... 흠....');
#DELETE FROM jolup.notice WHERE id > 0;
#ALTER TABLE jolup.notice AUTO_INCREMENT=1;

SELECT * FROM jolup.notice