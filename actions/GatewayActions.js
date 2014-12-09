var Reflux = require('reflux');

var GatewayActions = Reflux.createActions([
  'getGateways',
  'updateGateway',     // called by Gateway form submit
  'fireball'
]);

module.exports = GatewayActions;
