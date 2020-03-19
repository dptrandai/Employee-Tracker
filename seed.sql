DROP DATABASE IF EXISTS emplpoyee_tracker;
CREATE DATABASE emplpoyee_tracker;

use emplpoyee_tracker;

create table employees
(
    id int NOT NULL AUTO_INCREMENT,
    first_name varchar(30),
    last_name varchar(30),
    role_id int,
    manager_id int NULL,
    PRIMARY KEY (id)
);



create table roles 
(
    id int NOT NULL AUTO_INCREMENT,
    title varchar(30),
    salary decimal(100000,4),
    department_id int,
    PRIMARY KEY (id)
);



create table department
(
    id INT NOT NULL AUTO_INCREMENT,
    name varchar(30),
    PRIMARY KEY (id)
);