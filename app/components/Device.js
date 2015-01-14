var _ = require('lodash');
var React = require('react');
var InputSelect = require('app/components/InputSelect');
var CommandList = require('app/components/CommandList');
var { Panel, Input, Label, Button, Glyphicon } = require('react-bootstrap');

var Device = React.createClass({
  mixins: [require('app/components/mixins/route')],

  getInitialState: function() {
    return this.props.state || { item: {}, types: [], commands: [] };
  },

  render: function() {

    // var { types, commands, isNew } = this.state;
    var types = this.state.types || [], 
        commands = this.state.commands || [], 
        isNew = this.state.isNew || false,
        device = this.state.item || {};

    device.type = device.responder_type || 'Adapter';
    var isAdapter = (device.responder_type) ? false : true;
    // var displayName = device.name || '(Unnamed Device #' + device.id + ')';
    var displayName = device.name || '';
    if (isNew) {
      displayName = device.name || 'New Device';
    }

    var input = {
      onFocus:          this.cacheItem,
      onChange:         this.setItem,
      onBlur:           this.saveItem,
      labelClassName:   "col-sm-2",
      wrapperClassName: "col-sm-10"
    };

    var header = (
      <h4>
        <Button href="/homemaker/devices" onClick={this.go}>Back to Devices</Button>
        <strong><Glyphicon glyph="phone"/>{displayName}</strong>
        <div className="clear"/>
      </h4>
    );

    var form = (isAdapter) ? 'Adapter' : (
      <form className="form-horizontal">
        <Input type="text" name="name" label="Name" value={device.name} {...input}/>
        <InputSelect name="responder_type" label="Type" value={device.type} options={types} {...input}/>
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
