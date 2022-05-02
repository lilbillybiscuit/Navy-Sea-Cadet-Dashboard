var pool = require("./db");
const poolpromise = pool.promise();

const crypto = require("crypto");

exports.verify_token= async function (token) {
    if (token.length != 100) {
        return {
            success: false,
            message: "Invalid token"
        };
    }
    var ses = await poolpromise.query(`SELECT * FROM sessions WHERE token=?`, [token]);
}

exports.generate_string = function (len) {
    var token = crypto.randomBytes(Math.ceil(len*3/4)).toString('base64');
    return token.substring(0,len);
}

exports.get_expires = function(hours_ahead) {
    var today = new Date();
    today.setHours(today.getHours()+hours_ahead);
    return today;
}
