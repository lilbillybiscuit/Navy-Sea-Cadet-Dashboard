let config = require('../../config');
const tools = require('../tools')
var QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
var JSDOM = require('jsdom').JSDOM;
var quillconfig = {
  inlineStyles: true,

};
const database = require('../db');
const announcementcollection = database.getdatabase().collection('announcements');
const metadatacollection = database.getdatabase().collection('metadata');

exports.get_announcements_list = async function(request, result) {
  var latest_page = (await tools.get_counter("announcements"))-1;
  console.log(latest_page);
  var page = request.query.page-1;
  var amount = request.query.amount;
  page=Math.max(0,page);
  amount=Math.max(0,amount);
  var maximum = latest_page-amount*page, minimum = maximum-amount+1;
  var announcements = await announcementcollection.find({_id: {$gte: minimum, $lte: maximum}}).toArray();
  console.log(minimum);
  console.log(maximum);
  if (announcements.length==0) {
    result.json({
      success: false,
      message: "Nothing has been posted yet (or this range is incorrect)",
      messageshort: "NoMessage"
    });
    return;
  }
  announcements.sort((a,b) => {return b._id-a._id});
  var ret = {
    success:true,
    date: new Date(),
    announcements: [],
  };

  for (var i=0; i<announcements.length; i++) {
    var temp = {
      _id: announcements[i]._id,
      title: announcements[i].title,
      dateadded: announcements[i].dateadded,
      shortdescript: announcements[i].shortdescript,
    }
    ret.announcements.push(temp);
  }
  result.json(ret);
  return;
};

exports.get_announcement = async function(request, result) {
  var id= parseInt(request.query.id);
  var announcement = await announcementcollection.findOne({_id: id});
  if (announcement === null) {
    result.json({
      success: false,
      message: "Announcement not found",
    });
  }
  var ret={
    success: true,
    date: new Date(),
    id: announcement._id,
    title: announcement.title,
    dateadded: announcement.dateadded,
    html: announcement.html,
  }
  result.json(ret);
  return;
}

exports.get_raw_announcement = async function(request, result) {
  var id= parseInt(request.query.id);
  var announcement = await announcementcollection.findOne({_id: id});
  if (announcement === null) {
    result.json({
      success: false,
      message: "Announcement not found",
    });
  }
  var ret={
    success: true,
    date: new Date(),
    id: announcement._id,
    title: announcement.title,
    dateadded: announcement.dateadded,
    deltas: announcement.deltas,
  }
  result.json(ret);
  return;
}

exports.add_announcement = async function(request, result) {
  if (typeof request.query.token == "undefined") {
    var ret = {
      success: false,
      message: "Must be logged in to add an announcement.",
    }
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
  var data = request.body;
  var title = data.title;
  var deltas = data.deltas;
  var converter = new QuillDeltaToHtmlConverter(deltas, quillconfig);
  var html = converter.convert();
  var thiscount = await tools.get_counter_and_update("announcements");
  var announcement = {
    _id: thiscount,
    title: title,
    dateadded: new Date(),
    user: verify.username,
    deltas: deltas,
    html: html,
    shortdescript: JSDOM.fragment(html).textContent.substring(0,200),
  }

  var inserted = await announcementcollection.insertOne(announcement);
  if (inserted.insertedId= null) {
    result.json({
      success: false,
      message: "Something went wrong while inserting the announcement"
    });
    return;
  }
  var ret = {
    success: true,
    id: thiscount,
    url: "/Dashboard/announcements/view.html?id=" + thiscount,
    publicurl: "/announcements/view?id="+thiscount,
    apiurl:"/api/announcements/get?id=" + thiscount,
  }
  result.json(ret);
  return;
}

exports.update_announcement = async function(request, result) {
  if (typeof request.query.token == "undefined") {
    var ret = {
      success: false,
      message: "Must be logged in to add an announcement.",
    }
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
      message: "No announcement id specified",
    });
    return;
  }
  
  var data = request.body;
  var title = data.title;
  var deltas = data.deltas;
  var id = parseInt(request.query.id);
  var converter = new QuillDeltaToHtmlConverter(deltas, quillconfig);
  var html = converter.convert();
  var updated = {
    title: title,
    dateupdated: new Date(),
    deltas: deltas,
    html: html,
    shortdescript: JSDOM.fragment(html).textContent.substring(0,200),
  }
  var query = {_id: id};
  var inserted = await announcementcollection.updateOne(query, {$set:updated});
  if (inserted.insertedId= null) {
    result.json({
      success: false,
      message: "Something went wrong while inserting the announcement"
    });
    return;
  }
  var ret = {
    success: true,
    id: id,
    url: "/Dashboard/announcements/view.html?id=" + id,
    publicurl: "/announcements/view?id="+id,
    apiurl:"/api/announcements/get?id=" + id,
  }
  result.json(ret);
  return;
}