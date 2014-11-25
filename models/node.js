module.exports = function(app) {
  var db = app.get('db');

  var Node = db.model('Model').extend({
    tableName: 'node',

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
    }


  },{
    related: ['node', 'statusResponder', 'lastAction'],
    nested: ['actions', 'nodes', 'urls']
  });

  return db.model('Node', Node);
}
