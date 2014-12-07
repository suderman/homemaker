var React = require('react'),
    Gateways = require('../components/gateway').Gateways;

  
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
    res.render('index', { title: 'Homemaker', body: router.render(<p/>) });
  })

  .get('/nodes', function(req, res) {
    res.render('index', { title: 'Nodes & Actions', body: router.render(<p/>) });
  })

  .get('/gateways', function(req, res) {

    app.get('db').model('Gateway').findAll().then(function(collection){ 
      res.render('index', { 
        title: 'Gateways & Responders', 
        initialData: JSON.stringify(collection.toJSON()),
        body: router.render(<Gateways initialData={collection.toJSON()} />) 
      });

    }).catch(router.error.bind(router, res));

    
  })

  .get('/devices', function(req, res) {
    res.render('index', { title: 'Devices & Commands', body: router.render(<p/>) });
  })

};
