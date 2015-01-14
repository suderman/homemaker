var _ = require('lodash');
var React = require('react');
var { Panel, ListGroup, ListGroupItem, Glyphicon } = require('react-bootstrap');

var DeviceList = React.createClass({
  mixins: [require('app/components/mixins/route')],

  getInitialState: function() {
    return this.props.state || { devices: [] };
  },

  render: function() {
    var devices = _(this.state.devices);
    var go = this.go;

    var header = (
      <h4>
        <strong>Devices</strong>
      </h4>
    );

    return (
      <div className="device-list">
        <Panel header={header}>
        <ListGroup>

          {devices.map(function(device) {
            return (
              <ListGroupItem key={device.name + device.id} className="device">
                <a href={'/homemaker/devices/' + device.id} onClick={go}>
                  <Glyphicon glyph="phone"/>
                  <span>{device.name}</span>
                </a>
              </ListGroupItem>
            );
          })}

          <ListGroupItem key='new' className="device new">
            <a href='/homemaker/devices/new' onClick={go}>
              <Glyphicon glyph="plus"/>
              <span>Add New Device</span>
            </a>
          </ListGroupItem>

        </ListGroup>
        </Panel>
      </div>
    );
  }
});

module.exports = DeviceList;
