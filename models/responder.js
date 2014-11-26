module.exports = function(app) {
  var db = app.get('db');
  var _statuses = [];

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
        return (type) ? type : undefined;
        // console.log("Responder " + this.get('id') + " hasn't loaded Gateway " + this.get('gateway_id'));
        // throw new Error("Responder hasn't loaded Gateway");
      },

      identity: function() {
        return [
          this.get('gateway_id'), 
          this.get('type').toLowerCase().replace(/ /g, '-'),
          this.get('address')
        ].join('.');
      },

      status: {
        get: function() {
          var status = Responder.statuses(this.get('identity'));
          return ((status === 'valid') || (status === 'invalid')) ? status : 'unknown';
        },
        set: function(value) {
          var status = ((value === 'valid') || (value === 'invalid')) ? value : 'unknown';
          Responder.statuses(this.get('identity'), status);
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
    nested: [],

    statuses: function(key, value) {
      if (!key) { return false; } 
      if (value) { return _statuses[key] = value; } 
      if (_statuses[key]) { return _statuses[key]; }
      return false;
    },

    // returns a promise
    findValid: function(gateway){
      var Responder = this,
          gatewayId = gateway.get('id')

      return gateway.responderAddresses().then(function(responderTypes) {

        var responders = [];
        _(responderTypes).each(function(responderAddresses, responderType) {
          _(responderAddresses).each(function(responderName, responderAddress) {

            responders.push(new Responder({
              id: null,
              gateway_id: gatewayId,
              name: responderName,
              address: responderAddress,
              type: responderType
            }));

          });
        });
        return responders;

      });
    },

    // returns a promise
    combine: function(validCollection, savedCollection) {
      var collection = this.collection();

      _(validCollection).each(function(valid) {

        var matched = savedCollection.findWhere({ 
          identity: valid.get('identity') 
        }) || valid;
        savedCollection.remove(matched);

        matched.set('status', 'valid');
        collection.add(matched);
      });

      savedCollection.each(function(saved) {
        saved.set('status', 'invalid');
        collection.add(saved);
      });

      return Promise.resolve(collection);
    }

  });

  return db.model('Responder', Responder);
}
