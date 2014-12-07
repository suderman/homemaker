var React = require('react');
var request = require('superagent');

var Gateway = React.createClass({
  render: function() {
    return (
      <li key={this.props.key} className="gateway">
        <h3>{this.props.name}</h3>
        <p>{this.props.host}:{this.props.port}</p>
      </li>
    );
  }
});

var Gateways = React.createClass({

  getInitialState: function() {
    return { collection: this.props.initialData || global.initialData || [] };
  },

  componentDidMount: function() {
    request.get(this.props.url).end(function(res) {
      this.setState({ collection: res.body });
    }.bind(this));
  },

  render: function() {

    var collection = this.state.collection.map(function(model) {
      var props = { key:  model.id,
                    name: model.name, 
                    host: model.host, 
                    port: model.port };
      return (<Gateway {...props}/>);
    });

    return (
      <div className="gateway-list">
        <h2>Gateways</h2>
        <ol>{collection}</ol>
      </div>
    );
  }
});


exports.Gateway = Gateway;
exports.Gateways = Gateways;
