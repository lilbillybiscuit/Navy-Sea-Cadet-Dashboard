var mysql = require('mysql2');
var fs = require('fs');

let rawdata = fs.readFileSync('config.json');
let config = JSON.parse(rawdata);
exports.verify_user = function(request, response) {
    if (!'key' in request.query) {
        response.json({
            success: false,
            message: 'Master key is required'
        });
        return;
    } else if (key != config.masterkey) {
        response.json({
            success: false,
            message: 'Incorrect master key'
        });
    }
    var ret = {

    };
}

exports.update_login = function(request, response) {
    
    
    var ret = {
        "success" : true,
        "username":
        "message" : "Password updated successfully"
    }
    response.json(ret);
}