// Make ES6/JSX work
require("6to5/register")({ experimental: true });

var express = require('express');
var app = express();
var path = require('path');

// Load environment variables
require('dotenv').load();

// Logging
app.use(require('morgan')('dev'));

// parse application/x-www-form-urlencoded and application/json
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Get cookie info
app.use(require('cookie-parser')());
 
// Compress all requests
app.use(require('compression')());

// Handlebars view engine (only used once!)
app.set('views', path.join(__dirname));
app.set('view engine', 'hjs');

// LESS compiler
app.use(require('less-middleware')(path.join(__dirname, 'styles'), {
  dest: path.join(__dirname, '../public')
}));

// Static assets
app.use(express.static(path.join(__dirname, '../public')));

// Errors
var errorValues = { 
  title: 'Application Error',
  state: JSON.stringify({})
}

// development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    errorValues.body = err.message + '<br><br>' + err;
    res.render('index', errorValues);
  });
}

// production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  errorValues.body = errorValues.title;
  res.render('index', errorValues);
});

// DEBUG=homemaker npm start
module.exports = function(port, apiPort) {

  // Server-side libraries
  var api = 'http://127.0.0.1:' + apiPort;
  var http = require('http').Server(app);
  var server = require('app/lib/server')(api, http);

  // Mount routes
  app.use(server.router.middleware());

  // Listen on port
  http.listen(port, function() {
    console.log('App listening on port ' + port);
  });

  return app;
};
