var _ = require('underscore');
var React = require('react');
var InputSelect = require('app/components/InputSelect');
var ResponderList = require('app/components/ResponderList');
var { Panel, Input, Label, Button } = require('react-bootstrap');

var initialState = { item: {}, types: [], responders: [] };

var Device = React.createClass({
  mixins: [require('app/components/mixins/router'), require('app/components/mixins/socket')(initialState)],

  render: function() {

    var { types, responders, isNew } = this.state;
    var gateway = this.state.item;

    var header = (
      <h4>
        <Button href="/homemaker/gateways" onClick={this.go}>Back to Gateways</Button>
        <strong>{gateway.name}</strong>
        <div className="clear"/>
      </h4>
    );

    return (
      <div className="gateway">
        <Panel header={header}>
          <form className="form-horizontal" onFocus={this.cacheItem} onChange={this.setItem} onBlur={this.saveItem}>
            <Input type="text" name="name" label="Name" value={gateway.name} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <Input type="text" name="host" label="Host" value={gateway.host} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <Input type="text" name="port" label="Port" value={gateway.port} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <Input type="text" name="username" label="Username" value={gateway.username} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <Input type="text" name="password" label="Password" value={gateway.password} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <InputSelect name="type" label="Type" value={gateway.type} options={types} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
          </form>
          {(isNew) || <Button bsStyle="danger" href="/homemaker/gateways" onClick={this.removeItem}>Delete</Button>}
        </Panel>
        {(isNew) || <ResponderList gateway_id={gateway.id} responders={responders} />}
      </div>
    );

  }
});

module.exports = Device;
