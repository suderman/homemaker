var _ = require('underscore');
var Promise = require('bluebird');

// Adapter Gateway
var gateway = require('./adapter').addGateway('OS X Remote Mapper', {
  protocol: 'tcp',
  port: '8082',

  response: function(response) {
    return response;
  }
}); 

// Adapter Responder
gateway.addResponder('Server', {

  message: function(command, address) {
    return command;
  }
});

// Export adapter
module.exports = gateway;
