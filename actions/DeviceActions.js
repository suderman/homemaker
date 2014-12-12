var Reflux = require('reflux');

var DeviceActions = Reflux.createActions([
  'getState',
  'getDevices',
  'updateDevice'
]);

module.exports = DeviceActions;
