/* Nodes Routes
 * -----------------------------
   /api/nodes
   /api/nodes/all
   /api/nodes/1
   /api/nodes/1/nodes
   /api/nodes/1/actions
   /api/nodes/1/urls
*/
module.exports = function(app) {

  // Models used
  var Node = app.get('db').model('Node'),
      URL = app.get('db').model('URL');

  // Define routes
  var router = require('api/routes')();
  router
  
  // Everything but index
  .getResource(Node)   
  .postResource(Node)  
  .putResource(Node)   
  .deleteResource(Node)
  .nestedResource(Node)

  // Index
  .get('/', function(req, res) {
    Node.findAll({ node_id: null }).then(function(collection){ 
      res.send(collection.toJSON({shallow: true})); 
    }).catch(router.error.bind(router, res));
  })

  // Index all
  .get('/all', function(req, res) {
    Node.findAll().then(function(collection){ 
      res.send(collection.toJSON({shallow: true})); 
    }).catch(router.error.bind(router, res));
  })


  .get('/:id/update', function(req, res) {

    Node.find(req.params.id).then(function(node) { 
      return node.updateURL();
     
    }).then(function(nodes){
      res.send(nodes);

    }).catch(router.error.bind(router, res));

  });

  return router.express;
};
