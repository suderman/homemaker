var _ = require('lodash');
var React = require('react');
var { Panel, ListGroup, ListGroupItem, Button, ButtonGroup, ButtonToolbar, Glyphicon } = require('react-bootstrap');

var ResponderList = React.createClass({
  mixins: [require('app/components/mixins/go')],

  getInitialState: function() {
    return { filter: false };
  },
  
  render: function() {
    var responders = _(this.props.responders);
    var gatewayName = this.props.gatewayName || 'Gateway';
    var newPath = '/homemaker/responders/' + this.props.gateway_id + '/responders/new';
    var filter = this.state.filter;
    var go = this.go;
    var list = this;

    var btnAll = false, btnSaved = false, btnUnsaved = false;
    switch (filter) {
      case 'saved':   btnSaved = true; break;
      case 'unsaved': btnUnsaved = true; break;
      default:        btnAll = true; break;
    }

    var header = (
      <h4>
       <ButtonToolbar>
          <ButtonGroup bsSize="small">
            <Button active={btnAll} onClick={function(){list.setState({filter:false})}}>All</Button>
            <Button active={btnSaved} onClick={function(){list.setState({filter:'saved'})}}>Saved</Button>
            <Button active={btnUnsaved} onClick={function(){list.setState({filter:'unsaved'})}}>Unsaved</Button>
          </ButtonGroup>
        </ButtonToolbar>
        Responders
        <div className="clear"/>
      </h4>
    );

    return (
      <div className="responder-list">
        <Panel header={header}>
        <ListGroup>

          {responders.map(function(responder) {

            // If a filter is set, skip over certain responders
            switch(filter) {
              case 'saved':
                if (!_.parseInt(responder.id)) return; break;
              case 'unsaved':
                if ( _.parseInt(responder.id)) return; break;
            }

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
            var status = <Glyphicon glyph="star-empty"/>,
                statusClass = 'unsaved';

            if (_.parseInt(responder.id)) {
              href='/homemaker/responders/' + responder.id
              clickEvent = go;
              status = <Glyphicon glyph="star"/>;
              statusClass = 'saved';
            }

            var typeClass = responder.type.replace(/\s+/g, '-').toLowerCase();

            return (
              <ListGroupItem key={responder.name + responder.id} className={`responder ${statusClass} ${typeClass}`}>
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
