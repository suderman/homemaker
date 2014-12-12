var React = require('react');
var { Navbar, Nav, NavItem } = require('react-bootstrap');

var Layout = React.createClass({

  componentDidMount: function() {
    // var title = this.props.params.title || 'Untitled'
    // document.head.getElementsByTagName('title').forEach(function(title) {
    //   title.innerHTML = title;
    // });
  },

  render: function() {

    function navigate (selectedKey, href) {
      if (global.router) {
        global.router.go(href);
      }
    }

    var { body, params } = this.props;

    return (
      <div id="app">

        <Navbar>
          <Nav activeKey={params.pathname} onSelect={navigate}>
            <NavItem eventKey="/" href="/" disabled={true}>API</NavItem>
            <NavItem eventKey="/homemaker/nodes" href="/homemaker/nodes">Nodes & Actions</NavItem>
            <NavItem eventKey="/homemaker/gateways" href="/homemaker/gateways">Gateways & Responders</NavItem>
            <NavItem eventKey="/homemaker/devices" href="/homemaker/devices">Devices & Commands</NavItem>
          </Nav>
        </Navbar>

        { /*<h1>{params.title}</h1> */ }
        <div id="main">
          {body}
        </div>
      </div>
    );
  }
});

module.exports = Layout;
