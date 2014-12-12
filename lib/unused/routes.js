var _ = require('underscore');
var React = require('react');
var Route = require('react-router').Route,
    DefaultRoute = require('react-router').DefaultRoute;
var App = require('../components/App');

var Gateway = require('../components/Gateway');
var GatewayList = require('../components/GatewayList');
var GatewayPage = require('../components/GatewayPage');
var Device = require('../components/Device');
var DeviceList = require('../components/DeviceList');
var Page = require('../components/Page');

var handle = function (Component, props) {
  var props = props || {};
  return React.createClass({
    render: function() {
      return React.createElement(Component, _(this.props).extend(props));
    }
  });
};

module.exports = (

  <Route path="/homemaker" handler={handle(App)}>
    <DefaultRoute name="home" handler={handle(Page, {name: 'Home'})}/>

    <Route name="nodes" handler={handle(Page)}>
      <Route name="node" path="nodes/:id" handler={handle(Page)} />
      <DefaultRoute name="nodes-list" handler={handle(Page, {name: 'Nodes'})}/>
    </Route>

    <Route name="gateways" handler={handle(GatewayList)}>
      <Route name="gateway" path="/homemaker/gateways/:id" handler={handle(GatewayPage)} />
      <DefaultRoute name="gateways-list" handler={handle(GatewayList)}/>
    </Route>

    <Route name="devices" handler={handle(DeviceList)}>
      <Route name="device" path="devices/:id"  handler={handle(Device)} />
      <DefaultRoute name="devices-list" handler={handle(DeviceList)}/>
    </Route>

  </Route>
);
