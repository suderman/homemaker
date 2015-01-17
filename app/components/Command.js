var _ = require('lodash');
var React = require('react');
var InputSelect = require('app/components/InputSelect');
var ButtonConfirm = require('app/components/ButtonConfirm');
var { Panel, Input, Label, Button, Glyphicon } = require('react-bootstrap');

var Command = React.createClass({
  mixins: [require('app/components/mixins/route')],

  getInitialState: function() {
    return this.props.state || { item: {}, devices: [], isNew: false };
  },

  render: function() {
    // var command = this.state.item || {};
    // var devices = this.state.devices || [];
    // var isNew   = this.state.isNew || false;
    
    var command = this.state.item;
    var devices = this.state.devices;
    var isNew   = this.state.isNew;
    // var { command, devices, isNew } = this.state;
    var devicePath = `/homemaker/devices/${command.device_id}`;

    var input = {
      onFocus:          this.cacheItem,
      onChange:         this.setItem,
      onBlur:           this.saveItem,
      labelClassName:   "col-sm-2",
      wrapperClassName: "col-sm-10"
    };

    var header = (
      <h4>
        <Button href={devicePath} onClick={this.go}>Back to Device</Button>
        <strong><Glyphicon glyph="comment"/>{command.name}</strong>
        <div className="clear"/>
      </h4>
    );

    return (
      <div className="command">
        <Panel header={header}>
          <form className="form-horizontal">
            <InputSelect name="device_id" label="Device" value={command.device_id} options={devices} {...input}/>
            <Input type="text" ref="name" name="name" label="Name" value={command.name} {...input}/>
            <Input type="text" ref="feedback" name="feedback" label="Feedback" value={command.feedback} {...input}/>
            <Input type="textarea" ref="command" name="command" label="Command" value={command.command} {...input}/>
          </form>
          {(isNew) || <ButtonConfirm href={devicePath} onClick={this.removeItem} confirm="Confirm Delete">Delete</ButtonConfirm>}
        </Panel>
      </div>
    );

  }
});

module.exports = Command;
