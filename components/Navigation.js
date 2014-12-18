var React = require('react');
var { Navbar, Nav, NavItem } = require('react-bootstrap');

var Navigation = React.createClass({

  NavItem: function(title, href, disabled) {
    var first = title.substr(0,title.indexOf(' '));
    var last = ' ' + title.substr(title.indexOf(' ')+1);
    if (!first) { first = title; last = ''; }

    return (
      <NavItem title={title} eventKey={href} href={href} disabled={disabled}>
        <span>{first}<span className="hidden-xs">{last}</span></span>
      </NavItem>
    );
  },

  render: function() {

    function navigate (selectedKey, href) {
      global.router.go(href, this.title);
    }

    var route = (global.router) ? global.router.pathname() : this.props.route;

    return (
      <Navbar>
        <Nav activeKey={route} onSelect={navigate}>
          {this.NavItem('API',                    '/', true)}
          {this.NavItem('Nodes & Actions',        '/homemaker/nodes')}
          {this.NavItem('Gateways & Responders',  '/homemaker/gateways')}
          {this.NavItem('Devices & Commands',     '/homemaker/devices')}
        </Nav>
      </Navbar>
    );
  }
});

module.exports = Navigation;
