CREATE DATABASE listatareas;

CREATE TABLE tareas(
  id VARCHAR(255)PRIMARY KEY,
  user_email VARCHAR(255),
  title VARCHAR(30),
  progress INT,
  date VARCHAR(300)
);

CREATE TABLE usuarios(
  email VARCHAR(255) PRIMARY KEY,
  hashed_password VARCHAR (255)
)