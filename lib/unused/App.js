var _ = require('underscore');
var React = require('react');

var ReactBootstrap = require('react-bootstrap')
  , Navbar = ReactBootstrap.Navbar
  , Nav = ReactBootstrap.Nav;

var ReactRouterBootstrap = require('react-router-bootstrap')
  , NavItemLink = ReactRouterBootstrap.NavItemLink
  , ButtonLink = ReactRouterBootstrap.ButtonLink;

var RouteHandler = require('react-router').RouteHandler;

var App = React.createClass({
  render: function() {

    // clone the props/global state
    var props = {}, state = {};
    if (this.props.state) {
      props.state = _(state).extend(this.props.state);
    } else if (global.state) {
      props.state = _(state).extend(global.state);
      delete global.state; // don't use this again
    }

    return (
      <div id="app">

        <Navbar>
          <Nav>
            <NavItemLink to="home">API</NavItemLink>
            <NavItemLink to="nodes">Nodes & Actions</NavItemLink>
            <NavItemLink to="gateways">Gateways & Responders</NavItemLink>
            <NavItemLink to="devices" >Devices & Commands</NavItemLink>
          </Nav>
        </Navbar>

        <div id="main">
          <RouteHandler {...props} />
        </div>
      </div>
    );
  }
});

module.exports = App;
