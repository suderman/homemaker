module.exports = function(app) {
  var db = app.get('db');

  var _ = require('underscore');
  var Promise = require('bluebird');

  var Responder = db.model('Model').extend({
    tableName: 'responder',

    type: function() {
      return db.model('Responder').types[this.get('type')];
    },

    gateway: function() {
      return this.belongsTo('Gateway');
    },

    virtuals: {
      gatewayType: function() {
        var type = this.related('gateway').get('type');
        if (type) { 
          return type;
        } else {
          throw new Error("Responder hasn't loaded Gateway");
        }
      }
    },

    adapter: function() {
      var gatewayType = this.get('gatewayType'), 
          responderType = this.get('type');

      if (!gatewayType) {
        throw new Error("Attempted to call responder adapter without gateway type")

      } else if (!responderType) { 
        throw new Error("Attempted to call responder adapter without responder type")

      } else {
        return app.get('adapters')(gatewayType, responderType);
      }
    },

    availableTypes: function() {
      var gatewayType = this.get('gatewayType');
      if (!gatewayType) {
        throw new Error("Attempted to call responder adapter without gateway type")
      } else {
        return app.get('adapters')(gatewayType, null);
      }
    },

    commands: function() {
      var gateway = this.related('gateway');
      return this.adapter().commands(gateway, this.get('address'));
    },

    message: function(code) {
      return this.adapter().message(code, this.get('address'));
    },

    send: function(code) {
      return this.related('gateway').send(this.message(code));
    }

  },{
    related: ['gateway'],
    nested: []
  });

  return db.model('Responder', Responder);
}
