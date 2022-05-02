const mysql = require('mysql2');
const fs = require('fs');

const pool = require("./api/db");
const poolpromise = pool.promise();

const tools = require("./api/tools");

let rawdata = fs.readFileSync('config.json');
let config = JSON.parse(rawdata);

main().then(() => process.exit(0));
async function main() {
    var hi=await poolpromise.query("SELECT * FROM testtable");
    console.log(hi[0]);
    var datains=[
        tools.generate_string(100), //token
        tools.get_expires(12),
        10,
        "user2",
        "email2",
        JSON.stringify({hi:5})
    ]
    await poolpromise.query("INSERT INTO sessions (token, expires, access_level, username, email, data) VALUES (?,?,?,?,?,?)", datains);
}