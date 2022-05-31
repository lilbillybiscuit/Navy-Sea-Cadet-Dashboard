const con = null;

//Don't worry about any of this function stuff, just add any routes below
//by copying and pasting the code
module.exports = function(app) {
  var controller = require('../controllers/apicontroller');
  var announcements = require('../controllers/annoucementsapi.js');
  var loginapi = require('../login/loginapi.js');
  var cadetapi = require('../controllers/cadetprofiles.js');
  var dashboardapi = require('../controllers/dashboard.js');
  var messageapi = require('../controllers/messages.js');
  // copy paste these to make a new route
  app.route('/api/getlist') //Handle request for [domain]/api/getlist
    .get(controller.example_task);

  app.route('/api/cadet/:userid') //Handle request for [domain]/api/cadet/[user_id]
    .get(controller.get_cadet_info);

  
  app.route('/api/login')
    .post(loginapi.simplelogin);
  app.route('/api/logout')
    .post(loginapi.simplelogout);  
  app.route('/api/check_token')
    .post(loginapi.get_session);
  app.route('/api/get_dashboard_info')
    .get(dashboardapi.get_dashboard_info);
  app.route('/api/get_unread_message_count')
    .get(messageapi.get_unread_message_count);
  
  //Cadets API
  app.route('/api/cadets/create')
    .post(cadetapi.add_cadet_profile);
  app.route('/api/cadets/get')
    .get(cadetapi.get_cadet);
  app.route('/api/cadets/edit')
    .get(cadetapi.get_raw_cadet);

  //Announcements API
  app.route('/api/announcements/list')
    .get(announcements.get_announcements_list);
  app.route('/api/announcements/get')
    .get(announcements.get_announcement);
  app.route('/api/announcements/edit')
    .get(announcements.get_raw_announcement);
  app.route('/api/announcements/create')
    .post(announcements.add_announcement);
  app.route('/api/announcements/update')
    .post(announcements.update_announcement);
  //Message API
  app.route('/api/messages/count')
    .get(messageapi.get_message_count);
  // app.route('/api/authenicate')
  //   .post(loginapi.authenticate);
};