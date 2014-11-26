module.exports = function(app) {

  // Models used
  var Gateway = app.get('db').model('Gateway');

  // Define routes
  var router = app.get('router')(Gateway);
  return router
  
  // GET valid gateway types
  .get('/types', function(req, res) {
    res.send(Gateway.availableTypes()); 
  })

  // GET all possible responders
  .get('/:id/all-responders', function(req, res) {
    Gateway.find(req.params.id, ['responders']).then(function(model){ 
      return model.related('responders'); 
    }).then(function(responders){
      res.send(responders);
    }).catch(function(err){ 
      router.handleError(err, res); 
    });
  })

  // GET responder addresses (grouped by type)
  .get('/:id/responder-addresses', function(req, res) {
    Gateway.find(req.params.id).then(function(model){ 
      return model.responderAddresses();
    }).then(function(addresses){
      res.send(addresses);
    }).catch(function(err){ 
      router.handleError(err, res); 
    });
  })
  
  // GET responder types
  .get('/:id/responder-types', function(req, res) {
    Gateway.find(req.params.id).then(function(model){ 
      res.send(model.responderTypes());
    }).catch(function(err){ 
      router.handleError(err, res); 
    });
  })
};
