var _ = require('underscore');
var Promise = require('bluebird');
var jsdom = Promise.promisify(require('jsdom').env);

// Adapter Gateway
var gateway = require('./adapter').addGateway('OS X Keyboard Maestro', {
  protocol: 'https',
  port:     '4491',
  path:     '/'
}); 

// Adapter Responder
gateway.addResponder('OS X Keyboard Maestro Server', {

  commands: function(gateway) {
    var message = "/authenticated.html";
    return gateway.send(message).then(function(res) {
      return jsdom(res.body);
    }).then(function(window) {
      var commands = {};
      [].forEach.call(window.document.querySelectorAll('option'), function(option) {
        commands[option.getAttribute('label')] = option.getAttribute('value');
      });
      return commands;
    }).catch(function(error) {
      return {};
    });
  },

  message: function(command, address) {
    return "/authenticatedaction.html?macro=" + command;
  }
});


// Adapter Responder
gateway.addResponder('Fake Responder', {

  addresses: function(gateway) { 
    return Promise.resolve({}); 
  },

  message: function(command, address) { return "" }
});


// Export adapter
module.exports = gateway;
