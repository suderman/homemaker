/* Homemaker Routes
 * -----------------------------
   /homemaker
*/
module.exports = function(app) {

  // Define routes
  var router = app.get('router')();
  return router

  // GET home page
  .get('/', function(req, res) {
    res.render('index', { title: 'Homemaker' });
  })

};
