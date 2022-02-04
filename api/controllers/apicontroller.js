//exports.[function name]
exports.example_task = function(request, result) {
  //all request parameters are in the 'req' variable
  //try console.log(req) to see what it like
  
  var listofobjs= {
      noquotes: 5,
      'quotes': 5,
      'list': [ //list of dictionaries. JSON can handles
          {
              name: 'object1',
              //other stuff here whatever 
          }, 
          {
              name: 'object2',
          }
      ],
  }

  var obj = JSON.parse(`{"hi": 5}`); //Create JSON from string
  obj = JSON.parse(listofobjs); //Crate JSON from dictionary

  result.json(obj); //Should be the last statement called
  return;
};


//exports.[function name]
exports.get_cadet_info = function(request, result) {
    //check 'req.query': all query strings are in it
    var page = req._parsedUrl.pathname.split("/").pop();
    //this will get you the ':userid' part
    var ret = {
        "name": "bob",
        "grade": "5th grade",
        //whatever else
    }
    res.json(ret);
}