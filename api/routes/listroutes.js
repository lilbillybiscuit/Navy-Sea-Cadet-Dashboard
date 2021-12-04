const con = null;

//Don't worry about any of this function stuff, just add any routes below
//by copying and pasting the code
module.exports = function(app) {
  var controller = require('../controllers/apicontroller');
  var announcements = require('../controllers/annoucementsapi.js');

  // copy paste these to make a new route
  app.route('/api/getlist') //Handle request for [domain]/api/getlist
    .get(controller.example_task);

  app.route('/api/cadet/:userid') //Handle request for [domain]/api/cadet/[user_id]
    .get(controller.get_cadet_info);

  app.route('/api/announcementsrange')
    .get(announcements.get_announcements_list);
  app.route('/api/announcementsone')
    .get(announcements.get_announcement);
  app.route('/api/add_announcement')
    .post(announcements.add_announcement);
  
};