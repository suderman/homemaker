var router = require('../../../lib/router/client');

// React components
var React = require('react');
var { GatewayList, Gateway, DeviceList, Page } = require('../../components');

router.on('/homemaker/gateways', function () {
  router.render(<GatewayList/>);
});

router.on('/homemaker/gateways/:id', function (id) {
  router.render(<Gateway id={id}/>);
});

router.on('/homemaker/devices', function () {
  router.render(<DeviceList/>);
});

router.on('/homemaker/nodes', function () {
  router.render(<Page/>);
});

module.exports = router;
