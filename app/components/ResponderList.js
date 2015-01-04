var React = require('react');
var { Panel, ListGroup, ListGroupItem, Button, Glyphicon } = require('react-bootstrap');

var ResponderList = React.createClass({
  mixins: [require('app/components/mixins/router')],
  
  render: function() {
    var responders = this.props.responders;
    var newPath = '/homemaker/responders/' + this.props.gateway_id + '/responders/new';
    var go = this.go;

    return (
      <div className="responder-list">
        <Panel header="Responders">
        <ListGroup>

          {responders.map(function(responder) {

            var href = '';
            var status = <Glyphicon glyph="star-empty"/>;
            if (parseInt(responder.id, 10) > 0) {
              href='/homemaker/responders/' + responder.id
              status = <Glyphicon glyph="star"/>;
            }

            return (
              <ListGroupItem key={responder.name + responder.id} className="responder">
                <a href={href} onClick={go}>{status}&nbsp;&nbsp;{responder.name}</a>
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
