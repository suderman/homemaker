/* URLs Routes
 * -----------------------------
   /api/urls
   /api/urls/1
*/
module.exports = function(app) {

  // Models used
  var URL = app.get('db').model('URL');

  // Define routes
  var router = require('lib/router/server')();
  return router.resource(URL);
};
