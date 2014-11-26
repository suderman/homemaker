module.exports = function(app) {
  var db = app.get('db');

  var _ = require('underscore');
  var Promise = require('bluebird');
  var _connections = [];

  var Gateway = db.model('Model').extend({
    tableName: 'gateway',

    initialize: function() {
      
      this.on('connect', function(text){
        console.log(text);
      });

      this.on('response', function(text){
        console.log(this.adapter().response(text));
      });

    },

    // Default values from adapter if unset
    parse: function(res) {
      var adapter = (res.type) ? app.get('adapters')(res.type) : false;
      if (adapter) {
        res.name = res.name || adapter.name;
        res.port = res.port || adapter.port;
      }
      return res;
    },

    virtuals: {

      protocol: function() {
        return this.adapter().protocol;
      },

      auth: function() {
        if ((this.get('username')) && (this.get('password'))) {
          return this.get('username') + ':' + this.get('password');
        } else {
          return undefined;
        } 
      },

      address: function() {
        var address = this.get('host');
        if (this.get('port')) { address += (':' + this.get('port')); } 
        return address;
      },

      url: function() {
        var auth = (this.get('auth')) ? this.get('auth') + '@' : '';
        return this.get('protocol') + '://' + auth + this.get('address');
      },

      title: function() {
        var type = this.get('protocol').toUpperCase() + ' Gateway ';
        return "[" + type + this.get('address') + "] " + this.get('name');
      }
    },

    responders: function() {
      return this.hasMany('Responder');
    },

    adapter: function() {
      if (this.get('type')) {
        return app.get('adapters')(this.get('type'));
      } else {
        return undefined;
      }
    },

    connection: function() {
      var id = this.get('id');

      if (!Gateway.connections(id)) {
        var Connection = app.get('protocols')(this.adapter().protocol);
        Gateway.connections(id, new Connection(this));
      } 

      return Gateway.connections(id);
    },

    connect: function() {
      return this.connection().connect();
    },

    send: function(message) {
      if (!this.connection().connected) {
        var errorMessage = "Cannot send command to disconnected gateway " + this.get('name');
        return Promise.reject(new Error(errorMessage));
      } 

      return this.connection().send(message);
    },

    responderTypes: function() {
      return this.adapter().responderTypes(this);
    },

    // returns a promise
    responderAddresses: function(){
      return this.adapter().responderAddresses(this);
    }

  },{
    related: [],
    nested: ['responders'],
    findAttributes: { active: true },

    connections: function(key, value) {
      if (!key) { return false; } 
      if (value) { return _connections[key] = value; } 
      if (_connections[key]) { return _connections[key]; }
      return false;
    },

    availableTypes: function() {
      return app.get('adapters')();
    }

  });

  return db.model('Gateway', Gateway);
}
