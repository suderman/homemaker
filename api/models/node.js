module.exports = function(app) {
  var db = app.get('db');

  var _ = require('lodash/dist/lodash.underscore');
  var Promise = require('bluebird');

  var Node = db.model('Model').extend({
    tableName: 'node',

    initialize: function() {
      
      this.on('saved', function(node){
        node.updateURL();
      });

      this.on('destroying', function(node){
        node.deleteURL();
        node.deleteChildren();
      });

    },

    node: function() {
      return this.belongsTo('Node');
    },

    nodes: function() {
      return this.hasMany('Node');
    },

    actions: function() {
      return this.hasMany('Action');
    },

    urls: function() {
      return this.hasMany('URL');
    },

    statusResponder: function() {
      return this.belongsTo('Responder', 'status_responder_id');
    }, 

    lastAction: function() {
      return this.belongsTo('Action', 'last_action_id');
    },

    virtuals: {
    },

    path: function(path) {
      path = path || [];
      path.unshift(this.get('name'));

      var id = this.get('node_id');
      if (id < 1) return path.join('/');

      return Node.find(id).then(function(node) {
        return node.path(path);
      });
    },

    deleteURL: function() {
      return db.model('URL').find({ node_id: id }).then(function(url) {
        return url.destroy();
      });
    },

    deleteChildren: function() {

      var Action = db.model('Action');
      var id = this.get('id');
      if (id < 1) return;

      Node.findAll({ node_id: id }).then(function(nodes) {
        nodes.each(function(node) {
          node.destroy();
        });
      });

      Action.findAll({ node_id: id }).then(function(actions) {
        actions.each(function(action) {
          action.destroy();
        });
      });
    },

    updateURL: function() {

      var Action = db.model('Action');
      var id = this.get('id');
      if (id < 1) return;

      return Promise.props({
        path: this.path(),
        url: db.model('URL').findOrNew({ node_id: id }, { node_id: id, type: 'node' }) 

      }).then(function(node) {
        return node.url.save({ path: node.path });

      }).then(function() {
        return Promise.props({
          nodes: Node.findAll({ node_id: id }),
          actions: Action.findAll({ node_id: id })
        });

      }).then(function(children) {
        var r = [];

        children.nodes.each(function(node) {
          node.updateURL();
          r.push(node);
        });

        children.actions.each(function(action) {
          action.updateURL();
          r.push(action);
        });
        
        return r;
      });
    }

  },{
    related: ['node', 'statusResponder', 'lastAction'],
    nested: ['actions', 'nodes', 'urls']
  });

  return db.model('Node', Node);
}
