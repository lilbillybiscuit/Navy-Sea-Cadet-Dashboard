let config = require("../../config");
const tools = require("../tools");
const database = require("../db");
const metadatacollection = database.getdatabase().collection("metadata");
var QuillDeltaToHtmlConverter = require("quill-delta-to-html").QuillDeltaToHtmlConverter;
var JSDOM = require("jsdom").JSDOM;
var quillconfig = {
  inlineStyles: true,
};

const fs = require('fs');
exports.get_links = async function (request, result) {
  var data = await metadatacollection.findOne({
    _id: "important_links",
  });
  if (data === null) {
    await metadatacollection.insertOne({
      _id: "important_links",
      deltas: [],
      html: "",
      dateupdated: new Date(),
    });
    result.json({
      success: true,
      deltas: [],
      html: "",
    });
    return;
  }
  result.json({
    success: true,
    deltas: data.deltas,
    html: data.html,
  });
  return;
};



exports.update_links = async function (request, result) {
  if (typeof request.query.token == "undefined") {
    result.json({
      success: false,
      message: "No token provided"
    });
    return;
  }
  var verify = await tools.verify_token(request.query.token);
  if (!verify.success) {
    result.json({
      success: false,
      message: "Invalid token"
    });
    return;
  }
  var data = request.body;
  var deltas = data.deltas;
  var converter = new QuillDeltaToHtmlConverter(deltas, quillconfig);
  var html = converter.convert();
  var updated = {
    deltas: deltas,
    html: html,
    dateupdated: new Date(),
  };
  var inserted = await metadatacollection.updateOne({
    _id: "important_links",
  }, {
    $set: updated,
  });
  console.log(inserted);
  if (!inserted.acknowledged || inserted.modifiedCount == 0) {
    result.json({
      success: false,
      message: "Something went wrong while creating the page5645"
    });
    return;
  }
  try {
    fs.writeFileSync("NavyApp/items/rawlinks.html", html);
  } catch (err) {
    console.log(err);
    result.json({
      success: false,
      message: "Something went wrong while creating the page"
    });
  }
  result.json({
    success: true,
    message: "Successfully created the page"
  });
  return;
}