var React = require('react');
var Reflux = require('reflux');
var GatewayActions = require('../actions/GatewayActions'); 
// var FormText = require('../components/FormText');
var Input = require('react-bootstrap/Input');
var GatewayTypeInput = require('../components/GatewayTypeInput');

var Gateway = React.createClass({

  getInitialState: function() {
    return { editing: false, type: this.props.type || null };
  },

  toggleEditing: function(event) {
    this.setState({ 
      editing: ((this.state.editing) ? false : true)
    });
  },

  handleSubmit: function(event) {
    event.preventDefault();

    var gateway = {
      id:       this.props.id,
      type:     this.refs['type'].getValue(),
      name:     this.refs['name'].getValue(),
      host:     this.refs['host'].getValue(),
      port:     this.refs['port'].getValue(),
      username: this.refs['username'].getValue(),
      password: this.refs['password'].getValue(),
      active:   this.props.active
    };

    return GatewayActions.updateGateway(gateway);
  },

  render: function() {

    var className = (this.state.editing) ? 'gateway editing' : 'gateway';
    var {name, host, port, username, password, type, types} = this.props;

    return (
      <li className={className}>
        <h3 onTouchEnd={this.toggleEditing} onClick={this.toggleEditing}>{name}</h3>
        <p>{host}:{port}</p>

        <form className="form-horizontal container" onSubmit={this.handleSubmit}>
          <Input type="text" ref="name" label="Name" defaultValue={name} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
          <Input type="text" ref="host" label="Host" defaultValue={host} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
          <Input type="text" ref="port" label="Port" defaultValue={port} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
          <Input type="text" ref="username" label="Username" defaultValue={username} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
          <Input type="text" ref="password" label="Password" defaultValue={password} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
          <GatewayTypeInput ref="type" label="Type" value={type} options={types} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
          <Input type="submit" value="Update" wrapperClassName="col-sm-offset-2 col-sm-10" />
        </form>
      </li>
    );
  }
});

module.exports = Gateway;
