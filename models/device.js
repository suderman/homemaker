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

    // findAllAdapterOld: function() {
    //   var adapters = _(db.model('Responder').types()).map(function(name) {
    //     return { id: encodeURIComponent(name), name: name };
    //   });
    //   return Device.findAll().then(function(devices) {
    //     return devices.add(adapters);
    //   });
    // },

    findAllAdapter: function() {

      return Promise.props({
        adapter: this.findAllResponder(),
        saved: Device.findAll().get('models')

      }).then(function(devices) {
        devices.adapter = _(_(devices.adapter).keys()).map(function (name) {
          return { id: encodeURIComponent(name), name: name };
        });
        return devices;

      }).then(function(devices) {
        return _(devices.adapter.concat(devices.saved)).sortBy(function(a) { return a.name; });

      });
    },

    findAllResponder: function() {
      return db.model('Responder').findAll().then(function(responders) {
        var promises = responders.map(function(responder) {
          return responder.adapterCommands();
        });
        return Promise.all(promises);

      }).then(function(devices) {
        var set = {};
        _(devices).each(function(device) {
          _(device).each(function(commands, deviceName) {
            set[deviceName] = commands;
          });
        });
        return set;
      })
    },

  });

  return db.model('Device', Device);
}
