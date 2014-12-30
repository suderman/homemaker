var _ = require('underscore');
var React = require('react');
var InputSelect = require('app/components/InputSelect');
var CommandList = require('app/components/CommandList');
var { Panel, Input, Label, Button } = require('react-bootstrap');

var initialState = { item: {}, types: [], commands: [] };

var Device = React.createClass({
  mixins: [require('app/components/mixins/navigate'), require('app/components/mixins/socket')(initialState)],

  render: function() {

    var { types, commands, isNew } = this.state;
    var device = this.state.item;
    device.type = device.responder_type || 'Adapter';
    var isAdapter = (device.responder_type) ? false : true;
    var displayName = device.name || '(Unnamed Device #' + device.id + ')';
    if (isNew) {
      displayName = device.name || 'New Device';
    }

    var header = (
      <h4>
        <strong>{displayName}</strong>
        <Label>{device.type}</Label>
      </h4>
    );

    var form = (isAdapter) ? 'Adapter' : (
      <form className="form-horizontal" onChange={this.setItem} onBlur={this.saveItem}>
        <Input type="text" name="name" label="Name" value={device.name} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
        <InputSelect name="responder_type" label="Type" value={device.type} options={types} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
      </form>
    );

    return (
      <div className="device">
        <Panel header={header}>
          {form}
          {((isNew) || (isAdapter)) || <Button bsStyle="danger" href="/homemaker/devices" onClick={this.removeItem}>Delete</Button>}
        </Panel>
        {(isNew) || <CommandList deviceId={device.id} isAdapter={isAdapter} commands={commands} />}
      </div>
    );

  }
});

module.exports = Device;
