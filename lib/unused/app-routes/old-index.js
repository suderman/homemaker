/* Homemaker Routes
 * -----------------------------
   /
   /*anything*
*/
var http = new (require('http-transport'))();

module.exports = function(app) {

  // Define routes
  var router = require('app/routes/server')();

  // GET home page
  .get('/', function(req, res) {
    res.send({}); 
  })

  // Find a URL path and run its action
  .get(/^\/(.+)/, function(req, res) {
    var path = app.api('/urls/' + req.params[0]);

    http.get(path).then(function(json) {
      res.send(json.body); 

    }).catch(router.error.bind(router, res));

  });

  // Mount
  app.use('/', router);
};
