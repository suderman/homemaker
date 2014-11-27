module.exports = function(app) {
  var db = app.get('db');

  var Action = db.model('Model').extend({
    tableName: 'action',

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
      code: function() {
        return this.get('custom_code') || this.related('command').get('code');
      }
    },

    run: function() {
      this.related('responder').send(this.get('code')).then(function(response) {
        console.log("PROMISE RESPONSE " + response)
      }).catch(function(err){ });
    }

  },{
    related: ['node', 'responder.gateway', 'gateway', 'command'],
    nested: ['urls']
  });

  return db.model('Action', Action);
}
