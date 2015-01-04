var _ = require('underscore');
var React = require('react');
var InputSelect = require('app/components/InputSelect');
var { Panel, Input, Label, Button } = require('react-bootstrap');

var initialState = { item: {}, gateways: [], isNew: true };

var Responder = React.createClass({
  mixins: [require('app/components/mixins/router'), require('app/components/mixins/socket')(initialState)],

  render: function() {
    var responder = this.state.item;
    var gateways = this.state.gateways;
    var gateway = _(gateways).find(function(gateway) {
      return gateway.id == responder.gateway_id;
    });
    var gatewayName = (gateway) ? gateway.name : '';
    var isNew   = this.state.isNew;
    var gatewayPath = '/homemaker/gateways/' + this.state.item.gateway_id;

    var header = (
      <h4>
        <Button href={gatewayPath} onClick={this.go}>Back to Gateway</Button>
        <strong>{responder.name}</strong>
        <div className="clear"/>
      </h4>
    );

    return (
      <div className="responder">
        <Panel header={header}>
          <form className="form-horizontal" onFocus={this.cacheItem} onChange={this.setItem} onBlur={this.saveItem}>
            <Input type="text" ref="gateway" name="gateway" label="Gateway" value={gatewayName} disabled="disabled" labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <Input type="text" ref="name" name="name" label="Name" value={responder.name} disabled="disabled" labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <Input type="text" ref="address" name="address" label="Address" value={responder.address} disabled="disabled" labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            <Input type="text" ref="type" name="name" label="Type" value={responder.type} disabled="disabled" labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
          </form>
          {(isNew) || <Button bsStyle="danger" href={gatewayPath} onClick={this.removeItem}>Delete</Button>}
        </Panel>
      </div>
    );

  }
});

module.exports = Responder;
