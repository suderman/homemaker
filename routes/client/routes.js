// Let's use Director's router
var router = require('./router');

// React components
var React = require('react');
var { GatewayList, DeviceList, Page } = require('../../components');

router.on('/homemaker/gateways', function () {
  var params = { 
    pathname: '/homemaker/gateways', 
    title: 'Gateways & Responders' 
  };
  router.render(<GatewayList/>, params);
});

router.on('/homemaker/gateways/:id', function (id) {
  var params = { 
    pathname: '/homemaker/gateways/' + id, 
    title: 'Gateways & Responders',
    id: id
  };
  router.render(<GatewayList params={params}/>, params);
});

router.on('/homemaker/devices', function () {
  var params = { 
    pathname: '/homemaker/devices',
    title: 'Devices & Commands'
  };
  router.render(<DeviceList/>, params);
});

router.on('/homemaker/nodes', function () {
  var params = { 
    pathname: '/homemaker/nodes',
    title: 'Nodes & Actions'
  };
  router.render(<Page/>, params);
});

module.exports = router;
