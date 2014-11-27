/* Responders Routes
 * -----------------------------
   /api/responders
   /api/responders/1
   /api/responders/1/commands
*/
module.exports = function(app) {

  var Responder = app.get('db').model('Responder');

  // Default routes
  var router = app.get('router')(Responder);
  return router

  // GET available commands
  .get('/:id/commands', function(req, res) {
    Responder.find(req.params.id).then(function(model){ 
      return model.commands();
    }).then(function(commands){
      res.send(commands);
    }).catch(function(err){ 
      router.handleError(err, res); 
    });
  })
};
