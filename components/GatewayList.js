var React = require('react');
var Reflux = require('reflux');

var GatewayActions = require('../actions/GatewayActions'); 
var GatewayStore = require('../stores/GatewayStore'); 
var Gateway = require('../components/Gateway');
var Button = require('react-bootstrap/Button');

var GatewayList = React.createClass({
  mixins: [Reflux.connect(GatewayStore)],

  getInitialState: function() {
    return this.props.state || { list: [], types: [] };
  },
  
  componentWillMount: function() {
    if (typeof window !== 'undefined') {
      GatewayActions.getState();
    }
  },

  // componentDidMount: function() {
  //   // if (!this.state.list.length) {
  //     // GatewayActions.getGateways();
  //     
  //     GatewayActions.getState();
  //   // }
  // },
  
  fireball: function() {
    return GatewayActions.fireball('Santa');
  },

  render: function() {
    var types = this.state.types;
    var list = this.state.list;

    return (
      <div className="gateway-list">
        <h2>Gateways</h2>
        <ol>{list.map(function(g) {
          return (<Gateway key={g.id} id={g.id} type={g.type} active={g.active} 
                  name={g.name} host={g.host} port={g.port} username={g.username} 
                  password={g.password} types={types} />);
        })}</ol>

        <Button bsStyle="danger" onClick={this.fireball}>Fireball</Button>
      </div>
    );
  }
});

module.exports = GatewayList;
