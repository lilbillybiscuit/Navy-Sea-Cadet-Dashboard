//This js will only work client side in the browser
//get parameters
function getparameter(parameter) {
  var currentUrl = window.location.href;
  var url = new URL(currentUrl);
  var val = url.searchParams.get(parameter);
  return val;
}

var user = getparameter("user");

$.getJSON(url, function (data) {
  //console.log(data) to see what it is
});
