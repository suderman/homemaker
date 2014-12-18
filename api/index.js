var _ = require('underscore');
var path = require('path');
var express = require('express');
var app = express();

// Logging
app.use(require('morgan')('dev'));

// Load environment variables
require('dotenv').load();

// parse application/x-www-form-urlencoded and application/json
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Get cookie info
app.use(require('cookie-parser')());
 
// Compress all requests
app.use(require('compression')());

// Load adapters & protocols
app.set('adapters', require('./adapters'));
app.set('protocols', require('./protocols'));

// Configure database
require('./db/config')(app);
require('./db/schema')(app);

// Define models
require('./models')(app);

// Connect to active gateways
var Gateway = app.get('db').model('Gateway');
Gateway.findAll().then(function(gateways) {
  gateways.each(function(gateway) {
    gateway.connect();
  });
});

// Define routes
require('./routes')(app);

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('index', { body: err.message + '<br><br>' + err });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
