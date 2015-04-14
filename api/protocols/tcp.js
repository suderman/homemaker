var _ = require('underscore');
var Promise = require('bluebird');

// Connection Constructor
var Connection = function(gateway) {

  this.client = new require('net').Socket() // tcp
  this.connected = false;
  this.intervalID = false;
  this.interval = _.random(50000, 70000); // somewhere between 50-70 seconds
  this.title = gateway.get('title');
  this.gateway = gateway;
  this.keepalive = true;

  this.options = {
    host: gateway.get('host'),
    port: gateway.get('port')
  }

  this.client.on('connect', function(error) {
    gateway.trigger('connect', gateway.get('title') + " connected");
    this.connected = true;
  }.bind(this));

  this.client.on('error', function(error) {
    console.log(gateway.get('title') + " cannot connect");
    this.client.destroy();
  }.bind(this));

  this.client.on('close', this.close.bind(this));
} 

Connection.prototype.close = function() {
  console.log(this.gateway.get('title') + " is not connected");
  this.client.destroy();
  this.connected = false;

  if (this.keepalive) {
    console.log(this.gateway.get('title') + ' will attempt this connection in ' + Math.round(this.interval/1000) + ' seconds');
    this.intervalID = setTimeout(this.connect.bind(this), this.interval);
  }
}

Connection.prototype.connect = function() {
  if (this.connected) {
    console.log(this.gateway.get('title') + ' is already connected');
    return false;
  } else {
    this.keepalive = true;
    return this.client.connect(this.options.port, this.options.host);
  }
}

Connection.prototype.disconnect = function() {
  this.keepalive = false;
  if (this.connected) this.close();

  if (this.intervalID) {
    console.log(this.gateway.get('title') + ' is now disconnected');
    clearTimeout(this.intervalID);
    this.intervalID = false;
    return true;

  } else {
    console.log(this.gateway.get('title') + ' was already disconnected');
    return false;
  }
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
