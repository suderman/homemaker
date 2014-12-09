var React = require('react');
var Reflux = require('reflux');

var GatewayActions = require('../actions/GatewayActions'); 
var GatewayStore = require('../stores/GatewayStore'); 
var Gateway = require('../components/Gateway');

var GatewayList = React.createClass({
  // mixins: [Reflux.ListenerMixin],
  mixins: [Reflux.connect(GatewayStore, 'list')],

  getInitialState: function() {
    return{ list: this.props.initialData || global.initialData || [] };
  },
  
  // onListChange: function(list) {
  //   this.setState({ list: list });
  // },

  componentDidMount: function() {
    // this.listenTo(GatewayStore, this.onListChange);
    return GatewayActions.getGateways();
  },
  
  fireball: function() {
    return GatewayActions.fireball('Santa');
  },

  render: function() {

    var list = this.state.list.map( function(model) {
      return (<Gateway key={model.id} id={model.id} type={model.type} active={model.active} name={model.name} host={model.host} port={model.port} />);
    });

    return (
      <div className="gateway-list">
        <h2 onClick={this.fireball}>Gateways</h2>
        <ol>{list}</ol>
      </div>
    );
  }
});

module.exports = GatewayList;
