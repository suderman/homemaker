/* API Routes
 * -----------------------------
   /actions/*
   /commands/*
   /devices/*
   /gateways/*
   /nodes/*
   /responders/*
   /urls/*
   /*
*/
module.exports = function(app) {

  app.use('/actions',    require('./action'   )(app));
  app.use('/commands',   require('./command'  )(app));
  app.use('/devices',    require('./device'   )(app));
  app.use('/gateways',   require('./gateway'  )(app));
  app.use('/nodes',      require('./node'     )(app));
  app.use('/responders', require('./responder')(app));
  app.use('/urls',       require('./url'      )(app));

  app.get('/', function(req, res, next) {
    res.send({});
  });
}
