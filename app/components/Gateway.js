var React = require('react');
var InputSelect = require('app/components/InputSelect');
var ResponderList = require('app/components/ResponderList');
var { Panel, Input, Label, Button, Glyphicon } = require('react-bootstrap');

var Device = React.createClass({
  mixins: [require('app/components/mixins/route')],

  getInitialState: function() {
    return this.props.state || { item: {}, types: [], responders: [] };
  },

  render: function() {

    var { types, responders, isNew } = this.state;
    var gateway = this.state.item;

    var go = { onClick: this.go, onTouchStart: this.go }
    var removeItem = { onClick: this.removeItem, onTouchStart: this.removeItem }

    var input = {
      onFocus:          this.cacheItem,
      onChange:         this.setItem,
      onBlur:           this.saveItem,
      labelClassName:   "col-sm-2",
      wrapperClassName: "col-sm-10"
    };


    var header = (
      <h4>
        <Button href="/homemaker/gateways" {...go}>Back to Gateways</Button>
        <strong><Glyphicon glyph="cloud"/>{gateway.name}</strong>
        <div className="clear"/>
      </h4>
    );

    return (
      <div className="gateway">
        <Panel header={header}>

          <form className="form-horizontal">
            <Input type="text" name="name" label="Name" value={gateway.name} {...input}/>
            <Input type="text" name="host" label="Host" value={gateway.host} {...input}/>
            <Input type="text" name="port" label="Port" value={gateway.port} {...input}/>
            <Input type="text" name="username" label="Username" value={gateway.username} {...input}/>
            <Input type="text" name="password" label="Password" value={gateway.password} {...input}/>
            <InputSelect name="type" label="Type" value={gateway.type} options={types} {...input}/>
          </form>
          {(isNew) || <Button bsStyle="danger" href="/homemaker/gateways" {...removeItem}>Delete</Button>}
        </Panel>
        {(isNew) || <ResponderList gateway_id={gateway.id} gatewayName={gateway.name} responders={responders} />}
      </div>
    );

  }
});

module.exports = Device;
