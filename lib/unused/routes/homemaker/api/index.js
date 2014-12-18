/* Homemaker API Routes
 * -----------------------------
   /homemaker/api/actions/*
   /homemaker/api/commands/*
   /homemaker/api/devices/*
   /homemaker/api/gateways/*
   /homemaker/api/nodes/*
   /homemaker/api/responders/*
   /homemaker/api/urls/*
   /homemaker/api/*
*/
module.exports = function(app) {

  app.use('/homemaker/api/actions',    require('./action'   )(app));
  app.use('/homemaker/api/commands',   require('./command'  )(app));
  app.use('/homemaker/api/devices',    require('./device'   )(app));
  app.use('/homemaker/api/gateways',   require('./gateway'  )(app));
  app.use('/homemaker/api/nodes',      require('./node'     )(app));
  app.use('/homemaker/api/responders', require('./responder')(app));
  app.use('/homemaker/api/urls',       require('./url'      )(app));

  app.get('/homemaker/api', function(req, res, next) {
    res.send({});
  })
}
