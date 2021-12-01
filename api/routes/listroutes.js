//Don't worry about any of this function stuff, just add any routes below
//by copying and pasting the code
module.exports = function(app) {
  var controller = require('../controllers/apicontroller');

  // copy paste these to make a new route
  app.route('/api/getlist') //Handle request for [domain]/api/getlist
    .get(controller.example_task)

  app.route('/api/cadet/:userid') //Handle request for [domain]/api/cadet/[user_id]
    .get(controller.get_cadet_info)
};