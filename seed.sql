-- reset the database
DROP DATABASE IF EXISTS cms_DB;
CREATE DATABASE cms_DB;

-- select the database
use cms_DB;

-- department table
CREATE TABLE department(
	id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

-- role table
CREATE TABLE role(
	id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,4) NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id)
);

-- employees table
CREATE TABLE employee(
	id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id)
);

-- initilize with one department to allow all functions to work and not have null errors
INSERT INTO department (name) VALUES ("Management");