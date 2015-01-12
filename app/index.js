var path = require('path');
var express = require('express');
var app = express();
var httpServer = require('http').Server(app);

// DEBUG=homemaker npm start
module.exports = function(port, apiPort) {

  // Listen on port
  httpServer.listen(port, function() {
    console.log('App listening on port ' + port);
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

  // Handlebars view engine (only used once!)
  app.set('views', path.join(__dirname));
  app.set('view engine', 'hjs');

  // LESS compiler
  app.use(require('less-middleware')(path.join(__dirname, 'styles'), {
    dest: path.join(__dirname, '../public')
  }));

  // Static assets
  app.use(express.static(path.join(__dirname, '../public')));

  // Allow requiring of jsx
  require('node-jsx').install({harmony:true});

  // Server-side controllers
  var server = require('app/lib/server')({
    api: 'http://127.0.0.1:' + apiPort,
    httpServer: httpServer
  });

  // Mount routes
  // console.log(server.router.middleware());
  app.use(server.router.middleware());

  // require('app/lib/json')(app, 'http://127.0.0.1:' + apiPort);
  // require('app/lib/html')(app);

  // // Socket.io
  // require('./events/server')(app, httpServer);

  // Errors
  var errorValues = { 
    title: 'Application Error',
    state: JSON.stringify({})
  }

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      errorValues.body = err.message + '<br><br>' + err;
      res.render('index', errorValues);
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    errorValues.body = errorValues.title;
    res.render('index', errorValues);
  });

  return app;
};
