var _ = require('underscore');
var Promise = require('bluebird');
var jsdom = Promise.promisify(require('jsdom').env);

// Adapter Gateway
var gateway = require('./adapter').addGateway('ISY-994i', {
  protocol: 'http',
  port:     '80',
  path:     '/rest/sys',

  response: function(response) {
    return "This: " + response;
  }

}); 

// Adapter Responder
gateway.addResponder('ISY-994i Insteon Scene', {

  status_lookup: '/rest/status/ADDRESS',

  addresses: function(gateway) {
    var message = "/rest/nodes";

    return gateway.send(message).then(function(res) {
      return jsdom(res.body)

    }).then(function(window) {
      return _.object(_.map(window.document.querySelectorAll('group'), function (group) {
        return [group.querySelector('address').innerHTML, group.querySelector('name').innerHTML]
      })); 

    }).catch(function(error) {
      return {};
    });
  },

  message: function(command, address) {
    return "/rest/nodes/" + address.replace(/\./g, '%20') + "/cmd/" + command;
  }
});

// Adapter Responder
gateway.addResponder('ISY-994i Insteon Device', {

  status_lookup: '/rest/status/ADDRESS',

  addresses: function(gateway) {
    var message = "/rest/nodes";

    return gateway.send(message).then(function(res) {
      return jsdom(res.body)

    }).then(function(window) {
      return _.object(_.map(window.document.querySelectorAll('node'), function (node) {
        return [node.querySelector('address').innerHTML.replace(/ /g, '.'), node.querySelector('name').innerHTML]
      })); 

    }).catch(function(error) {
      return {};
    });
  },

  message: function(command, address) {
    return "/rest/nodes/" + address.replace(/\./g, '%20') + "/cmd/" + command;
  }
});

// Adapter Responder
gateway.addResponder('ISY-994i Program', {

  status_lookup: '/rest/programs/ADDRESS',

  addresses: function(gateway) {
    var message = "/rest/programs";

    return gateway.send(message).then(function(res) {
      return jsdom(res.body)

    }).then(function(window) {
      return _.object(_.map(window.document.querySelectorAll('program'), function (program) {
        return [program.getAttribute('id'), program.querySelector('name').innerHTML]
      })); 

    }).catch(function(error) {
      return {};
    });
  },

  commands: function(gateway) {
    return Promise.resolve({
      'run': 'Run', 
      'runThen': 'Run Then', 
      'runElse': 'Run Else', 
      'stop': 'Stop', 
      'enable': 'Enable', 
      'enableRunAtStartup': 'Enable Run at Startup', 
      'disableRunAtStartup': 'Disable Run at Startup'
    });
  },

  message: function(command, address) {
    return "/rest/programs/" + address + "/" + command;
  }
});

// Adapter Responder
gateway.addResponder('ISY-994i Networking', {

  addresses: function(gateway) {
    return Promise.resolve({
      'wol': 'Wake-on-LAN', 
      'resources': 'Network Resource' 
    });
  },

  commands: function(gateway, address) {
    var message = "/rest/networking/" + address;

    return gateway.send(message).then(function(res) {
      return jsdom(res.body)

    }).then(function(window) {
      return _.object(_.map(window.document.querySelectorAll('NetRule'), function (netrule) {
        return [netrule.querySelector('id').innerHTML, netrule.querySelector('name').innerHTML]
      })); 

    }).catch(function(error) {
      return {};
    });
  },

  message: function(command, address) {
    return "/rest/networking/" + address + "/" + command;
  }
});

// Export adapter
module.exports = gateway;
