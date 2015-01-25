/* Nodes Routes
 * -----------------------------
   /api/nodes
   /api/nodes/all
   /api/nodes/tree
   /api/nodes/1
   /api/nodes/1/nodes
   /api/nodes/1/actions
   /api/nodes/1/urls
*/
var _ = require('lodash');
var Promise = require('bluebird');
module.exports = function(app) {

  // Models used
  var Node = app.get('db').model('Node'),
      Action = app.get('db').model('Action'),
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
    Node.findAll({ node_id: 0 }).then(function(collection){ 
      res.send(collection.toJSON({shallow: true})); 
    }).catch(router.error.bind(router, res));
  })

  // Index all
  .get('/all', function(req, res) {
    Node.findAll().then(function(collection){ 
      res.send(collection.toJSON({shallow: true})); 
    }).catch(router.error.bind(router, res));
  })

  // Index tree
  .get('/api', API)
  .get('/:id/api', API)

  // Index tree
  .get('/tree', function(req, res) {
    return Node.findAll().then(function(collection) {

      var allNodes = collection.toJSON({shallow: true}) || [];

      function findNodes(parentNodeId) {
        var nodes = _.where(allNodes, { node_id: parentNodeId });
        nodes.forEach((node) => node.nodes = findNodes(node.id));
        return nodes;
      }

      res.send([{ 
        id: 0, 
        name: '/', 
        nodes: findNodes(0) 
      }]); 

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


  function API(req, res) {
    var id = _.parseInt(req.params.id) || 0;

    return Promise.props({
      nodes: Node.findAll().then(collection => collection.toJSON({shallow: true}) || []),
      actions: Action.findAll().then(collection => collection.toJSON({shallow: true}) || []),

    }).then(function(all) {

      function parseStatus(status='') {
        var number = parseFloat(status);
        return (_.isNaN(number)) ? status : number;
      }

      function findActions(id) {
        var actions = _.where(all.actions, { node_id: id });
        return actions.map((action) => {
          return {
            name: action.name,
            path: action.name
          }
        });
      }

      function findNodes(id) {
        var nodes = _.where(all.nodes, { node_id: id });
        return nodes.map((node) => {

          return {
            name: node.name,
            path: node.name,
            status: parseStatus(node.status),
            actions: findActions(node.id),
            nodes: findNodes(node.id)
          }
        });
      }

      var root = _.find(all.nodes, {id: id});
      var name = (root) ? root.name : '/', 
          path = (root) ? root.path : '/',
          status = (root) ? root.status : '';

      res.send({ 
        name:    name, 
        path:    path, 
        status:  parseStatus(status),
        actions: findActions(id),
        nodes:   findNodes(id)
      }); 

    }).catch(router.error.bind(router, res));
  }
};
