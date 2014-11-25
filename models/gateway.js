module.exports = function(app) {
  var db = app.get('db');

  var _ = require('underscore');
  var Promise = require('bluebird');
  var _connections = [];

  var Gateway = db.model('Model').extend({
    tableName: 'gateway',

    initialize: function() {
      
      // Set the protocol constructor
      this.on('fetched', function() {
        var name = this.adapter().protocol;
        this.Connection = name ? app.get('protocols')(name) : undefined;
      });

      this.on('connect', function(text){
        console.log(text);
      });

      this.on('response', function(text){
        // xml2js(text).then(function(json) {
        //   console.log("json: " + JSON.stringify(json));
        // }).catch(function(error) {
        //   console.log("text: " + text);
        // });
        console.log(this.adapter().response(text));
        // console.log("response: " + text);
      });

    },

    virtuals: {

      protocolName: function() {
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
        return this.get('protocolName') + '://' + auth + this.get('address');
      },

      title: function() {
        var type = this.get('protocolName').toUpperCase() + ' Gateway ';
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

    protocol: function() {
      if (this.get('protocolName')) {
        return app.get('protocols')(this.get('protocolName'));
      } else {
        return undefined;
      }
    },

    // connect: function() {
    //
    //   if (!this.connection) {
    //     var Connection = app.get('protocols')(this.adapter().protocol);
    //     this.connection = new Connection(this);
    //   }
    //   // return this.connection.connect();
    //   // console.log(this.connection.connect);
    //   // this.connection.connect().then(function(data) {
    //   //   console.log('GATEWAY: Connected' + data);
    //   // });
    // },

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

    // // send: Promise.method(function(message){
    // send: function(message, cb){
    //   if (!this.connection().client) {
    //     throw new Error("Cannot send command to disconnected gateway " + this.get('name'));
    //   } 
    //
    //   return this.protocol().send.call(this, message, cb);
    //   // return this.protocol().send.call(this, message).then(function(response) {
    //   //   console.log("GATEWAY RESPONSE " + response)
    //   //   return response;
    //   //
    //   // }).catch(function(error) {
    //   //   console.log("send error " + error);
    //   // });
    // },

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
    },

    // responderAddresses: function(cb) {
    //   this.adapter().responderAddresses(this, function(response){
    //     cb(response);
    //   });
    // }

    // availableAddresses: function(responderType) {
    //   return app.get('adapaters')(type);
    // }
    
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
