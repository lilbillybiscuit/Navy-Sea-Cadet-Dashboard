const con = null;

//Don't worry about any of this function stuff, just add any routes below
//by copying and pasting the code
module.exports = function(app) {
  var controller = require('../controllers/apicontroller');
  var announcements = require('../controllers/annoucementsapi.js');
  var loginapi = require('../login/loginapi.js');

  // copy paste these to make a new route
  app.route('/api/getlist') //Handle request for [domain]/api/getlist
    .get(controller.example_task);

  app.route('/api/cadet/:userid') //Handle request for [domain]/api/cadet/[user_id]
    .get(controller.get_cadet_info);

  app.route('/api/announcementrange')
    .get(announcements.get_announcements_list);
  app.route('/api/announcement')
    .get(announcements.get_announcement);
  app.route('/api/announcement_edit')
    .get(announcements.get_raw_announcement);
  app.route('/api/add_announcement')
    .post(announcements.add_announcement);
  app.route('/api/login')
    .post(loginapi.simplelogin);
  app.route('/api/check_token')
    .post(loginapi.get_session);
  // app.route('/api/authenicate')
  //   .post(loginapi.authenticate);
};