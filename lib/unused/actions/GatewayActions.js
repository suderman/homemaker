var Reflux = require('reflux');

var GatewayActions = Reflux.createActions([
  'getState',
  'getGateways',
  'updateGateway',     // called by Gateway form submit
  'fireball'
]);

module.exports = GatewayActions;
