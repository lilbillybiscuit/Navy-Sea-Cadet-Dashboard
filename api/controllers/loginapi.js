

exports.verify_user = function(request, response) {
    
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