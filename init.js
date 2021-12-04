var mysql = require('mysql2')
var fs = require('fs')
let rawdata = fs.readFileSync('config.json');
let config = JSON.parse(rawdata);
console.log(config);

var con = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  multipleStatements:true
});
const databasename=con.escapeId(config.database.database);
con.connect(function(err) {
  if (err) throw err;
});

con.query("CREATE DATABASE IF NOT EXISTS "+databasename+";",
  {
    name: databasename
  },
  function (err, result) {
    if (err) throw err;
    console.log(`Database ${databasename} initialzed`);
  }
);

con.query(`CREATE TABLE IF NOT EXISTS ${databasename}.users (username VARCHAR(30) PRIMARY KEY, userid INTEGER NOT NULL, passwordsha512 VARCHAR(128) NOT NULL, name VARCHAR(60), data JSON)`);
con.query(`CREATE TABLE IF NOT EXISTS ${databasename}.announcements (id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL, title VARCHAR(250) NOT NULL, summary VARCHAR(500), dateadded DATETIME, data JSON)`);
con.query(`CREATE TABLE IF NOT EXISTS ${databasename}.profiles (id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL, name VARCHAR(50), data JSON)`);
con.query(`CREATE TABLE IF NOT EXISTS ${databasename}.calendar (date DATETIME, data JSON)`)
con.query(`CREATE TABLE IF NOT EXISTS ${databasename}.tokens (token CHAR(64) PRIMARY KEY NOT NULL, expires DATETIME, access_level INTEGER)`)
con.query(`CREATE TABLE IF NOT EXISTS ${databasename}.test (num INTEGER, token VARCHAR(64))`);
con.end();