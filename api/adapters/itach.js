var Promise = require('bluebird');

// Adapter Gateway
var gateway = require('./adapter').addGateway('iTach', {
  protocol: 'tcp',
  port: '4998',

  response: function(response) {
    return response;
  }
}); 

// Adapter Responder
gateway.addResponder('Infrared Port', {

  addresses: function(gateway) {
    return Promise.resolve({
      '1': '1:1',
      '2': '1:2',
      '3': '1:3'
    });
  },

  message: function(command, address) {
    return "sendir,1:" + address + "," + command.split('sendir,1:')[1].substr(2);
  }
});

// Export adapter
module.exports = gateway;
