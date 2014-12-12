var React = require('react');
var Reflux = require('reflux');

var Router = require('react-router');
var GatewayActions = require('../actions/GatewayActions'); 
var GatewayStore = require('../stores/GatewayStore'); 
var Gateway = require('../components/Gateway');
var Button = require('react-bootstrap/Button');

var GatewayPage = React.createClass({
  mixins: [Reflux.connect(GatewayStore), Router.State],

  getInitialState: function() {
    return this.props.data || { list: [], types: [] };
  },

  componentDidMount: function() {
    if (!this.state.list.length) {
      GatewayActions.getGateway(this.getParams().id);
    }
  },
  
  render: function() {
    var types = this.state.types;
    var list = this.state.list;

    return (
      <div className="gateway-list">
        <h2>Gateway Page</h2>
        <ol>{list.map(function(g) {
          return (<Gateway key={g.id} id={g.id} type={g.type} active={g.active} 
                  name={g.name} host={g.host} port={g.port} username={g.username} 
                  password={g.password} types={types} />);
        })}</ol>

      </div>
    );
  }
});

module.exports = GatewayPage;
