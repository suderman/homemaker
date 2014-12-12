var React = require('react');
var Reflux = require('reflux');

var DeviceActions = require('../actions/DeviceActions'); 
var DeviceStore = require('../stores/DeviceStore'); 
var Device = require('../components/Device');

var DeviceList = React.createClass({
  mixins: [Reflux.connect(DeviceStore)],

  getInitialState: function() {
    return this.props.state || { list: [], types: [] };
  },
  
  componentDidMount: function() {
    // if (!this.state.list.length) {
      // DeviceActions.getDevices();
    // }
    DeviceActions.getState();
  },
  
  render: function() {
    var list = this.state.list;
    var types = this.state.types;

    return (
      <div className="device-list">
        <h2>Devices</h2>
        <ol>{list.map(function(item) {
          return (<Device key={item.name} id={item.id} type={item.responder_type} 
                          name={item.name} types={types} />);
        })}</ol>
      </div>
    );
  }
});

module.exports = DeviceList;
