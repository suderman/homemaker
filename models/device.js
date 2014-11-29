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
      // var p = {
      //   // adapter: this.findAllResponder(),
      //   saved: Device.findAll()
      // };
      //
      // return Promise.prop(p).then(function(devices) {
      //   res.send(devices);
      // });

      return this.findAllResponder();
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
