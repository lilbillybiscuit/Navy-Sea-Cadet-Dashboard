const mysql = require('mysql2/promise');
const fs = require('fs');
let rawdata = fs.readFileSync('config.json');
let config = JSON.parse(rawdata);


main().then(()=>process.exit(0));
async function main() {
    //make sure you created the database with "CREATE DATABASE [database name]"
    const connection = await mysql.createConnection({
        host: config.database.host,
        user: config.database.user, 
        password: config.database.password,
        database: config.database.database
    });
    console.log("Creating tables in " + config.database.database);
    await connection.execute(`CREATE TABLE IF NOT EXISTS accounts (
        username varchar(50) NOT NULL PRIMARY KEY,
        passwordsha256 varchar(256) NOT NULL,
        email varchar(100) NOT NULL,
        data JSON);`);
    await connection.execute(`CREATE TABLE IF NOT EXISTS sessions (
        token varchar(100) NOT NULL PRIMARY KEY,
        expires DATETIME NOT NULL,
        access_level INTEGER NOT NULL,
        username varchar(50) NOT NULL,
        email varchar(100) NOT NULL,
        data JSON);`);
    await connection.execute(`CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(300),
        shortdescript VARCHAR(1000),
        dateadded DATETIME,
        data JSON);`);
    await connection.execute(`CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
        name VARCHAR(50),
        branch VARCHAR(50),
        data JSON);`);
    await connection.execute(`CREATE TABLE IF NOT EXISTS calendar (
        date DATETIME,
        title VARCHAR(200),
        data JSON);`);
    
    console.log("Finished");
    return;
    
}
