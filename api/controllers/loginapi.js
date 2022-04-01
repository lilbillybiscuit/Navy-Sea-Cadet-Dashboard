var mysql = require('mysql2');
var fs = require('fs');

let rawdata = fs.readFileSync('config.json');
let config = JSON.parse(rawdata);

const connection = mysql.createConnection({
	host     : config.database.host,
	user     : config.database.user,
	password : config.database.password,
	database : config.database.database
});

exports.authenicate = async function(request, result) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				result.redirect('/Dashboard/dashboard.html');
			} else {
				result.send('Invalid username and/or password');
			}			
			result.end();
		});
	} else {
		result.send('Invalid username and/or password');
		result.end();
	}
});
