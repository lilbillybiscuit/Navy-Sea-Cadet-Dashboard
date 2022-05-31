let config = require("../../config");
const tools = require("../tools");
var crypto = require("crypto");
var QuillDeltaToHtmlConverter =
  require("quill-delta-to-html").QuillDeltaToHtmlConverter;
var JSDOM = require("jsdom").JSDOM;
var quillconfig = {
  inlineStyles: true,
};
const database = require("../db");
const cadetcollection = database.getdatabase().collection("cadet_profiles");
const metadatacollection = database.getdatabase().collection("metadata");

exports.add_cadet_profile = async function (request, result) {
  if (typeof request.query.token == "undefined") {
    var ret = {
      success: false,
      message: "Must be logged in to add a cadet.",
    };
    result.json(ret);
    return;
  }
  var verify = await tools.verify_token(request.query.token);
  if (!verify.success) {
    console.log(request.query.token);
    result.json({
      success: false,
      message: "Invalid token or insufficient permissions",
    });
    return;
  }
  var data = request.body;
  var firstname = data.firstname;
  var lastname = data.lastname;
  var email = data.email;
  var role = data.role;
  var deltas = data.deltas;
  //var base64image = data.base64image;
  //var sha256 = crypto.createHash('sha256').update(base64image).digest('hex');
  //var randomstring = tools.generate_string(10);
  //var imagefileurl = `/images/${sha256.substring(0,2)}/${sha256.substring(2,4)}/${sha256.substring(4,6)}/${randomstring}.jpg`;
  //fs.writeFileSync(imagefileurl,base64image);
  var converter = new QuillDeltaToHtmlConverter(deltas, quillconfig);
  var html = converter.convert();
  var thiscount = await tools.get_counter_and_update("cadet_profiles");
  var profile = {
    _id: thiscount,
    firstname: firstname,
    lastname: lastname,
    role: role,
    dateadded: new Date(),
    user: verify.username,
    deltas: deltas,
    email: email,
    html: html,
    shortdescript: JSDOM.fragment(html).textContent.substring(0, 200),
  };
  var inserted = await cadetcollection.insertOne(profile);
  if ((inserted.insertedId = null)) {
    result.json({
      success: false,
      message: "Something went wrong while creating the profile",
    });
    return;
  }

  var ret = {
    success: true,
    url: "/cadet_profiles/profile?id=" + thiscount,
  };
  result.json(ret);
  return;
};

exports.get_cadet = async function (request, result) {
  var id = parseInt(request.query.id);
  var profile = await cadetcollection.findOne({ _id: id });
  if (profile === null) {
    result.json({
      success: false,
      message: "Cadet not found",
    });
  }
  var ret = {
    date: new Date(),
    success: true,
    id: profile._id,
    firstname: profile.firstname,
    lastname: profile.lastname,
    email: profile.email,
    role: profile.role,
    dateadded: profile.dateadded,
    html: profile.html,
  };
  result.json(ret);
  return;
};

exports.get_raw_cadet = async function (request, result) {
  var id = parseInt(request.query.id);
  var profile = await cadetcollection.findOne({ _id: id });
  if (profile === null) {
    result.json({
      success: false,
      message: "Cadet not found",
    });
  }
  var ret = {
    date: new Date(),
    success: true,
    id: profile._id,
    firstname: profile.firstname,
    lastname: profile.lastname,
    role: profile.role,
    dateadded: profile.dateadded,
    deltas: profile.deltas,
  };
  result.json(ret);
  return;
};

//Updated on 5/31/2022 at 2:25am
exports.update_cadet_profile = async function (request, result) {
  if (typeof request.query.token == "undefined") {
    var ret = {
      success: false,
      message: "Must be logged in to add an announcement.",
    };
    result.json(ret);
    return;
  }
  var verify = await tools.verify_token(request.query.token);
  if (!verify.success) {
    result.json({
      success: false,
      message: "Invalid token or insufficient permissions",
    });
    return;
  }
  if (typeof request.query.id == "undefined") {
    result.json({
      success: false,
      message: "No cadet id specified",
    });
    return;
  }

  var data = request.body;
  var firstname = data.firstname;
  var lastname = data.lastname;
  var email = data.email;
  var role = data.role;
  var deltas = data.deltas;
  var id = parseInt(request.query.id);
  var converter = new QuillDeltaToHtmlConverter(deltas, quillconfig);
  var html = converter.convert();

  var updated = {
    firstname: firstname,
    lastname: lastname,
    role: role,
    dateupdated: new Date(),
    deltas: deltas,
    email: email,
    html: html,
    shortdescript: JSDOM.fragment(html).textContent.substring(0, 200),
  };
  var query = { _id: id };
  var inserted = await cadetcollection.updateOne(query, { $set: updated });
  if ((inserted.insertedId = null)) {
    result.json({
      success: false,
      message: "Something went wrong while inserting the cadet",
    });
    return;
  }
  var ret = {
    success: true,
    id: id,
    url: "/Dashboard/cadets/view.html?id=" + id,
    publicurl: "/cadets/view?id=" + id,
    apiurl: "/api/cadets/get?id=" + id,
  };
  result.json(ret);
  return;
};
