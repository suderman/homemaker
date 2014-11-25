module.exports = function(app) {
  var db = app.get('db');

  var Device = db.model('Model').extend({
    tableName: 'device',

    commands: function() {
      return this.hasMany('Command');
    },

    responder: function() {
      return this.belongsTo('Responder');
    }

  },{
    related: ['responder'],
    nested: ['commands']
  });

  return db.model('Device', Device);
}
