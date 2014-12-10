var React = require('react'),
    GatewayList = require('components/GatewayList');

  
/* Homemaker Routes
 * -----------------------------
   /homemaker
*/
module.exports = function(app) {

  var initialData = JSON.stringify(null);

  // Define routes
  var ExpressRouter = app.get('router')();
  return ExpressRouter

  // GET home page
  .get('/', function(req, res) {
    res.render('index', { 
      title: 'Homemaker', 
      initialData: initialData,
      body: '' 
      // body: router.render(<p/>) 
    });
  })

  // .get('/nodes', function(req, res) {
  //   res.render('index', { 
  //     title: 'Nodes & Actions', 
  //     initialData: initialData,
  //     body: router.render(<p/>) 
  //   });
  // })

  // .get('/gateways', function(req, res) {
  //
  //   app.get('db').model('Gateway').findAll(null).then(function(collection){ 
  //     var initialData = JSON.stringify(collection.toJSON());
  //
  //     res.render('index', { 
  //       title: 'Gateways & Responders', 
  //       initialData: initialData,
  //       body: ExpressRouter.render(<GatewayList initialData={collection.toJSON()} />) 
  //     });
  //
  //   }).catch(ExpressRouter.error.bind(ExpressRouter, res));
  // })

  .get('/gateways', function(req, res) {
    var data = {};

    app.get('db').model('Gateway').findAll(null).then(function(collection){ 
      data['list'] = collection.toJSON();
      return app.get('db').model('Gateway').types()

    }).then(function(types) {
      data['types'] = types;
      return;

    }).then(function() {

      ExpressRouter.renderReactRouter(req, res, {
        path: '/homemaker/gateways',
        title: 'Gateways & Responders', 
        data: data,
      });

    }).catch(ExpressRouter.error.bind(ExpressRouter, res));
  })

  // .get('/devices', function(req, res) {
  //   res.render('index', { 
  //     title: 'Devices & Commands', 
  //     initialData: initialData,
  //     body: router.render(<p/>) 
  //   });
  // })

  // CATCH-ALL
  .get(/^\/(.+)/, function(req, res) {
    var path = '/homemaker/' + req.params[0];

    ExpressRouter.renderReactRouter(req, res, {
      path: path,
      title: 'Homemaker ' + path,
      data: null
    });
  })
};
