-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS posts;

CREATE TABLE users(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT,
    avatar TEXT
)

CREATE TABLE posts(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    post VARCHAR(255),
    username TEXT REFERENCES users(username)
)