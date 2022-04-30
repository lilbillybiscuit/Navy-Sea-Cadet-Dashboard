var pool = require("db");
const poolpromise = pool.promise();
module.exports = async function verify_token(token) {
    if (token.length != 100) {
        return {
            success: false,
            message: "Invalid token"
        };
    }
    await poolpromise.query()
}