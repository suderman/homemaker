var React = require('react');
var Reflux = require('reflux');
var GatewayActions = require('../actions/GatewayActions'); 
var FormText = require('../components/FormText');

var Gateway = React.createClass({

  getInitialState: function() {
    return { editing: false };
  },

  handleChange: function(event) {
    console.log(event.target);
    // var props = {};
    // props['name'] = event.target.value;
    // this.setProps(props);
  },

  handleSubmit: function(event) {
    event.preventDefault();

    var gateway = {
      id:     this.props.id,
      type:   this.props.type,
      active: this.props.active,
      name:   this.refs.name.refs.input.getDOMNode().value.trim(),
      host:   this.refs.host.refs.input.getDOMNode().value.trim(),
      port:   this.refs.port.refs.input.getDOMNode().value.trim()
    };

    console.log(gateway)
    return GatewayActions.updateGateway(gateway);
    // return GatewayActions.updateGateway(this.props);
  },

  render: function() {

    var className = (this.state.editing) ? 'gateway editing' : 'gateway';
    var {name, host, port} = this.props;

    return (
      <li className={className}>
        <h3>{name}</h3>
        <p>{host}:{port}</p>
        <form className="gatewayForm" onSubmit={this.handleSubmit}>
          <FormText ref="name" label="Name" defaultValue={name} />
          <FormText ref="host" label="Host" defaultValue={host} />
          <FormText ref="port" label="Port" defaultValue={port} />
          <input type="submit" value="Update"/>
        </form>
      </li>
    );
  }
});

module.exports = Gateway;
