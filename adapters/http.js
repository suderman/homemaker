// Adapter Gateway
var gateway = require('./adapter').addGateway('HTTP', {
  protocol: 'http',
  port:     '80',
  path:     '/'
}); 

// Adapter Responder
gateway.addResponder('HTTP Server', {

  addresses: function(gateway) {
    return Promise.resolve({
      'default': 'HTTP Server' 
    });
  },

  message: function(command, address) {
    return "/" + command;
  }
});

// Export adapter
module.exports = gateway;
