module.exports = function(app) {
  var db = app.get('db');

  var Command = db.model('Model').extend({
    tableName: 'command',

    device: function() {
      return this.belongsTo('Device');
    },

    actions: function() {
      return this.hasMany('Action');
    }, 
      
  },{
    related: ['device'],
    nested: ['actions']
  });

  return db.model('Command', Command);
}
