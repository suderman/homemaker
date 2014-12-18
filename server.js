// DEBUG=homemaker npm start
var _ = require('underscore');
var path = require('path');
var express = require('express');
var app = express();

// Logging
app.use(require('morgan')('dev'));

// Load environment variables
require('dotenv').load();

// Used when calling own routes within app 
app.localhost = function() { return 'http://127.0.0.1:' + app.get('port'); } 

// // Allow cross domain
// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });

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
app.use(express.static(path.join(__dirname, 'public')));

// Allow requiring of jsx
require('node-jsx').install({harmony:true});

// Load adapters & protocols
app.set('adapters', require('./adapters'));
app.set('protocols', require('./protocols'));

// app.set('db', require('bookshelf')(require('knex')({
//   client: 'mysql',
//   debug: false,
//   connection: {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     charset: 'utf8'
//   }
// }))
// .plugin('registry')
// .plugin('virtuals')
// .plugin('visibility'));

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
require('routes/homemaker/api')(app);
require('routes/homemaker')(app);
require('routes')(app);

// app.use('/homemaker',                require('./routes/homemaker')(app));
// app.use('/',                         require('./routes'      )(app));

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
