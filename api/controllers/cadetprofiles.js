var mysql = require('mysql2');
var fs = require("fs");

let rawdata = fs.readFileSync('config.json');
let config = JSON.parse(rawdata);

const pool = mysql.createPool({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database;
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true
});

const poolpromise = pool.promise();

exports.add_cadet_profile = async function (request, result) {
    if (!'token' in request.query) {
        var ret = {
            success: false,
            message: "Mussed be logged in to add a cadet profile..."
        };
        result.json(ret);
        return;
    }
    if (token.length!=64) {
        var ret = {
            success: false,
            message: "Invalid token",
        };
        result.json(ret);
        return;
    }

    //Token verification code goes here
    var profile = request.query;
    await poolpromise.query("INSERT INTO profiles (name, branch, data)");
    var data = {
        description: profile.description,
        picture: profile.picture;
    }
    
}


data = {
    name: "string",
    description: "string",
    branch: "string",
    picture: "string",
    age: 6
}

//
preivew: name, profile pictrue, learn more
