var Reflux = require('reflux');

var DeviceActions = Reflux.createActions([
  'getState',
  'setState',
  'getDevices',
  'updateDevice'
]);

module.exports = DeviceActions;
