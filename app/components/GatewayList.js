var React = require('react');
var { Panel, ListGroup, ListGroupItem } = require('react-bootstrap');
var initialState = { gateways: [] };

var GatewayList = React.createClass({
  mixins: [require('app/components/mixins/navigate'), require('app/components/mixins/socket')(initialState)],

  render: function() {
    var gateways = this.state.gateways;

    return (
      <div className="gateway-list">
        <Panel header="Gateways" >
        <ListGroup>

        {gateways.map(function(gateway) {
          return (
            <ListGroupItem key={gateway.name} className="gateway">
              <a href={'/homemaker/gateways/' + gateway.id} onClick={this.navigate}>{gateway.name}</a>
            </ListGroupItem>
          );
        })}

        </ListGroup>
        </Panel>
      </div>
    );
  }
});

module.exports = GatewayList;
