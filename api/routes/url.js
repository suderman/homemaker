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
  return router.resource(URL)

  // Run URL action by path name
  .get(/^\/(.+)/, function(req, res) {
    var args = { path: req.params[0] };
    URL.find(args).then(function (url){ 
      if (!url) throw new Error('Path not found: /' + args.path);
      url.run();
      res.send(url.toJSON()); 

    }).catch(router.fourOhFour.bind(router, res));
  });

};
