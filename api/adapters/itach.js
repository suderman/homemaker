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
  },

  feedback: function(feedback, actionFeedback='', nodeStatus='') {

    var response = feedback.toString('utf8');
    var success = (/^completeir/.test(response)) ? true : false;

    return Promise.resolve({
      success: success,
      status: this.getStatus(actionFeedback, nodeStatus),
      prevStatus: this.parseStatus(nodeStatus),
      feedback: response
    });
  }

});

// Export adapter
module.exports = gateway;
