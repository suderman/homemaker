var React = require('react');
var InputSelect = require('app/components/InputSelect');
var ButtonConfirm = require('app/components/ButtonConfirm');
var { Panel, Input, Label, Button, Glyphicon } = require('react-bootstrap');

var Responder = React.createClass({
  mixins: [require('app/components/mixins/route')],

  getInitialState: function() {
    return this.props.state || { item: { status: 'unknown' }, isNew: false };
  },

  // Save this responder when loading in case the name had changed on the adapter side
  componentDidMount: function() {
    if (this.state.item.id) {
      browser.socket.emit('json', browser.router.path(), this.state.item);
    }
  },

  render: function() {
    var responder = this.state.item;
    var gateway = this.state.item.gateway;
    var gatewayName = (gateway) ? gateway.name : '';
    var status = (responder.status) ? responder.status.charAt(0).toUpperCase() + responder.status.substring(1) : '';
    var isNew   = this.state.isNew;
    var gatewayPath = '/homemaker/gateways/' + this.state.item.gateway_id;

    var input = {
      onFocus:          this.cacheItem,
      onChange:         this.setItem,
      onBlur:           this.saveItem,
      labelClassName:   "col-sm-2",
      wrapperClassName: "col-sm-10"
    };

    var header = (
      <h4>
        <Button href={gatewayPath} onClick={this.go}>Back to Gateway</Button>
        <strong><Glyphicon glyph="star"/>{(responder.name == 'default') ? gatewayName : responder.name}</strong>
        <div className="clear"/>
      </h4>
    );
    var deleteText = (status == 'Valid') ? 'Deactivate' : 'Delete';

    return (
      <div className="responder">
        <Panel header={header}>
          <form className="form-horizontal">
            <Input type="text" ref="gateway" name="gateway" label="Gateway" value={gatewayName} disabled={true} {...input}/>
            <Input type="text" ref="name" name="name" label="Name" value={responder.name} disabled={true} {...input}/>
            <Input type="text" ref="address" name="address" label="Address" value={responder.address} disabled={true} {...input}/>
            <Input type="text" ref="type" name="name" label="Type" value={responder.type} disabled={true} {...input}/>
            <Input type="text" ref="status" name="status" label="Status" value={status} disabled={true} {...input}/>
          </form>
          {(isNew) || <ButtonConfirm href={gatewayPath} onClick={this.removeItem} confirm={'Confirm ' + deleteText}>{deleteText}</ButtonConfirm>}
        </Panel>
      </div>
    );

  }
});

module.exports = Responder;
