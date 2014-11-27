/* Actions Routes
 * -----------------------------
   /api/actions
   /api/actions/1
   /api/actions/1/urls
*/
module.exports = function(app) {

  // Models
  var Action = app.get('db').model('Action');
  var Node = app.get('db').model('Node');

  // Default routes
  var router = app.get('router')(Action);
  return router

};
