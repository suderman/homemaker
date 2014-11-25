module.exports = function(app) {

  // Models
  var Command = app.get('db').model('Command');

  // Default routes
  var router = app.get('router')(Command);
  return router
};
