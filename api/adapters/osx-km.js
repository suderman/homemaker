var _ = require('lodash/dist/lodash.underscore');
var Promise = require('bluebird');
var jsdom = Promise.promisify(require('jsdom').env);

// Adapter Gateway
var gateway = require('./adapter').addGateway('OS X Keyboard Maestro', {
  protocol: 'https',
  port:     '4491',
  path:     '/'
}); 

// Adapter Responder
gateway.addResponder('Server', {

  commands: function(gateway) {
    var message = "/authenticated.html";

    return gateway.send(message).then(function(res) {
      return jsdom(res.body);

    }).then(function(window) {
      var commandGroups = {};
      _(window.document.querySelectorAll('optgroup')).each(function (optgroup) {
        var key = gateway.get('name') + ' ' + optgroup.getAttribute('label');
        commandGroups[key] = _.map(optgroup.querySelectorAll('option'), function (option) {
          return {
            name:     option.getAttribute('label'),
            command:  option.getAttribute('value'),
            feedback: null
          }
        });
      }); 
      return commandGroups;

    }).catch(function(error) {
      return {};
    });
  },

  message: function(command, address) {
    return "/authenticatedaction.html?macro=" + command;
  }
});


// Export adapter
module.exports = gateway;
