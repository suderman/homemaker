var React = require('react');
var Reflux = require('reflux');
var DeviceActions = require('../actions/DeviceActions'); 
var Input = require('react-bootstrap/Input');
var DeviceTypeInput = require('../components/DeviceTypeInput');

var Device = React.createClass({

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

    var device = {
      id:             this.props.id,
      name:           this.refs['name'].getValue(),
      responder_type: this.refs['type'].getValue()
    };

    return DeviceActions.updateDevice(device);
  },

  render: function() {

    var className = (this.state.editing) ? 'device editing' : 'device';
    var {name, types} = this.props;
    var type = this.props.type || 'Adapter';

    return (
      <li className={className}>
        <h3 onTouchEnd={this.toggleEditing} onClick={this.toggleEditing}>{name}</h3>
        <p>{type}</p>

        <form className="form-horizontal container" onSubmit={this.handleSubmit}>
          <Input type="text" ref="name" label="Name" defaultValue={name} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
          <DeviceTypeInput ref="type" label="Type" value={type} options={types} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
          <Input type="submit" value="Update" wrapperClassName="col-sm-offset-2 col-sm-10" />
        </form>
      </li>
    );
  }
});

module.exports = Device;
