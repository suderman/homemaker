var _ = require('lodash/dist/lodash.underscore');
var Promise = require('bluebird');

// GatewayTypes have many ResponderTypes
var GatewayType = function(name, options) {
  this.protocol = undefined;
  this.port = undefined;
  this.host = 'localhost'
  this.path = '/';

  _(this).extend(options);
  this.name = name;
  this.responders = {};

  return this;
}

// The one exposed method
exports.addGateway = function(name, options) {
  return new GatewayType(name, options);
}

// Return array of responder names
GatewayType.prototype.responderTypes = function() {
  return _(this.responders).keys(); 
}

// Return promise of all responder addresses
GatewayType.prototype.responderAddresses = function(gateway) {
  var responderAddressesPromises = {};

  _(this.responders).each(function(responder, key) {
    responderAddressesPromises[key] = responder.addresses(gateway);
  });

  return Promise.props(responderAddressesPromises);
}

// Return response stub
GatewayType.prototype.response = function(response) {
  return response;
}



// ResponderTypes belong to GatewayTypes
var ResponderType = function(name, options) {
  _(this).extend(options);
  this.name = name;
  return this;
}

// Adding new ResponderTypes must be done on a GatewayType
GatewayType.prototype.addResponder = function(name, options) {
  this.responders[name] = new ResponderType(name, options);
}

// Responder addresses lookup stub
ResponderType.prototype.addresses = function(gateway) {
  return Promise.resolve({
    'default': 'default'
  });
}

// Responder commands lookup stub
ResponderType.prototype.commands = function(gateway) {
  return Promise.resolve({});
}

// Reponder status lookup stub
ResponderType.prototype.status = function(gateway) {
  return Promise.resolve({});
}

// Stub for how to format a message sent to a responder
ResponderType.prototype.message = function(command, address) {
  return [address, command].join();
}

ResponderType.prototype.parseStatus = function(nodeStatus='') {
  var number = parseFloat(nodeStatus);
  if (_.isNaN(number)) {
    return nodeStatus;
  } else {
    return number;
  }
}

ResponderType.prototype.getStatus = function(feedback, nodeStatus) {

  var prevStatus = this.parseStatus(nodeStatus);
  if (_.isString(prevStatus)) return feedback;

  // Add value
  if (/^\+/.test(feedback)) {
    return prevStatus + parseFloat(feedback.split('+')[1]);
  
  // Subtract value
  } else if (/^\-/.test(feedback)) {
    return prevStatus - parseFloat(feedback.split('-')[1]);
  
  // Set value
  } else {
    return this.parseStatus(feedback);
  }

}

// Stub for how to parse feedback sent from a responder
ResponderType.prototype.feedback = function(feedback, actionFeedback, nodeStatus) {

  return Promise.resolve({
    success: true,
    status: this.getStatus(actionFeedback, nodeStatus) || feedback,
    prevStatus: this.parseStatus(nodeStatus),
    feedback: feedback
  });
}


