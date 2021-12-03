var mysql = require('mysql')
var fs = require('fs')
let rawdata = fs.readFileSync('config.json');
let config = JSON.parse(rawdata);
console.log(config);
const databasename=con.escapeId(config.database.database);
var con = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: databasename,
  multipleStatements:true
});

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

con.query(`CREATE TABLE IF NOT EXISTS ${databasename}.users (username VARCHAR(20) PRIMARY KEY NOT NULL, userid INTEGER NOT NULL, passwordsha512 VARCHAR(128) NOT NULL, name VARCHAR(60), data JSON)`);
con.query(`CREATE TABLE IF NOT EXISTS ${databasename}.announcements (id INTEGER PRIMARY KEY NOT NULL AUTOINCREMENT, title VARCHAR(250) NOT NULL, summary VARCHAR(500), data JSON)`);
