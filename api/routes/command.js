/* Commands Routes
 * -----------------------------
   /api/commands
   /api/commands/1
*/
module.exports = function(app) {

  // Models
  var Command = app.get('db').model('Command');

  // Routes
  var router = require('api/routes')();
  router.resource(Command);

  return router.express;
};
