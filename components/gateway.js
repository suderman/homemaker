var React = require('react');

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
  render: function() {

    console.log(this.props.collection);
    var collection = this.props.collection.map(function(model) {
      var props = { key:  model.name,
                    name: model.name, 
                    host: model.host, 
                    port: model.port };
      // var props = { key:  model.get('name'),
      //               name: model.get('name'), 
      //               host: model.get('host'), 
      //               port: model.get('port') };
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
