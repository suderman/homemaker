/* Gateways Routes
 * -----------------------------
   /api/gateways
   /api/gateways/all
   /api/gateways/types
   /api/gateways/1
   /api/gateways/1/types
   /api/gateways/1/addresses
   /api/gateways/1/responders
   /api/gateways/1/responders/all
*/
var Promise = require('bluebird');
module.exports = function(app) {

  // Models used
  var Gateway = app.get('db').model('Gateway'),
      Responder = app.get('db').model('Responder');

  // Define routes
  var router = app.get('router')(Gateway);
  return router
  
  // GET all without filters
  .get('/all', function(req, res) {
    Gateway.findAll(null).then(function(collection){ 
      res.send(collection.toJSON()); 
    }).catch(router.error.bind(router, res));
  })

  // GET valid gateway types
  .get('/types', function(req, res) {
    res.send(Gateway.types()); 
  })

  // GET valid responder types
  .get('/:id/types', function(req, res) {
    Gateway.find(req.params.id).then(function(gateway){ 
      res.send(gateway.types());
    }).catch(router.error.bind(router, res));
  })

  // GET responder addresses (grouped by type)
  .get('/:id/addresses', function(req, res) {
    Gateway.find(req.params.id).then(function(model){ 
      return model.addresses();
    }).then(function(addresses){
      res.send(addresses);
    }).catch(router.error.bind(router, res));
  })

  // GET all possible responders
  .get('/:id/responders/all', function(req, res) {
    var gatewayId = parseInt(req.params.id, 10);

    Gateway.find(gatewayId).then(function(gateway){ 
      return Promise.props({
        valid: Responder.findAllValid(gateway),
        saved: Responder.findAll({ gateway_id: gatewayId }) 
      });

    }).then(function(responders) {
      return Responder.combine(responders.valid, responders.saved)

    }).then(function(responders){
      res.send(responders);

    }).catch(router.error.bind(router, res));
  })

};
