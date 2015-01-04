var _ = require('underscore');
var React = require('react');
var InputSelect = require('app/components/InputSelect');
var { Panel, Input, Label, Button } = require('react-bootstrap');

var initialState = { item: { status: 'unknown' }, isNew: false };

var Responder = React.createClass({
  mixins: [require('app/components/mixins/router'), require('app/components/mixins/socket')(initialState)],

  render: function() {
    var responder = this.state.item;
    var gateway = this.state.item.gateway;
    var gatewayName = (gateway) ? gateway.name : '';
    var status = (responder.status) ? responder.status.charAt(0).toUpperCase() + responder.status.substring(1) : '';
    var isNew   = this.state.isNew;
    var gatewayPath = '/homemaker/gateways/' + this.state.item.gateway_id;

    var header = (
      <h4>
        <Button href={gatewayPath} onClick={this.go}>Back to Gateway</Button>
        <strong>{(responder.name == 'default') ? gatewayName : responder.name}</strong>
        <div className="clear"/>
      </h4>
    );
    var deleteText = (status == 'Valid') ? 'Deactivate' : 'Delete';

    return (
      <div className="responder">
        <Panel header={header}>
          <form className="form-horizontal" onFocus={this.cacheItem} onChange={this.setItem} onBlur={this.saveItem}>
            <Input type="text" ref="gateway" name="gateway" label="Gateway" value={gatewayName} disabled={true} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <Input type="text" ref="name" name="name" label="Name" value={responder.name} disabled={true} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <Input type="text" ref="address" name="address" label="Address" value={responder.address} disabled={true} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <Input type="text" ref="type" name="name" label="Type" value={responder.type} disabled={true} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <Input type="text" ref="status" name="status" label="Status" value={status} disabled={true} labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
          </form>
          {(isNew) || <Button bsStyle="danger" href={gatewayPath} onClick={this.removeItem}>{deleteText}</Button>}
        </Panel>
      </div>
    );

  }
});

module.exports = Responder;
