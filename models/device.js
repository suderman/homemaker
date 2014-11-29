module.exports = function(app) {
  var db = app.get('db');

  var _ = require('underscore');
  var Promise = require('bluebird');

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
    },


    // Find all devices, include those from any adapter
    findAllAdapter: function() {

      // Find devices from adapters and saved in the database
      return Promise.props({
        adapter: this.findAllResponder(),
        saved: Device.findAll().get('models')

      // With all the adapter devices, ignore the commands and create an id/name pair
      // The id is the encoded name, with the responder id at the end
      }).then(function(devices) {
        devices.adapter = _(devices.adapter).map(function(device, name) {
          return { id: encodeURIComponent(name) + '--responder--' + device.responderId, name: name };
        }); 
        return devices;

      // Sort both types of devices by name and return
      }).then(function(devices) {
        return _(devices.adapter.concat(devices.saved)).sortBy(function(a) { return a.name; });

      });
    },

    // Check all responders for unique devices
    findAllResponder: function() {
      return db.model('Responder').findAll().then(function(responders) {

        // Save all the responder ids used
        var responderIds = _(responders.models).pluck('id');

        // Grab all the commands
        return Promise.all(responders.map(function(responder) {
          return responder.adapterCommands()

        // Reorganise these by responder id
        })).then(function(commands) {
          var responders = {};
          _(commands).each(function(command, id) {
            var key = responderIds[id];
            responders[key] = command;
          });
          return responders;
        });

      // Remove any duplicates devices
      }).then(function(responders) {
        var set = {};
        _(responders).each(function(responder, id) {
          _(responder).each(function(commands, deviceName) {
            set[deviceName] = { responderId: id, commands: commands }
          });
        });
        return set;
      })
    },

    fromParams: function(params) {
      var array = decodeURIComponent(params.id).split('--responder--');
      var name = array[0], responderId = parseInt(array[1], 10);
      return { 
        id: params.id,
        name: name,
        responderId: responderId
      };
    }

  });

  return db.model('Device', Device);
}
