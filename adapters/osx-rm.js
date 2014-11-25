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
gateway.addResponder('OS X Remote Mapper Server', {

  addresses: function(gateway) {
    return Promise.resolve({
      'default': 'OS X Remote Mapper Server' 
    });
  },

  message: function(command, address) {
    return command;
  }
});

// Export adapter
module.exports = gateway;
