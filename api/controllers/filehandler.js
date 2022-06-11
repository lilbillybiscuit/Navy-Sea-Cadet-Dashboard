const fs = require('fs')
let config = require("../../config");
const tools = require("../tools");
const database = require("../db");
const filecollection = database.getdatabase().collection("files");
const metadatacollection = database.getdatabase().collection("metadata");

exports.document_extensions = async function (request, result) {
  var ret = {
    success: true,
    extensions: config.extensions.documents,
  };
  result.json(ret);
  return;
}

exports.delete_document = async function (request, result) {
  if (typeof request.query.token == "undefined") {
    result.json({
      success: false,
      message: "Must be logged in to upload a document.",
    });
    return;
  }
  var verify = await tools.verify_token(request.query.token);
  if (!verify.success) {
    result.json({
      success: false,
      message: "Invalid token.",
    });
    return;
  }
  if (!request.query.confirm || request.query.confirm != "true") {
    result.json({
      success: false,
      message: "Must confirm deletion.",
    });
    return;
  }
  var id = parseInt(request.query.id);
  var query = { _id: id };
  console.log(query);
  var data = await filecollection.findOne(query);
  var deleted = await filecollection.deleteOne(query);
  console.log(deleted);
  if ((deleted.deletedCount == 0)) {
    result.json({
      success: false,
      message: "Nothing deleted.",
    });
    return;
  }
  var filepath = data.filepath;
  try {
    fs.unlinkSync(filepath);
  } catch (err) {
    console.error(err);
    result.json({
      success: false,
      message: "File not deleted.",
    });
    return;
  }
  result.json({
    success: true,
    message: "File deleted."
  });
  return;
}

exports.list_documents = async function (request, result) {
  var documents = await filecollection.find({purpose: "document"}).toArray();
  var ret = {
    success: true,
    documents: []
  };

  for (var i = 0; i < documents.length; i++) {
    var document = documents[i];
    var temp = {
      id: document._id,
      title: document.title,
      filename: document.filename,
      url: document.url
    }
    ret.documents.push(temp);
  }
  result.json(ret);
  return;
}
  

exports.upload_document = async function (request, result) {
  if (typeof request.query.token == "undefined") {
    result.json({
      success: false,
      message: "Must be logged in to upload a document.",
    });
    return;
  }
  var verify = await tools.verify_token(request.query.token);
  if (!verify.success) {
    result.json({
      success: false,
      message: "Invalid token.",
    });
    return;
  }
  //console.log(request);
  if (!request.body.title) {
    result.json({
      success: false,
      message: "No title provided.",
    });
    return;
  }
  if (!request.files) {
    result.send({
      success: false,
      message: "No file was uploaded",
    });
    return;
  }
  try {
    const allowed_extensions = config.extensions.documents;
    let file = request.files.file;
    if (!file) {
      result.json({
        success: false,
        message: "No file was uploaded (make sure key is 'file')",
      });
      return;
    }
    //gets file extension, can use mimetype in the future
    let ext = file.name.split(".").pop();
    if (allowed_extensions.indexOf(ext) <= -1) {
      result.json({
        success: false,
        message: "File type not allowed",
      });
      return;
    }
    //gets file hash for more efficient file storage
    var md5 = file.md5;
    var filename=md5[0]+"/"+md5[1]+"/"+md5[2]+"/"+md5+Math.floor(Math.random() * 10000)+"."+ext;
    var filepath = "NavyApp/uploads/"+filename;
    
    file.mv(filepath, function (err) {
      if (err) {
        result.json({
          success: false,
          message: "File upload failed",
        });
        return;
      }
    });
    //adds file to database
    var thiscount = await tools.get_counter_and_update("fileid");
    var filemetadata = {
      _id: thiscount,
      dateuploaded: new Date(),
      title: request.body.title,
      md5: md5,
      ext: ext,
      filename: file.name,
      filesize: file.size,
      filetype: file.mimetype,
      user: verify.username,
      filepath: filepath,
      url: "/uploads/"+filename,
      purpose: "document",
      permissions: 0
    };
    var inserted = await filecollection.insertOne(filemetadata);
    if (!inserted.acknowledged) {
      result.json({
        success: false,
        message: "File upload failed",
      });
      return;
    }
    result.json({
      success: true,
      message: "File uploaded successfully",
      url: "/uploads/"+filename,
      id: thiscount,
    });
    return;
  } catch (err) {
    console.log(err);
    result.json({
      success: false,
      message: "File upload failed",
    });
    return;
  }
}

exports.get_policies_url = async function (request, result) {
  var data = await filecollection.findOne({purpose: "policies_file"});
  var ret = {
    success: true,
    url: data.url,
  };
  result.json(ret);
  return;
}

console.log("Initialized File API");