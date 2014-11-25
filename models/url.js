module.exports = function(app) {
  var db = app.get('db');

  var URL = db.model('Model').extend({
    tableName: 'url',

    node: function() {
      return this.belongsTo('Node');
    },

    action: function() {
      return this.belongsTo('Action');
    },

    run: function() {
      db.model('Action')
        .find(this.get('action_id'))
        .then(function(action){ action.run(); })
        .catch(function(err){ });
    }

  },{
    related: ['node','action'],
    nested: []
  });

  return db.model('URL', URL);
}
