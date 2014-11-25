module.exports = function(app) {

  // Models used
  var Node = app.get('db').model('Node');

  // Default routes
  var router = app.get('router')(Node);
  return router
};
