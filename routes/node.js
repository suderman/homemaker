/* Nodes Routes
 * -----------------------------
   /api/nodes
   /api/nodes/1
   /api/nodes/1/nodes
   /api/nodes/1/actions
   /api/nodes/1/urls
*/
module.exports = function(app) {

  // Models used
  var Node = app.get('db').model('Node');

  // Default routes
  var router = app.get('router')(Node);
  return router
};
