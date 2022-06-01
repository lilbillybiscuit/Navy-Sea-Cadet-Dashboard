var database = require("../db");
var tools = require("../tools");
var accountcollection = database.getdatabase().collection("accounts");
var sessioncollection = database.getdatabase().collection("sessions");

exports.simplelogin = async function (request, result) {
  var username = request.body.username;
  var password = request.body.password;
  console.log(request.body);
  //VERY INSECURE MAKE REAL LOGIN SYSTEM
  if (username && password) {
    var accountobj = await accountcollection.findOne({ _id: username });
    if (accountobj != null && password == accountobj.password) {
      var token = await tools.new_token(accountobj);
      console.log(token);
      result.json({
        success: true,
        username: username,
        token: token.token,
        access_level: token.access_level,
        expires: token.expires,
      });
      return;
    } else {
      result.json({
        success: false,
        message: "Invalid username or password",
      });
      return;
    }
  } else {
    result.json({
      success: false,
      message: "Missing username and/or password",
    });
    return;
  }
};

exports.simplelogout = async function (request, result) {
  var token = request.body.token;
  if (token) {
    await sessioncollection.deleteOne({ token: token });
    result.json({
      success: true,
      message: "Logged out",
    });
    return;
  } else {
    result.json({
      success: false,
      message: "Missing token",
    });
    return;
  }
};

exports.get_session = async function (request, result) {
  var token = request.body.token;
  if (token) {
    var verify = await tools.verify_token(token);
    if (verify.success) {
      result.json({
        success: true,
        valid: true,
        username: verify.username,
        access_level: verify.access_level,
        token: token,
      });
      return;
    } else {
      result.json({
        success: true,
        valid: false,
        message: verify.message,
      });
      return;
    }
  } else {
    result.json({
      success: false,
      message: "Missing token",
    });
    return;
  }
};

exports.authenicate = async function (request, result) {
  var username = request.body.username;
  var password = request.body.password; //should already be sha256'ed
  var password = request.body;
  if (username && password) {
    connection.query(
      "SELECT * FROM accounts WHERE username = ? AND password = ?",
      [username, password],
      function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          request.session.loggedin = true;
          request.session.username = username;
          result.redirect("/dashboard/dashboard.html");
        } else {
          result.send("Invalid username and/or password");
        }
        result.end();
      }
    );
  } else {
    result.send("Invalid username and/or password");
    result.end();
  }
};

exports.create_account = async function (request, result) {
  //use master key for security purposes
};
