var mysql = require('mysql');
var fs = require('fs');

let rawdata = fs.readFileSync('config.json');
let config = JSON.parse(rawdata);
console.log(config);

var con = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  multipleStatements:true
});


exports.get_announcements_list = function(request, result) {
    var ret = {
        date: new Date().now(),
        elements: [],
    };
};

exports.get_announcement = function(request, result) {
  var ret={

  }
}
