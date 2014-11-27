module.exports = function(app) {
  var db = app.get('db');
  var _statuses = [];

  var _ = require('underscore');
  var Promise = require('bluebird');

  var Responder = db.model('Model').extend({
    tableName: 'responder',

    gateway: function() {
      return this.belongsTo('Gateway');
    },

    // Don't save this attribute--it's only temporarily used by valid unsaved responders
    hidden: ['gatewayName'],
    format: function(attributes) {
      return _(attributes).omit('gatewayName');
    },

    virtuals: {
      title: function() {
        return [
          this.get('gatewayName') || this.related('gateway').get('name'), ' ',
          this.get('type'),
          this.get('name') != 'default' ? ': ' + this.get('name') : ''
        ].join('');
      },

      gatewayType: function() {
        var type = this.related('gateway').get('type');
        return (type) ? type : undefined;
      },

      identity: function() {
        return [
          this.get('gateway_id'), 
          String(this.get('type')).toLowerCase().replace(/ /g, '-'),
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

    // Return a promise resolving to all possible responders for a given gateway
    findAllValid: function(gateway){
      var Responder = this,
          gatewayId = gateway.get('id'),
          gatewayName = gateway.get('name');

      return gateway.addresses().then(function(responderTypes) {
        var responders = [];

        _(responderTypes).each(function(responderAddresses, responderType) {
          _(responderAddresses).each(function(responderName, responderAddress) {

            responders.push(new Responder({
              id:           null,
              gateway_id:   gatewayId,
              gatewayName:  gatewayName,
              type:         responderType,
              address:      responderAddress,
              name:         responderName
            }));

          });
        });

        return responders;
      });
    },

    // Return a promise, accepts two passed arguments:
    //  - The first is an array of valid/potentially-unsaved responders for a particular gateway
    //  - The second is a fetched collection of responders for the same gateway
    //  Promise resolves to a combined collection, without duplicates, each model flagged as valid or invalid
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
