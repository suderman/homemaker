var _ = require('underscore');
var React = require('react');
var InputSelect = require('app/components/InputSelect');
// var CommandList = require('app/components/CommandList');
var { Panel, Input, Label } = require('react-bootstrap');

var initialState = { item: {}, types: [], responders: [] };

var Device = React.createClass({
  mixins: [require('app/components/mixins/navigate'), require('app/components/mixins/socket')(initialState)],

  render: function() {

    var { types, responders } = this.state;
    var gateway = this.state.item;

    var header = (
      <h4>
        <strong>{gateway.name}</strong>
        <Label>{gateway.type}</Label>
      </h4>
    );

    return (
      <div className="device">
        <Panel header={header}>
          <form className="form-horizontal" onFocus={this.cacheItem} onChange={this.setItem} onBlur={this.saveItem}>
            <Input type="text" name="name" label="Name" value={gateway.name} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <Input type="text" name="host" label="Host" value={gateway.host} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <Input type="text" name="port" label="Port" value={gateway.port} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <Input type="text" name="username" label="Username" value={gateway.username} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <Input type="text" name="password" label="Password" value={gateway.password} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <InputSelect name="type" label="Type" value={gateway.type} options={types} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
          </form>
        </Panel>
      </div>
    );

  }
});

module.exports = Device;
