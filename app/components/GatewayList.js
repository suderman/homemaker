var _ = require('lodash');
var React = require('react');
var { Panel, ListGroup, ListGroupItem, Button, Glyphicon } = require('react-bootstrap');

var GatewayList = React.createClass({
  mixins: [require('app/components/mixins/route')],

  getInitialState: function() {
    return this.props.state || { gateways: [] };
  },

  render: function() {
    var gateways = _(this.state.gateways);
    var go = { onClick: this.go, onTouchStart: this.go }

    var header = (
      <h4>
        <strong>Gateways</strong>
      </h4>
    );

    return (
      <div className="gateway-list">
        <Panel header={header}>
        <ListGroup>

        {gateways.map(function(gateway) {
          return (
            <ListGroupItem key={gateway.name} className="gateway">
              <a href={'/homemaker/gateways/' + gateway.id} {...go}>
                <Glyphicon glyph="cloud"/>
                <span>{gateway.name}</span>
              </a>
            </ListGroupItem>
          );
        })}

        <ListGroupItem key='new' className="gateway new">
          <a href='/homemaker/gateways/new' {...go}>
            <Glyphicon glyph="plus"/>
            <span>Add New Gateway</span>
          </a>
        </ListGroupItem>

        </ListGroup>
        </Panel>
      </div>
    );
  }
});

module.exports = GatewayList;
