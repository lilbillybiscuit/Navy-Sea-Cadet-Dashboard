const con = null;

//Don't worry about any of this function stuff, just add any routes below
//by copying and pasting the code
module.exports = function (app) {
  var announcements = require("../controllers/annoucementsapi.js");
  var loginapi = require("../login/loginapi.js");
  var cadetapi = require("../controllers/cadetprofiles.js");
  var dashboardapi = require("../controllers/dashboard.js");
  var messageapi = require("../controllers/messages.js");
  var calendarapi = require("../controllers/calendar.js");
  var fileapi= require("../controllers/filehandler.js");
  var linksapi = require("../controllers/importantlinkshandler.js");
  var imageapi = require("../controllers/imagehandler.js");

  //app.route("/api/cadet/:userid").get(controller.get_cadet_info); //Handle request for [domain]/api/cadet/[user_id]

  app.route("/api/login").post(loginapi.simplelogin);
  app.route("/api/logout").post(loginapi.simplelogout);
  app.route("/api/check_token").post(loginapi.get_session);
  app.route("/api/get_dashboard_info").get(dashboardapi.get_dashboard_info);
  app
    .route("/api/get_unread_message_count")
    .get(messageapi.get_unread_message_count);

  //Calendar API
  app.route("/api/calendar/url").get(calendarapi.get_calendar_url);

  //Cadets API
  app.route("/api/cadets/list").get(cadetapi.get_cadet_list);
  app.route("/api/cadets/create").post(cadetapi.add_cadet_profile);
  app.route("/api/cadets/get").get(cadetapi.get_cadet);
  app.route("/api/cadets/edit").get(cadetapi.get_raw_cadet);
  app.route("/api/cadets/update").post(cadetapi.update_cadet_profile);

  //Announcements API
  app
    .route("/api/announcements/list")
    .get(announcements.get_announcements_list);
  app.route("/api/announcements/get").get(announcements.get_announcement);
  app.route("/api/announcements/edit").get(announcements.get_raw_announcement);
  app.route("/api/announcements/create").post(announcements.add_announcement);
  app
    .route("/api/announcements/update")
    .post(announcements.update_announcement);
  
  //File API
  app.route("/api/documents/upload").post(fileapi.upload_document);
  app.route("/api/documents/extensions").get(fileapi.document_extensions);
  app.route("/api/documents/list").get(fileapi.list_documents);
  app.route("/api/documents/delete").delete(fileapi.delete_document);

  //Images API
  app.route("/api/images/upload").post(imageapi.upload_image);

  //Message API
  app.route("/api/messages/count").get(messageapi.get_message_count);
  // app.route('/api/authenicate')
  //   .post(loginapi.authenticate);

  //Item APIs
  app.route("/api/links/edit").get(linksapi.get_links);
  app.route("/api/links/update").post(linksapi.update_links);
  app.route("/api/policy/get").get(fileapi.get_policies_url);
};
