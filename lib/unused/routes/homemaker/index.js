/* Homemaker Routes
 * -----------------------------
   /homemaker
*/
module.exports = function(app) {

  app.use('/homemaker/devices',  require('./devices')(app));
  app.use('/homemaker/gateways', require('./gateways')(app));
  app.use('/homemaker/nodes',    require('./nodes')(app));
  app.use('/homemaker',          require('./home')(app));

};
