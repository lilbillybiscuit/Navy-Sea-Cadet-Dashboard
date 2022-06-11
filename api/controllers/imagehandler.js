const fs = require("fs");
const tools = require("../tools");
const config = require("../../config");
const database = require("../db");
const imagecollection = database.getdatabase().collection("images");
const path = require('path');
var gm = require('gm').subClass({imageMagick: true});
var filetype = require("file-type");
exports.get_image = function (request, result) {};

async function identifyImage(buffer) {
  return new Promise((resolve, reject) => {
    gm(buffer).identify((error, size) => {
      if (error) {
        console.error("Failed to get image size:", error);
        reject(error);
      } else {
        resolve(size);
      }
    });
  });
}

async function sizeImage(buffer) {
  return new Promise((resolve, reject) => {
    gm(buffer).size((error, size) => {
      if (error) {
        console.error("Failed to get image size:", error);
        reject(error);
      } else {
        resolve(size);
      }
    });
  });
}

async function writeImage(buffer, localfilepath) {
   return new Promise((resolve, reject) => {
     gm(buffer).write(localfilepath,(error, size) => {
       if (error) {
         console.error("Failed to get image size:", error);
         reject(error);
       } else {
         resolve(size);
       }
     });
   });
 }

 async function bufferImage(gmObject) {
  return new Promise((resolve, reject) => {
    gmObject.toBuffer((error, buffer) => {
      if (error) {
        console.error("Failed to get image buffer:", error);
        reject(error);
      } else {
        resolve(buffer);
      }
    });
  });
}

//imgbb API reverse engineered
exports.upload_image = async function (request, result) {
  var verify = await tools.verify_token(request.query.token);
  if (!verify.success) {
    result.json(verify.ret);
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
    const allowed_extensions = config.extensions.images;
    let image = request.files.image;
    if (!image) {
      result.json({
        success: false,
        message: "No file was uploaded (make sure key is 'image')",
      });
      return;
    }
    var pathedfilename = path.parse(image.name);
    //gets file type
    var file_type_res=await filetype.fromBuffer(image.data);
    console.log(file_type_res);
    if (!file_type_res.mime.includes("image")) {
      result.json({
        success: false,
        message: "File type not allowed",
      });
      return;
    }
    
    //Convert to webp if image is not readable by browsers
    var intended_extension = "webp";
    if (config.extensions.web_images.includes(pathedfilename.ext)) {
      intended_extension = pathedfilename.ext;
    }
    if (image.size > config.max_image_size) {
      intended_extension = "webp";
    }

    //gets file hash for more efficient file storage
    var md5 = image.md5;
    var md5filenameonly= md5+Math.floor(Math.random() * 10000);
    var md5filename=md5[0]+"/"+md5[1]+"/"+md5[2]+"/"+md5filenameonly+"."+intended_extension;
    var localfilepath = "NavyApp/images/"+md5filename;
    var localthumbnailpath = "NavyApp/images/thumbnails/"+md5filename;
    
    //File ID and Delete ID
    var file_id=md5filenameonly;
    var delete_id = tools.generate_hex(80);

    //Write and process both image and thumbnail
    var convertedbuffer = await bufferImage(
      gm(image.data)
      .noProfile()
      .resize(4096,4096, ">")
      .setFormat(intended_extension)
    );

    var streamproperties = await identifyImage(convertedbuffer);
    var streamsize = streamproperties.size;
    var streamfilesize = convertedbuffer.length;
    console.log(streamproperties);
    fs.mkdirSync(path.dirname(localfilepath), { recursive: true });
    fs.writeFileSync(localfilepath, convertedbuffer);

    var convertedthumbnail = await bufferImage(
      gm(convertedbuffer)
      .resize(1024, 1024, ">")
      .setFormat(intended_extension)
    );
    var thumbnailproperties = await identifyImage(convertedthumbnail);
    fs.mkdirSync(path.dirname(localthumbnailpath), { recursive: true });
    fs.writeFileSync(localthumbnailpath, convertedthumbnail);

    var imagemetadata = {
      _id: file_id,
      dateuploaded: Date.now(),
      user: verify.username,
      md5: md5,
      filename: image.name,
      filesize: streamfilesize,
      filemime: streamproperties["Mime type"],
      fileext: pathedfilename.ext,
      filepath: localfilepath,
      delete_id: delete_id,
      data: {
        delete_url: "/api/images/delete/"+delete_id,
        display_url: "/images/"+md5filename,
        expiration: "0",
        height: streamsize.height,
        id: file_id,
        image: {
          extension: intended_extension,
          filename: pathedfilename.name + "." + intended_extension,
          mime: streamproperties["Mime type"],
          name: pathedfilename.name,
          url: "/images/"+md5filename,
        },
        size: streamfilesize,
        thumb: {
          extension: intended_extension,
          filename: pathedfilename.name + "." + intended_extension,
          mime: thumbnailproperties["Mime type"],
          name: pathedfilename.name,
          url: "/images/thumbnails/"+md5filename,
        },
        time: Math.floor(new Date().getTime() / 1000),
        title: pathedfilename.name,
        url: "/images/"+md5filename,
        url_viewer: "/images/"+md5filename,
        width: streamsize.width,
      }
    }

    var inserted = await imagecollection.insertOne(imagemetadata);
    if (!inserted.acknowledged) {
      result.json({
        success: false,
        message: "Failed to insert image into database",
      });
      return;
    }

    var ret = {
      success: true,
      status: 200,
      data: imagemetadata.data,
    };
    result.json(ret);
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

console.log("Initialized Image API");