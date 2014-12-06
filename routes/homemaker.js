var React = require('react'),
    Hero = require('../components/hero'),
    Gateways = require('../components/gateway').Gateways;

  
/* Homemaker Routes
 * -----------------------------
   /homemaker
*/
module.exports = function(app) {

  var gateways = [{name: 'one', host: 'onehost', port: '80'}, {name: 'two', host: 'onetwo', port: '90'}];

  // Define routes
  var router = app.get('router')();
  return router

  // GET home page
  .get('/', function(req, res) {
    res.render('index', { title: 'Homemaker', body: router.render(<Hero name="Jonathan James Suderman"/>) });
  })

  .get('/nodes', function(req, res) {
    res.render('index', { title: 'Nodes & Actions', body: router.render(<Hero name="Jonathan James"/>) });
  })

  .get('/gateways', function(req, res) {

    app.get('db').model('Gateway').findAll().then(function(collection){ 
      res.render('index', { 
        title: 'Gateways & Responders', 
        body: router.render(<Gateways collection={collection.toJSON()}/>) 
      });

    }).catch(router.error.bind(router, res));

    
  })

  .get('/devices', function(req, res) {
    res.render('index', { title: 'Devices & Commands', body: router.render(<Hero name="Jonathan James"/>) });
  })

};
