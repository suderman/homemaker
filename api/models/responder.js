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

      // Gateway Name + ResponderType + Responder Name
      title: function() {
        return [
          this.get('gatewayName') || this.related('gateway').get('name'), 
          // ' - ',
          // this.get('type'),
          this.get('name') != 'default' ? ' - ' + this.get('name') : '',
        ].join('');
      },

      // Adapter's GatewayType
      gatewayType: function() {
        var type = this.related('gateway').get('type');
        return (type) ? type : undefined;
      },

      // Adapter's GatewayType + ResponderType
      responderType: function() {
        return this.get('gatewayType') + ' ' + this.get('type');
      },

      // Gateway ID + ResponderType + Responder Address
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

    adapterCommands: function() {
      var gatewayType = this.get('gatewayType'),
          gateway = this.related('gateway'),
          address = this.get('address');
      return (gatewayType) ? this.adapter().commands(gateway, address) : Promise.resolve({});
    },

    deviceCommands: function() {
      var Device = db.model('Device'),
          Command = db.model('Command');

      return Device.findAllByResponder(this).then(function(collection) {
        var devices = {};
        collection.each(function(device) {
          devices[device.get('name')] = Command.findAllByDevice(device);
        });

        return Promise.props(devices);
      });
    },

    commands: function() {
      var commands = {
        adapter: this.adapterCommands(), 
        device:  this.deviceCommands()
      };

      return Promise.props(commands).then(function(commands) {
        return _(commands.adapter).extend(commands.device);

      }).then(function(devices) {
        return _(devices).omit(function(device) {
          return (device.length < 1);
        });

      }).catch(function(err) {
        console.log(err);
      });
    },

    message: function(command) {
      return this.adapter().message(command, this.get('address'));
    },

    send: function(command) {
      return this.related('gateway').send(this.message(command)).catch(e => console.log(e));
    },

    feedback: function(feedback, actionFeedback, nodeStatus) {
      return this.adapter().feedback(feedback, actionFeedback, nodeStatus);
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

    types: function() {
      var responders = [];
      _(app.get('adapters')()).each(function(gateway) {
        _(app.get('adapters')(gateway, null)).each(function(responder) {
          responders.push([gateway, responder].join(' '));
        }); 
      });
      return responders;
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
        matched.set('name', valid.get('name'));
        collection.add(matched);
      });

      savedCollection.each(function(saved) {
        saved.set('status', 'invalid');
        collection.add(saved);
      });

      return Promise.resolve(collection.sortBy(r => r.get('name').toLowerCase()));
    }

  });

  return db.model('Responder', Responder);
}
