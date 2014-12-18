/* Responders Routes
 * -----------------------------
   /api/responders
   /api/responders/types
   /api/responders/1
   /api/responders/1/commands
*/
module.exports = function(app) {

  var Responder = app.get('db').model('Responder');

  // Routes
  var router = require('lib/router/server')();
  return router.resource(Responder)

  // GET valid gateway responder types
  .get('/types', function(req, res) {
    res.send(Responder.types()); 
  })

  // GET available commands
  .get('/:id/commands', function(req, res) {
    var responderId = parseInt(req.params.id, 10);

    Responder.find(responderId).then(function(responder){ 
      return responder.commands();

    }).then(function(commands){
      res.send(commands);

    }).catch(router.error.bind(router, res));
  })
};
