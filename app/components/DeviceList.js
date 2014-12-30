var React = require('react');
var { Panel, ListGroup, ListGroupItem } = require('react-bootstrap');
var initialState = { devices: [] };

var DeviceList = React.createClass({
  mixins: [require('app/components/mixins/navigate'), require('app/components/mixins/socket')(initialState)],

  render: function() {
    var self = this;
    var devices = this.state.devices;

    return (
      <div className="device-list">
        <Panel header="Devices" >
        <ListGroup>

          {devices.map(function(device) {
            return (
              <ListGroupItem key={device.name + device.id} className="device">
                <a href={'/homemaker/devices/' + device.id} onClick={self.navigate}>{device.name}</a>
              </ListGroupItem>
            );
          })}

          <ListGroupItem key='new' className="device new">
            <a href='/homemaker/devices/new' onClick={self.navigate}>Add New Device</a>
          </ListGroupItem>

        </ListGroup>
        </Panel>
      </div>
    );
  }
});

module.exports = DeviceList;
