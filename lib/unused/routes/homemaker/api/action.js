/* Actions Routes
 * -----------------------------
   /api/actions
   /api/actions/1
   /api/actions/1/urls
*/
module.exports = function(app) {

  // Models
  var Action = app.get('db').model('Action');

  // Routes
  var router = require('lib/router/server')();
  return router.resource(Action)

  // GET any path and match to URL model
  .get('/:id/run', function(req, res) {
    Action.find(req.params.id).then(function (action){ 
      return action.run();
    
    }).then(function(feedback) {
      res.send(feedback); 

    }).catch(router.fourOhFour.bind(router, res));
  })
};
