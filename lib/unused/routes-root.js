/* Root Routes
 * -----------------------------
   /
   /*anything*
*/
module.exports = function(app) {

  // Models used
  var URL = app.get('db').model('URL');

  // Define routes
  var router = app.get('router')();
  return router

  // GET home page
  .get('/', function(req, res) {
    res.render('index', { title: 'Express' });
  })

  // GET any path and match to URL model
  .get(/^\/(.+)/, function(req, res) {
    var args = { path: req.params[0] };
    URL.find(args).then(function (url){ 
      if (!url) throw new Error('Path not found: /' + args.path);
      url.run();
      res.send(url.toJSON()); 

    }).catch(router.fourOhFour.bind(router, res));
  })

};