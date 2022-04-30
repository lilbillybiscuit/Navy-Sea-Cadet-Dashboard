//This code sets up the Node.js API server. 

var express = require('express'),
  app = express(),
  port = process.env.PORT || 8000,
  bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
/*app.use(session({
	secret: 'ny39n245c8c2298n3oiuh2nt0s',
	resave: true,
	saveUninitialized: true
}));*/


var routes = require('./api/routes/listroutes'); //importing route
routes(app); //register the route
app.listen(port);

console.log('CFC API server started on: http://localhost:' + port);

process.on('SIGINT', function() {
    console.log("Stopping server...");
    process.exit();
});

