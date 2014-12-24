var _ = require('underscore');
var React = require('react');
var TypeInput = require('../components/TypeInput');
var CommandList = require('../components/CommandList');
var { Panel, ListGroup, ListGroupItem, Button, ButtonGroup, Input, Label } = require('react-bootstrap');

var initialState = { editing: false, item: [], types: [], commands: [] };

var Device = React.createClass({
  mixins: [require('./SocketMixin')(initialState)],

  toggleEditing: function(event) {
    this.setState({ 
      editing: ((this.state.editing) ? false : true)
    });
  },

  handleSubmit: function(event) {
    event.preventDefault();

    var device = {
      id:             this.props.id,
      name:           this.refs['name'].getValue(),
      responder_type: this.refs['type'].getValue()
    };

    return DeviceActions.updateDevice(device);
  },


  render: function() {
    var self = this;
    console.log(this.state)

    var item = this.state.item;
    var types = this.state.types;
    var commands = this.state.commands;
    var name = item.name;
    var type = item.responder_type || 'Adapter';
    var className = (this.state.editing) ? 'device editing' : 'device';
    // <Button onClick={this.toggleEditing}>Edit Device</Button>
    // <Input type="submit" value="Update" wrapperClassName="col-sm-offset-2 col-sm-10" />

    var header = (
      <h4>
        <strong>{name}</strong>
        <Label>{type}</Label>
      </h4>
    );

    var form = '';
    if (type != 'Adapter') {
      form = (
        <form className="form-horizontal" onSubmit={this.handleSubmit}>
          <Input type="text" ref="name" label="Name" value={name} onChange={handleNameChange} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
          <TypeInput ref="type" label="Type" value={type} options={types} handleChange={handleTypeChange} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
        </form>
      );
    }

    return (
      <div className={className}>
        <Panel header={header}>{form}</Panel>
        <CommandList list={commands} />
      </div>
    );

    function handleNameChange(event) {
      console.log('set name to ' + event.target.value);
      console.log(self.state);
      var item = {};
      _(item).extend(self.state.item, {
        name: event.target.value 
      });
      self.setState({
        item: item
      });
    }

    function handleTypeChange(event) {
      console.log('set type to ' + event.target.value);
      console.log(self.state);
      var item = {};
      _(item).extend(self.state.item, {
        responder_type: event.target.value 
      });
      self.setState({
        item: item
      });
    }
  }
});

module.exports = Device;
