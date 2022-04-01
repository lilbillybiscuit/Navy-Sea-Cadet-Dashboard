const mysql = require('mysql2/promise');
const fs = require('fs');
let rawdata = fs.readFileSync('config.json');
let config = JSON.parse(rawdata);

//make sure you created the database with "CREATE DATABASE [database name]"
const connection = await mysql.createConnection({
    host: config.database.host,
    user: config.database.user, 
    password: config.database.password,
    database: config.database.database
});

await connection.execute(`CREATE TABLE IF NOT EXISTS "accounts" (
    "id" int(11) NOT NULL AUTO_INCREMENT,
    "username" varchar(50) NOT NULL,
    "password" varchar(255) NOT NULL,
    "email" varchar(100) NOT NULL,
    PRIMARY KEY ("id")
    ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;`);