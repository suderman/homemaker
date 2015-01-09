var _ = require('lodash/dist/lodash.underscore');
var Promise = require('bluebird');

// Connection Constructor
var Connection = function(gateway) {

  this.client = new require('net').Socket() // tcp
  this.connected = false;
  this.title = gateway.get('title');
  this.gateway = gateway;

  this.options = {
    host: gateway.get('host'),
    port: gateway.get('port')
  }

  this.client.on('connect', function(error) {
    gateway.trigger('connect', gateway.get('title') + " connected");
    this.connected = true;
  }.bind(this));

  // this.client.on('data', function(data) {
  //   gateway.trigger('response', gateway.get('title') + " " + data);
  // });

  this.client.on('error', function(error) {
    console.log(gateway.get('title') + " cannot connect");
    this.client.destroy();
  }.bind(this));

  this.client.on('close', function() {
    console.log(gateway.get('title') + " is not connected");
    this.client.destroy();
    this.connected = false;

    console.log('Connection connect setTimeout for ' + this.title)
    var interval = _.random(50000, 70000); // somewhere between 50-70 seconds
    setTimeout(this.connect.bind(this), interval);
  }.bind(this));
} 

Connection.prototype.connect = function() {
  return this.client.connect(this.options.port, this.options.host);
}

Connection.prototype.send = function(message) {
  return this.write(message); // return promise
}

Connection.prototype.write = function(message) {
  var connection = this;
  var payload = message + "\r\n";

  return new Promise(function(resolve, reject) {
    connection.client.write(payload);
    connection.client.on('data', resolve);
  });
}

module.exports = Connection;
