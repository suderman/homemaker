/* Actions Routes
 * -----------------------------
   /api/actions
   /api/actions/1
   /api/actions/1/urls
*/
var Promise = require('bluebird');
module.exports = function(app) {

  // Models
  var Action = app.get('db').model('Action');

  // Routes
  var router = require('api/routes')();
  router.resource(Action)

  // GET any path and match to URL model
  .get('/:id/run', function(req, res) {
    Action.find(req.params.id).then(function (action){ 
      return action.run();
    
    }).then(function(feedback) {
      res.send(feedback); 

    }).catch(router.fourOhFour.bind(router, res));
  })


  .get('/:id/api', function(req, res) {
    Action.find(req.params.id).then(function (action){ 
      console.log(action.related('responder').attributes)
      return Promise.props({
        action: action.toJSON({shallow: true}),
        feedback: action.run(),
        type: action.related('responder').get('responderType')
      });
    
    }).then(function(all) {
      res.send({
        name: all.action.name,
        path: all.action.name,
        success: all.feedback.success,
        status: all.feedback.status,
        prevStatus: all.feedback.prevStatus,
        feedback: all.feedback.feedback,
        type: all.type
      }); 

    }).catch(router.error.bind(router, res));
  });

  return router.express;
};
