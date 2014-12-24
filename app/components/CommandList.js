var React = require('react');
// var Reflux = require('reflux');

// var DeviceActions = require('../actions/DeviceActions'); 
// var DeviceStore = require('../stores/DeviceStore'); 
// var Device = require('../components/Device');
var { Panel, ListGroup, ListGroupItem, Button, ButtonGroup } = require('react-bootstrap');


var CommandList = React.createClass({
  // mixins: [Reflux.connect(DeviceStore)],

  // getInitialState: function() {
  //   return this.props.list || { list: [] };
  // },
  
  // componentWillMount: function() {
  //   if (typeof window !== 'undefined') {
  //     DeviceActions.getState();
  //   }
  // },
  
  render: function() {
    var list = this.props.list;

    function navigate (event) {
      event.preventDefault();
      global.router.go(this.href, this.name);
    }

    return (
      <div className="command-list">
        <Panel header="Commands">
        <ListGroup>

        {list.map(function(item) {

          var buttonGroup = '';
          if (parseInt(item.id, 10) > 0) {
            buttonGroup = (
              <ButtonGroup>
                <Button className="edit" href={'/homemaker/commands/'+item.id} onClick={navigate}>Edit</Button>
              </ButtonGroup>
            );
          }
          return (
            <ListGroupItem key={item.name} className="device">
              {buttonGroup}
              <h4>{item.name}</h4>
              <div className="clear"></div>
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
