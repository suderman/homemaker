var React = require('react');
var { Panel, ListGroup, ListGroupItem } = require('react-bootstrap');
var initialState = { devices: [] };

var DeviceList = React.createClass({
  mixins: [require('app/components/SocketMixin')(initialState)],

  render: function() {
    var devices = this.state.devices;

    function navigate(event) {
      event.preventDefault();
      global.router.go(event.target.href, event.target.name);
    }

    return (
      <div className="device-list">
        <Panel header="Devices" >
        <ListGroup>

        {devices.map(function(device) {
          return (
            <ListGroupItem key={device.name} className="device">
              <a href={'/homemaker/devices/' + device.id} onClick={navigate}>{device.name}</a>
            </ListGroupItem>
          );
        })}

        </ListGroup>
        </Panel>
      </div>
    );
  }
});

module.exports = DeviceList;
