// DEBUG=homemaker npm start
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

// Handlebars view engine (only used once!)
app.set('views', path.join(__dirname));
app.set('view engine', 'hjs');

// LESS compiler
app.use(require('less-middleware')(path.join(__dirname, 'styles'), {
  dest: path.join(__dirname, 'public')
}));

// Static assets
app.use(express.static(path.join(__dirname, '../public')));

// Allow requiring of jsx
require('node-jsx').install({harmony:true});

// Define routes
require('./routes/homemaker')(app);
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

// Used when calling localhost api routes within app 
app.api = function(path) { 
  return 'http://127.0.0.1:' + app.get('api_port') + path; 
} 

module.exports = app;
