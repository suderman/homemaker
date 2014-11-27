/* Responders Routes
 * -----------------------------
   /api/responders
   /api/responders/types
   /api/responders/1
   /api/responders/1/commands
*/
module.exports = function(app) {

  var Responder = app.get('db').model('Responder');

  // Default routes
  var router = app.get('router')(Responder);
  return router

  // GET valid gateway responder types
  .get('/types', function(req, res) {
    res.send(Responder.types()); 
  })

  // GET available commands
  .get('/:id/commands', function(req, res) {
    Responder.find(req.params.id).then(function(model){ 
      return model.commands();
    }).then(function(commands){
      res.send(commands);

    }).catch(router.error.bind(router, res));
  })
};
