module.exports = function(app) {

  // Models
  var Device = app.get('db').model('Device');

  // Define routes
  var router = app.get('router')(Device);
  return router
};
