var React = require('react');
var { GatewayList, Gateway, DeviceList, Page, Device, Command } = require('app/components');

module.exports = function(router) {

  router.on('/homemaker/gateways', function () {
    router.render(<GatewayList/>);
  });

  router.on('/homemaker/gateways/:id', function (id) {
    router.render(<Gateway id={id}/>);
  });

  router.on('/homemaker/devices/:id/commands/new', function () {
    router.render(<Command/>);
  });

  router.on('/homemaker/devices', function () {
    router.render(<DeviceList/>);
  });

  router.on('/homemaker/devices/new', function () {
    router.render(<Device/>);
  });

  router.on('/homemaker/devices/(.+)', function (id) {
    router.render(<Device id={id}/>);
  });

  router.on('/homemaker/commands/:id', function (id) {
    router.render(<Command id={id}/>);
  });

  router.on('/homemaker/nodes', function () {
    router.render(<Page/>);
  });

  return router;
}
