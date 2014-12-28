var _ = require('underscore');
var React = require('react');
var InputSelect = require('app/components/InputSelect');
var CommandList = require('app/components/CommandList');
var { Panel, Input, Label } = require('react-bootstrap');

var initialState = { device: {}, types: [], commands: [] };
var itemName = 'device';

var Device = React.createClass({
  mixins: [require('app/components/SocketMixin')(initialState, itemName)],

  render: function() {

    var { device, types, commands } = this.state;
    device.type = device.responder_type || 'Adapter';

    var header = (
      <h4>
        <strong>{device.name}</strong>
        <Label>{device.type}</Label>
      </h4>
    );

    var form = 'Adapter';
    if (device.type != 'Adapter') {
      form = (
        <form className="form-horizontal" onBlur={this.handleBlur}>
          <Input type="text" name="name" label="Name" value={device.name} onChange={this.handleChange} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
          <InputSelect name="responder_type" label="Type" value={device.type} options={types} handleChange={this.handleChange} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
        </form>
      );
    }

    return (
      <div className="device">
        <Panel header={header}>{form}</Panel>
        <CommandList commands={commands} />
      </div>
    );

  }
});

module.exports = Device;
