/* Commands Routes
 * -----------------------------
   /api/commands
   /api/commands/1
*/
module.exports = function(app) {

  // Models
  var Command = app.get('db').model('Command');

  // Routes
  var router = require('lib/router/server')();
  return router.resource(Command);
};
