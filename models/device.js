module.exports = function(app) {
  var db = app.get('db');

  var Device = db.model('Model').extend({
    tableName: 'device',

    commands: function() {
      return this.hasMany('Command');
    }

  },{
    related: [],
    nested: ['commands'],

    findAllByResponder: function(responder) {
      return this.findAll({
        responder_type: responder.get('responderType')
      });
    }

  });

  return db.model('Device', Device);
}
