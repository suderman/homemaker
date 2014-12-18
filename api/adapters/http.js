// Adapter Gateway
var gateway = require('./adapter').addGateway('HTTP', {
  protocol: 'http',
  port:     '80',
  path:     '/'
}); 

// Adapter Responder
gateway.addResponder('Server', {

  message: function(command, address) {
    return "/" + command;
  }
});

// Export adapter
module.exports = gateway;
