var _ = require('underscore');
var React = require('react');
var InputSelect = require('app/components/InputSelect');
var { Panel, Input, Label } = require('react-bootstrap');

var initialState = { command: {}, devices: [] };
var itemName = 'command';

var Command = React.createClass({
  mixins: [require('app/components/SocketMixin')(initialState, itemName)],

  render: function() {
    var self = this;
    var command = this.state.command;
    var devices = this.state.devices;

    var header = (
      <h4>
        <strong>{command.name}</strong>
      </h4>
    );

    return (
      <div className="command">
        <Panel header={header}>
          <form className="form-horizontal" onBlur={this.handleBlur}>
            <InputSelect name="device_id" label="Device" value={command.device_id} options={devices} handleChange={this.handleChange} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <Input type="text" ref="name" name="name" label="Name" value={command.name} onChange={this.handleChange} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <Input type="text" ref="feedback" name="feedback" label="Feedback" value={command.feedback} onChange={this.handleChange} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <Input type="textarea" ref="command" name="command" label="Command" value={command.command} onChange={this.handleChange} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
          </form>
        </Panel>
      </div>
    );

  }
});

module.exports = Command;
