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

      message: function() {
        return this.get('custom_command') || this.related('command').get('command') || null;
      },

      feedback: function() {
        return this.get('custom_feedback') || this.related('command').get('feedback') || null;
      }
    },

    run: function() {
      return this.related('responder').send(this.get('message'));
      // this.related('responder').send(this.get('message')).then(function(response) {
      //   console.log("PROMISE RESPONSE " + response)
      // }).catch(function(err){ });
    }

  },{
    related: ['node', 'responder.gateway', 'gateway', 'command'],
    nested: ['urls']
  });

  return db.model('Action', Action);
}
