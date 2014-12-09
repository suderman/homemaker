var React = require('react'),
    GatewayList = require('components/GatewayList');

  
/* Homemaker Routes
 * -----------------------------
   /homemaker
*/
module.exports = function(app) {

  var initialData = JSON.stringify(null);

  // Define routes
  var router = app.get('router')();
  return router

  // GET home page
  .get('/', function(req, res) {
    res.render('index', { 
      title: 'Homemaker', 
      initialData: initialData,
      body: '' 
      // body: router.render(<p/>) 
    });
  })

  .get('/nodes', function(req, res) {
    res.render('index', { 
      title: 'Nodes & Actions', 
      initialData: initialData,
      body: router.render(<p/>) 
    });
  })

  .get('/gateways', function(req, res) {

    app.get('db').model('Gateway').findAll().then(function(collection){ 
      var initialData = JSON.stringify(collection.toJSON());

      res.render('index', { 
        title: 'Gateways & Responders', 
        initialData: initialData,
        body: router.render(<GatewayList initialData={collection.toJSON()} />) 
      });

    }).catch(router.error.bind(router, res));

    
  })

  .get('/devices', function(req, res) {
    res.render('index', { 
      title: 'Devices & Commands', 
      initialData: initialData,
      body: router.render(<p/>) 
    });
  })

};
