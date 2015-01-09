var _ = require('lodash/dist/lodash.underscore');
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
gateway.addResponder('Insteon Scene', {

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

  commands: function(gateway) {
    return Promise.resolve({
      'ISY-994i Insteon': [
        { name:     'Off',
          command:  'DOF', 
          feedback: '0' 
        },
        { name:     'On',
          command:  'DON', 
          feedback: '255' 
        },
        { name:     'Fast On',
          command:  'DFOF', 
          feedback: '255' 
        },
        { name:     'Fast Off', 
          command:  'DFOF', 
          feedback: '0' 
        },
        { name:     'Brighten', 
          command:  'BRT', 
          feedback:  '+7'
        },
        { name:     'Dim', 
          command:  'DIM', 
          feedback:  '-8'
        },
        { name:     'Begin Manual Dimming', 
          command:  'BMAN', 
          feedback: null 
        },
        { name:     'Stop Manual Dimming', 
          command:  'SMAN', 
          feedback: null
        },
        { name:     '1%', 
          command:  'DON/3', 
          feedback: '3' 
        },
        { name:     '10%', 
          command:  'DON/25', 
          feedback: '25' 
        },
        { name:     '50%', 
          command:  'DON/50', 
          feedback: '128' 
        },
        { name:     '75%', 
          command:  'DON/192', 
          feedback: '192' 
        },
        { name:     '100%', 
          command:  'DON/255', 
          feedback: '255' 
        }
      ]
    });
  },

  message: function(command, address) {
    return "/rest/nodes/" + address.replace(/\./g, '%20') + "/cmd/" + command;
  }
});

// Adapter Responder
gateway.addResponder('Insteon Device', {

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

  commands: function(gateway) {
    return Promise.resolve({
      'ISY-994i Insteon': [
        { name:     'Off',
          command:  'DOF', 
          feedback: '0' 
        },
        { name:     'On',
          command:  'DON', 
          feedback: '255' 
        },
        { name:     'Fast On',
          command:  'DFOF', 
          feedback: '255' 
        },
        { name:     'Fast Off', 
          command:  'DFOF', 
          feedback: '0' 
        },
        { name:     'Brighten', 
          command:  'BRT', 
          feedback:  '+7'
        },
        { name:     'Dim', 
          command:  'DIM', 
          feedback:  '-8'
        },
        { name:     'Begin Manual Dimming', 
          command:  'BMAN', 
          feedback: null 
        },
        { name:     'Stop Manual Dimming', 
          command:  'SMAN', 
          feedback: null
        },
        { name:     '1%', 
          command:  'DON/3', 
          feedback: '3' 
        },
        { name:     '10%', 
          command:  'DON/25', 
          feedback: '25' 
        },
        { name:     '50%', 
          command:  'DON/50', 
          feedback: '128' 
        },
        { name:     '75%', 
          command:  'DON/192', 
          feedback: '192' 
        },
        { name:     '100%', 
          command:  'DON/255', 
          feedback: '255' 
        }
      ]
    });
  },

  message: function(command, address) {
    return "/rest/nodes/" + address.replace(/\./g, '%20') + "/cmd/" + command;
  }
});

// Adapter Responder
gateway.addResponder('Program', {

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
      'ISY-994i Program': [
        { name:     'Run', 
          command:  'run', 
          feedback: null 
        },
        { name:     'Run Then', 
          command:  'runThen', 
          feedback: null 
        },
        { name:     'Run Else', 
          command:  'runElse', 
          feedback: null 
        },
        { name:     'Stop', 
          command:  'stop', 
          feedback: null 
        },
        { name:     'Enable', 
          command:  'enable', 
          feedback: null 
        },
        { name:     'Enable Run at Startup', 
          command:  'enableRunAtStartup', 
          feedback: null 
        },
        { name:     'Disable Run at Startup', 
          command:  'disableRunAtStartup', 
          feedback: null 
        }
      ]
    });
  },

  message: function(command, address) {
    return "/rest/programs/" + address + "/" + command;
  }
});

// Adapter Responder
gateway.addResponder('Networking', {

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
      return _.map(window.document.querySelectorAll('NetRule'), function (rule) {
        return {
          name:     rule.querySelector('name').innerHTML,
          command:  rule.querySelector('id').innerHTML,
          feedback: null
        }
      }); 

    }).then(function(commands) {
      var group = {};
      return group[gateway.get('name') + ' Networking/' + address] = commands, group;

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
