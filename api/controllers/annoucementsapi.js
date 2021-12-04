var mysql = require('mysql2');
var fs = require('fs');

let rawdata = fs.readFileSync('config.json');
let config = JSON.parse(rawdata);

const pool = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true
});
const poolpromise = pool.promise();

exports.get_announcements_list = async function(request, result) {
  var page = request.query.page;
  var amount = request.query.amount;
  var minimum = amount*page, maximum = minimum+amount-1;
  var announcements = await poolpromise.query("SELECT * FROM test WHERE id BETWEEN ? AND ?", [minimum, maximum]);
  announcements = annoucements[0];
  var ret = {
        date: new Date(),
        elements: [],
    };
  for (var i=0; i<announcements.length; i++) {
    var temp = {
      title: announcements[i].title,
      summary: announcements[i].summary,
      dateadded: announcements.dateadded,
      imageurl: announcements[i].data.imageurl,
      url: '/api/announcements/' + announcements[i].id
    }
    ret.elements.push(temp);
  }

  // console.log(temp);
  // for (var i=0; i<temp[0].length; i++) {
  //   console.log(temp[0][i]);
  // }
  
  // for (var i=0; i<temp[0].length; i++) {
  //   ret.elements.push(temp[0][i]);
  // }
  result.json(ret);
};

exports.get_announcement = async function(request, result) {
  var id= parseInt(request.query.id);
  var announcement = await poolpromise.query("SELECT * FROM announcement WHERE id=?", [id])
  announcement = announcement[0][0];
  var ret={
    date: new Date(),
    id: announcement.id,
    title: announcement.title,
    dateadded: announcement.dateadded,
    content: announcement.data.content,
  }
  return.json(ret);
}

exports.add_announcement = async function(request, result) {
  if (!'token' in request.query) {
    var ret = {
      success: false,
      message: "Must be logged in to add an announcement.",
    }
    result.json(ret);
    return;
  }

  if (token.length !=64) {
    var ret = {
      success: false,
      message: "Invalid token",
    }
    result.json(ret);
    return;
  }

  var verify = await poolpromise.query("SELECT access_level, expires FROM tokens WHERE token=?",[request.query.token]);
  verify = verify[0];
  if (verify.length === 0) {
    result.json({
      sucesss:false,
      message: "Invalid token";
    });
    return;
  }
  if (verify.access_level <1) {
    result.json({
      sucesss:false,
      message: "Insufficient permissions";
    });
    return;
  }
  if (verify.expires>=Date.now()) {
    var ret = {
      success:false,
      message: "Login expired"
    }
    await poolpromise.query("SELECT WHERE token=?",[request.query.token]);
    result.json(ret);
    return;
  }
  var announcement = request.query;
  await poolpromise.query("INSERT INTO announcements (title, summary, dateadded, data) VALUES (?,?,?,?)",
  [announcement.title, announcement.summary, Date.now(),JSON.stringify({
    content: announcement.content,
    imageurl: 'imageurl' in announcement? annoucement.imageurl: null,
  })]);

  result.json({
    success: true,
    message: "Announcement added!"
  });
  return;
}