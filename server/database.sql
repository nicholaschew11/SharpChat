CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    userid VARCHAR NOT NULL UNIQUE,
    passwordhash VARCHAR NOT NULL
);

INSERT INTO users(username, passwordhash, userid) values($1,$2,$3);