var _ = require('underscore');
var React = require('react');
var InputSelect = require('app/components/InputSelect');
// var CommandList = require('app/components/CommandList');
var { Panel, Input, Label } = require('react-bootstrap');

var initialState = { gateway: {}, types: [], responders: [] };
var itemName = 'gateway';

var Device = React.createClass({
  mixins: [require('app/components/SocketMixin')(initialState, itemName)],

  render: function() {

    var { gateway, types, responders } = this.state;

    var header = (
      <h4>
        <strong>{gateway.name}</strong>
        <Label>{gateway.type}</Label>
      </h4>
    );

    return (
      <div className="device">
        <Panel header={header}>
          <form className="form-horizontal" onBlur={this.handleBlur}>
            <Input type="text" name="name" label="Name" value={gateway.name} onChange={this.handleChange} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <Input type="text" name="host" label="Host" value={gateway.host} onChange={this.handleChange} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <Input type="text" name="port" label="Port" value={gateway.port} onChange={this.handleChange} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <Input type="text" name="username" label="Username" value={gateway.username} onChange={this.handleChange} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <Input type="text" name="password" label="Password" value={gateway.password} onChange={this.handleChange} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <InputSelect name="type" label="Type" value={gateway.type} options={types} onChange={this.handleChange} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
          </form>
        </Panel>
      </div>
    );

  }
});

module.exports = Device;
