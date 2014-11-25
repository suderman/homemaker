module.exports = function(app) {

  // Models used
  var URL = app.get('db').model('URL');

  // Define routes
  var router = app.get('router')(URL);
  return router
};
