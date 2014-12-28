var React = require('react');
var { Panel, ListGroup, ListGroupItem } = require('react-bootstrap');

var CommandList = React.createClass({
  
  render: function() {
    var commands = this.props.commands;

    function navigate (event) {
      event.preventDefault();
      if (event.target.href) {
        global.router.go(event.target.href, this.name);
      }
    }

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
              <a href={href} onClick={navigate}>{command.name}</a>
            </ListGroupItem>
          );
            
        })}

        </ListGroup>
        </Panel>
      </div>
    );
  }
});

module.exports = CommandList;
