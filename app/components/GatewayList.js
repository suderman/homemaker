var _ = require('lodash');
var React = require('react');
var { Panel, ListGroup, ListGroupItem } = require('react-bootstrap');
var initialState = { gateways: [] };

var GatewayList = React.createClass({
  mixins: [require('app/components/mixins/route')(initialState)],

  render: function() {
    var gateways = _(this.state.gateways);
    var go = this.go;

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
              <a href={'/homemaker/gateways/' + gateway.id} onClick={go}>{gateway.name}</a>
            </ListGroupItem>
          );
        })}

        <ListGroupItem key='new' className="gateway new">
          <a href='/homemaker/gateways/new' onClick={go}>Add New Gateway</a>
        </ListGroupItem>

        </ListGroup>
        </Panel>
      </div>
    );
  }
});

module.exports = GatewayList;
