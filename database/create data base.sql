DROP DATABASE IF EXISTS gathable;
CREATE DATABASE IF NOT EXISTS gathable;
USE gathable;
DROP TABLE IF EXISTS user_info;
CREATE TABLE IF NOT EXISTS user_info (
uid INT AUTO_INCREMENT PRIMARY KEY COMMENT "user id",
uname VARCHAR(20) NOT NULL UNIQUE COMMENT 'user name',
a_password VARCHAR(20) NOT NULL COMMENT 'account hash password',
email VARCHAR(255) NOT NULL UNIQUE COMMENT 'user email',
verified INT NOT NULL DEFAULT(0) COMMENT 'whether verified',
register_code VARCHAR(255) NOT NULL COMMENT 'hash code used for register'
);

DROP TABLE IF EXISTS event_data;
CREATE TABLE IF NOT EXISTS event_data (
id INT AUTO_INCREMENT PRIMARY KEY COMMENT "event id",
uid INT NOT NULL UNIQUE COMMENT 'user id',
start_time DATETIME NOT NULL COMMENT 'event start time',
end_time DATETIME NOT NULL  COMMENT 'event end time',
e_name VARCHAR(255) NULL COMMENT 'event name',
loc VARCHAR(255) NULL COMMENT 'event location',
CONSTRAINT fk_user_id FOREIGN KEY(uid) REFERENCES user_info(uid)
);

DROP TABLE IF EXISTS group_data;
CREATE TABLE IF NOT EXISTS group_data(
id INT AUTO_INCREMENT PRIMARY KEY COMMENT "group id",
manager INT NOT NULL COMMENT 'group manager id',
gname VARCHAR(255) NOT NULL COMMENT 'group name',
gnotice VARCHAR(255) NULL COMMENT 'group notice',
CONSTRAINT fk_manager_id FOREIGN KEY(manager) REFERENCES user_info(uid)
);

DROP TABLE IF EXISTS group_relation;
CREATE TABLE IF NOT EXISTS group_relation(
id INT AUTO_INCREMENT PRIMARY KEY,
gid INT NOT NULL COMMENT 'group id',
uid INT NOT NULL COMMENT 'user id',
ualias VARCHAR(20) NOT NULL COMMENT 'user alias' ,
CONSTRAINT fk_group_user_id FOREIGN KEY(uid) REFERENCES user_info(uid),
CONSTRAINT fk_group_id FOREIGN KEY(gid) REFERENCES group_data(id)
);

DROP TABLE IF EXISTS group_msg;
CREATE TABLE IF NOT EXISTS group_msg(
id INT AUTO_INCREMENT PRIMARY KEY,
gid INT NOT NULL COMMENT 'group id',
uid int NOT NULL COMMENT 'user id',
sendT datetime not null comment 'message send time',
txt VARCHAR(255) not NULL COMMENT 'user text',
constraint fk_meg_user_id foreign key(uid) references user_info(uid),
constraint fk_msg_group_id foreign key(gid) references group_data(id)
);