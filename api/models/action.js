module.exports = function(app) {
  var db = app.get('db');

  var _ = require('lodash/dist/lodash.underscore');
  var Promise = require('bluebird');

  var Action = db.model('Model').extend({
    tableName: 'action',

    initialize: function() {
      
      this.on('saved', function(action){
        action.updateURL();
      });

      this.on('destroying', function(action){
        action.deleteURL();
      });

    },

    node: function() {
      return this.belongsTo('Node');
    },

    responder: function() {
      return this.belongsTo('Responder');
    },

    gateway: function() {
      return this.belongsTo('Gateway').through('Responder');
    },

    command: function() {
      return this.belongsTo('Command');
    }, 

    urls: function() {
      return this.hasMany('URL');
    },

    virtuals: {

      message: function() {
        return this.get('custom_command') || this.related('command').get('command') || null;
      },

      feedback: function() {
        return this.get('custom_feedback') || this.related('command').get('feedback') || null;
      }
    },

    run: function() {
      return this.related('responder').send(this.get('message'));
    },

    path: function(path) {
      var Node = db.model('Node');

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
    // deleteURL: function() {
    //   return db.model('URL').find({ action_id: id }).then(function(url) {
    //     return url.destroy();
    //   });
    // },

    updateURL: function() {

      var URL = db.model('URL');
      var id = this.get('id');
      if (id < 1) return;

      return Promise.props({
        path: this.path(),
        url: URL.findOrNew({ action_id: id }, { action_id: id, type: 'action' }) 

      }).then(function(action) {
        return action.url.save({ path: action.path });
      })
    }

  },{
    related: ['node', 'responder.gateway', 'gateway', 'command'],
    nested: ['urls']
  });

  return db.model('Action', Action);
}
