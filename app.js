var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require('underscore');

// Allow cross domain
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(logger('dev'));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Load adapters & protocols
app.set('adapters', require('./adapters'));
app.set('protocols', require('./protocols'));

// Configure database
app.set('db', require('bookshelf')(require('knex')({
  client: 'mysql',
  debug: false,
  connection: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'homemaker',
    charset: 'utf8'
  }
}))
.plugin('registry')
.plugin('virtuals')
.plugin('visibility'));

// Ensure database is set up
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

// Define base route
app.set('router', require('./routes/router'));

// Define routes
app.use('/api/actions',       require('./routes/action'   )(app));
app.use('/api/commands',      require('./routes/command'  )(app));
app.use('/api/devices',       require('./routes/device'   )(app));
app.use('/api/gateways',      require('./routes/gateway'  )(app));
app.use('/api/nodes',         require('./routes/node'     )(app));
app.use('/api/responders',    require('./routes/responder')(app));
app.use('/api/urls',          require('./routes/url'      )(app));
app.use('/',                  require('./routes/root'     )(app));

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
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
