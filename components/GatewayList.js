var React = require('react');
var GatewayStore = require('../stores/GatewayStore');
var GatewayActions = require('../actions/GatewayActions');
var Gateway = require('../components/Gateway');

var GatewayList = React.createClass({
  mixins: [GatewayStore.mixin],

  getInitialState: function() {
    return{ collection: this.props.initialData || global.initialData || [] };
  },

  // Called on componentDidMount & componentWillUnmount
  onChange: function() {
    console.log('onchange');
    return true
  },

  componentDidMount: function() {
    return GatewayStore.getGateways().then(function(collection) {
      this.setState({collection: collection});
    }.bind(this));
  },


  tickleRobot: function() {
    console.log(GatewayActions);
    return GatewayActions.tickleRobot(true);
  },

  // componentDidMount: function() {
  //   // require('superagent').get(this.props.url).end(function(res) {
  //   //   this.setState({ collection: res.body });
  //   // }.bind(this));
  // },

  render: function() {

    var list = this.state.collection.map( function(model) {
      return (<Gateway key={model.id} name={model.name} host={model.host} port={model.port} />);
    });

    return (
      <div className="gateway-list">
        <h2 onClick={this.tickleRobot}>Gateways</h2>
        <ol>{list}</ol>
      </div>
    );
  }
});

module.exports = GatewayList;
