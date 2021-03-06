var React = require('react');
var { Navbar, Nav, NavItem } = require('react-bootstrap');

var Navigation = React.createClass({
  mixins: [require('app/components/mixins/go')],

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
    var fullRoute = (global.browser) ? browser.router.path() : this.props.route;

    // Get only the first part of the route so it matches the top navigation
    for (var route='', parts=fullRoute.split('/'), i=0; i<3; i++) {
      if (parts[i]) {
        route += '/' + parts[i];
      }
    }

    return (
      <Navbar className="nnavbar-fixed-top">
        <Nav activeKey={route} onSelect={this.go}>
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
