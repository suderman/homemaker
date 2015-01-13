var _ = require('lodash');
var React = require('react');
var { Panel, ListGroup, ListGroupItem, Glyphicon } = require('react-bootstrap');

var CommandList = React.createClass({
  mixins: [require('app/components/mixins/go')],
  
  render: function() {
    var commands = _(this.props.commands);
    var newPath = '/homemaker/devices/' + this.props.deviceId + '/commands/new';
    var go = this.go;

    return (
      <div className="command-list">
        <Panel header="Commands">
        <ListGroup>

          {commands.map(function(command) {

            var href = '';
            if (parseInt(command.id, 10) > 0) {
              href='/homemaker/commands/' + command.id
            }

            return (
              <ListGroupItem key={command.name + command.id} className="command">
                <a href={href} onClick={go}>
                  <Glyphicon glyph="comment"/>
                  <span>{command.name}</span>
                </a>
              </ListGroupItem>
            );
              
          })}

          {(this.props.isAdapter) || (
            <ListGroupItem key='new' className="command new">
              <a href={newPath} onClick={go}>
                <Glyphicon glyph="plus"/>
                <span>Add New Command</span>
              </a>
            </ListGroupItem>
          )}

        </ListGroup>
        </Panel>
      </div>
    );
  }
});

module.exports = CommandList;
