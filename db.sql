CREATE DATABASE gis_db;

--\C into gis_db;

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255)
);