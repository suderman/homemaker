module.exports = function(app) {

  var Responder = app.get('db').model('Responder');

  // Default routes
  var router = app.get('router')(Responder);
  return router

  // GET responder types
  .get('/types', function(req, res) {
    res.send(Responder.types); 
  })

  // GET available responder types
  .get('/:id/types', function(req, res) {
    Responder.find(req.params.id).then(function(model){ 
      res.send(model.availableTypes());
    }).catch(function(err){ 
      router.handleError(err, res); 
    });
  })

  // GET available addresses
  .get('/:id/addresses', function(req, res) {
    res.send('list available addresses'); 
  })

  // GET available commands
  .get('/:id/commands', function(req, res) {
    res.send('list available commands'); 
  })
};
