var _ = require('lodash');
var React = require('react');
var { Panel, ListGroup, ListGroupItem, Button, Glyphicon } = require('react-bootstrap');

var ResponderList = React.createClass({
  mixins: [require('app/components/mixins/go')],
  
  render: function() {
    var responders = _(this.props.responders);
    var gatewayName = this.props.gatewayName || 'Gateway';
    var newPath = '/homemaker/responders/' + this.props.gateway_id + '/responders/new';
    var go = this.go;

    return (
      <div className="responder-list">
        <Panel header="Responders">
        <ListGroup>

          {responders.map(function(responder) {

            var name = (responder.name == 'default') ? gatewayName : responder.name;

            var href = '';
            var clickEvent = function(event) {
              event.preventDefault();
              browser.socket.emit('json', '/homemaker/responders/new', {
                gateway_id:           responder.gateway_id,
                address:              responder.address,
                name:                 responder.name,
                type:                 responder.type,
                custom_status_lookup: responder.custom_status_lookup
              });
            }
            var status = <Glyphicon glyph="star-empty"/>;

            if (_.parseInt(responder.id) > 0) {
              href='/homemaker/responders/' + responder.id
              clickEvent = go;
              status = <Glyphicon glyph="star"/>;
            }

            return (
              <ListGroupItem key={responder.name + responder.id} className="responder">
                <a href={href} onClick={clickEvent}>
                  {status}
                  <span>{name}</span>
                </a>
              </ListGroupItem>
            );
              
          })}

        </ListGroup>
        </Panel>
      </div>
    );
  }
});

module.exports = ResponderList;
