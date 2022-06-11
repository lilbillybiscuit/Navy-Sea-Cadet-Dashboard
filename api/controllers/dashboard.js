let config = require("../../config");
const tools = require("../tools");
const database = require("../db");
const cadetcollection = database.getdatabase().collection("cadet_profiles");
const metadatacollection = database.getdatabase().collection("metadata");
const announcementcollection = database
  .getdatabase()
  .collection("announcements");

exports.get_dashboard_info = async function (request, result) {
  if (typeof request.query.token === "undefined") {
    result.json({
      success: false,
      message: "Not logged in",
    });
    return;
  }
  console.log("request.query.token: " + request.query.token);
  var verify = await tools.verify_token(request.query.token);
  console.log(verify);
  if (!verify.success) {
    result.json({
      success: false,
      message: "Invalid token or insufficient permissions",
    });
    return;
  }
  var data = {};
  data.cadetcount = await cadetcollection.countDocuments({});
  data.date = new Date();
  data.username = verify.username;
  data.cadets = [];
  data.success = true;
  //Optimize for ranged searches later
  var cadets = await cadetcollection.find({}).toArray();
  for (var i = 0; i < cadets.length; i++) {
    var temp = {
      _id: cadets[i]._id,
      firstname: cadets[i].firstname,
      lastname: cadets[i].lastname,
      role: cadets[i].role,
      shortdescript: cadets[i].shortdescript,
    };
    data.cadets.push(temp);
  }
  result.json(data);
  return;
};

console.log("Initialized Dashboard API");