var React = require('react');
var { Panel, ListGroup, ListGroupItem } = require('react-bootstrap');

var CommandList = React.createClass({
  mixins: [require('app/components/mixins/router')],
  
  render: function() {
    var commands = this.props.commands;
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
              <ListGroupItem key={command.name} className="command">
                <a href={href} onClick={go}>{command.name}</a>
              </ListGroupItem>
            );
              
          })}

          {(this.props.isAdapter) || (
            <ListGroupItem key='new' className="command new">
              <a href={newPath} onClick={go}>Add New Command</a>
            </ListGroupItem>
          )}

        </ListGroup>
        </Panel>
      </div>
    );
  }
});

module.exports = CommandList;
