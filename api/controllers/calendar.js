let config = require("../../config");

exports.get_calendar_embed = function(request, result) {
  result.json({
    success: true,
    url: config.googlecalendarurl
  })
}

exports.get_calendar_url = function(request, result) {
  result.json({
    success: true,
    url: config.googlecalendarurl
  });
}

console.log("Initialized Calendar API");