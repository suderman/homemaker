var _ = require('underscore');
var Promise = require('bluebird');

// Connection Constructor
var Connection = function(gateway) {

  this.client = require('request-promise') // http or https
  this.connected = false;
  this.error = false;
  this.title = gateway.get('title');
  this.gateway = gateway;

  this.options = {
    headers: { Connection: 'Keep-Alive', Accept: '*/*' },
    strictSSL: false,
    simple: true,
    resolveWithFullResponse: true,
    url: gateway.get('url'),
    path: gateway.adapter().path
  }
} 

Connection.prototype.connect = function() {
  console.log('Connection connect setInterval for ' + this.title)
  var interval = _.random(50000, 70000); // somewhere between 50-70 seconds
  setInterval(this.heartbeat.bind(this), interval);  
  return this.heartbeat(); // Begin
}

Connection.prototype.send = function(message) {
  return this.get(message); // return promise
}

// Send a payload within the context of a gateway
Connection.prototype.get = function(payload) {
  
  var options = _.clone(this.options);
  options.url += (payload) ? payload : this.gateway.adapter().path;

  var promise = this.client.get(options);

  return promise.then(function(response) { 
    if ((response.statusCode < 200) || (response.statusCode >= 500)) {
      throw new Error('Status Code ' + response.statusCode);
    } else {
      return response;
    }
  }).catch(function(err) { 
    throw new Error(err.error.code); 
  });
}

// Connect to trigger keep-alive
Connection.prototype.heartbeat = function() {
  console.log('*heartbeat* ' + this.title);
  var connection = this;
  var promise = this.get();

  return promise.then(function(response) {
    var message = connection.title + ' connected (Status Code ' + response.statusCode + ')';
    connection.connected || connection.gateway.trigger('connect', message);
    connection.connected = true;
    connection.error = false;

  }).catch(function(err) {
    var message = connection.title + " cannot connect: " + err;
    connection.error || connection.gateway.trigger('error', message);
    connection.error = true;
    connection.connected = false;
  });
}

module.exports = Connection;
