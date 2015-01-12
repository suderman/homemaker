var _ = require('lodash');
var React = require('react');
var InputSelect = require('app/components/InputSelect');
var { Panel, Input, Label, Button } = require('react-bootstrap');

var initialState = { item: {}, devices: [], isNew: true };

var Command = React.createClass({
  mixins: [require('app/components/mixins/route')(initialState)],

  render: function() {
    var command = this.state.item;
    var devices = this.state.devices;
    var isNew   = this.state.isNew;
    var devicePath = '/homemaker/devices/' + this.state.item.device_id;

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
        <strong>{command.name}</strong>
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
          {(isNew) || <Button bsStyle="danger" href={devicePath} onClick={this.removeItem}>Delete</Button>}
        </Panel>
      </div>
    );

  }
});

module.exports = Command;
