var _ = require('underscore');
var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);

// DEBUG=homemaker npm start
module.exports = function(port) {

  // Listen on port
  server.listen(port, function() {
    console.log('API listening on port ' + port);
  });

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
  app.use('/actions',    require('./routes/action'   )(app));
  app.use('/commands',   require('./routes/command'  )(app));
  app.use('/devices',    require('./routes/device'   )(app));
  app.use('/gateways',   require('./routes/gateway'  )(app));
  app.use('/nodes',      require('./routes/node'     )(app));
  app.use('/responders', require('./routes/responder')(app));
  app.use('/urls',       require('./routes/url'      )(app));
  app.get('/',           function(req, res) { res.send({}); });


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

  return app;
}
