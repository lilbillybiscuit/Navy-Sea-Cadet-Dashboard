let config = require('../../config');
const tools = require('../tools')
var QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
var JSDOM = require('jsdom').JSDOM;
var quillconfig = {
  inlineStyles: true,

};
const database = require('../db');
const cadetcollection= database.getdatabase().collection('cadet_profiles');
const metadatacollection = database.getdatabase().collection('metadata');


exports.add_cadet_profile = async function (request, result) {
    if (!'token' in request.query) {
    var ret = {
        success: false,
        message: "Must be logged in to add a cadet.",
    }
    result.json(ret);
    return;
    }
    var verify = await this.verify_token(request.query.token);
    if (!verify.success) {
    result.json({
        success: false,
        message: "Invalid token or insufficient permissions",
    });
    }
    var data = JSON.parse(request.body);
    var name = data.name;
    var role = data.role;
    var deltas = data.deltas;
    var converter = new QuillDeltaToHtmlConverter(deltas, quillconfig);
    var html = converter.convert();
    var thiscount = tools.get_counter_and_update("cadet_profiles");
    var profile = {
        _id: thiscount,
        name: name,
        role: role,
        dateadded: new Date(),
        user: verify.username,
        deltas: deltas,
        html: html,
        shortdescript: JSDOM.fragment(html).textContent.substring(0,200),
    }

    var inserted = await cadetcollection.insertOne(profile);
    if (insert.insertedId= null) {
        result.json({
            success: false,
            message: "Something went wrong while creating the profile"
        });
    }
    
    var ret = {
        success: true,
        url: "/cadet_profiles/profile?id=" + thiscount,
    }
    result.json(ret);
    return;

}

exports.get_cadet = async function (request, result) {
    var id= parseInt(request.query.id);
    var profile = await cadetcollection.findOne({_id: id});
    if (profile === null) {
        result.json({
        success: false,
        message: "Cadet not found",
        });
    }
    var ret={
        date: new Date(),
        id: profile.id,
        title: profile.title,
        dateadded: profile.dateadded,
        html: profile.html,
    }
    result.json(ret);
    return;
}

exports.get_raw_cadet = async function (request, result) {
    var id= parseInt(request.query.id);
    var profile = await cadetcollection.findOne({_id: id});
    if (profile === null) {
        result.json({
        success: false,
        message: "Cadet not found",
        });
    }
    var ret={
        date: new Date(),
        id: profile.id,
        title: profile.title,
        dateadded: profile.dateadded,
        deltas: profile.deltas,
    }
    result.json(ret);
    return;
}