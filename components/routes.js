var _ = require('underscore');
var React = require('react');
var Route = require('react-router').Route;
var App = require('../components/App');

var GatewayList = require('../components/GatewayList');
var Destination = React.createClass({ 
  render: function() { 
    return <div>Destination</div>; 
  } 
});

var handle = function (Component) {
  return React.createClass({
    render: function() {
      return React.createElement(Component, this.props);
    }
  });
};

module.exports = (
  <Route name="homemaker" path="/homemaker" handler={handle(App)}>
    <Route name="home" path="home" handler={handle(Destination)} />
    <Route name="nodes" path="nodes" handler={handle(Destination)} />
    <Route name="node" path="node/:id" handler={handle(Destination)} />
    <Route name="gateways" path="gateways" handler={handle(GatewayList)} />
    <Route name="gateway" path="gateway/:id" handler={handle(Destination)} />
    <Route name="devices" path="devices" handler={handle(Destination)} />
    <Route name="device" path="device/:id" handler={handle(Destination)} />
  </Route>
);
