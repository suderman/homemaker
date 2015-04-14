module.exports = function(app) {
  var db = app.get('db');

  var _ = require('underscore');
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

    urls: function() {
      return this.hasMany('URL');
    },

    run: function() {
      var responder = this.related('responder'),
          node = this.related('node'),
          actionFeedback = this.get('feedback'),
          nodeStatus = this.related('node').get('status');

      // Send the command
      return responder.send(this.get('command'))

         // Format feedback accordingly (use adapter feedback method)
        .then((feedback) => responder.feedback(feedback, actionFeedback, nodeStatus))

         // Only update node if feedback is successful and not an empty string
        .then((feedback) => {
          if ((feedback.success) && (feedback.status)!='') {
            node.save({ status: feedback.status }, { patch: true });
          } 
          return feedback;
        });
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
      var id = this.get('id');
      if (id < 1) return;

      return db.model('URL').find({ action_id: id }).then(function(url) {
        return url.destroy();
      });
    },

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
    related: ['node', 'responder.gateway', 'gateway'],
    nested: ['urls']
  });

  return db.model('Action', Action);
}
