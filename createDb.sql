DROP DATABASE IF EXISTS gathable;
CREATE DATABASE IF NOT EXISTS gathable;
USE gathable;

DROP TABLE IF EXISTS user_info;
CREATE TABLE IF NOT EXISTS user_info (
uid INT AUTO_INCREMENT PRIMARY KEY COMMENT "user id",
uname VARCHAR(20) NOT NULL UNIQUE COMMENT 'user name',
a_password VARCHAR(64) NOT NULL COMMENT 'account hash password',
email VARCHAR(255) NOT NULL UNIQUE COMMENT 'user email',
verified INT NOT NULL DEFAULT(0) COMMENT 'whether verified',
register_code VARCHAR(64) NOT NULL COMMENT 'hash code used for register'
reset_code VARCHAR(64) NOT NULL COMMENT 'hash code used for reset password' -- default value is 'nil'
);

DROP TABLE IF EXISTS event_data;
CREATE TABLE IF NOT EXISTS event_data (
id INT AUTO_INCREMENT PRIMARY KEY COMMENT "event id",
uname VARCHAR(20) NOT NULL COMMENT 'username',
e_name VARCHAR(20) NULL COMMENT 'event name',
day VARCHAR(15) NOT NULL  COMMENT 'Monday Tuesday ...',
start_time VARCHAR(5) NOT NULL COMMENT 'event start time',
end_time VARCHAR(5) NOT NULL  COMMENT 'event end time',
);

DROP TABLE IF EXISTS group_data;
CREATE TABLE IF NOT EXISTS group_data(
id INT AUTO_INCREMENT PRIMARY KEY COMMENT "group id",
manager VARCHAR(20) NOT NULL COMMENT 'group manager',
gname VARCHAR(20) NOT NULL COMMENT 'group name',
gnotice VARCHAR(100) NULL COMMENT 'group notice',
ghash VARCHAR(64) COMMENT 'group id hash'
);

DROP TABLE IF EXISTS group_relation;
CREATE TABLE IF NOT EXISTS group_relation(
id INT AUTO_INCREMENT PRIMARY KEY,
gid INT NOT NULL COMMENT 'group id',
uname VARCHAR(20) NOT NULL COMMENT 'username' ,
);