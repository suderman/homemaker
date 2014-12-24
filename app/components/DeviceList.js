var React = require('react');
var { Panel, ListGroup, ListGroupItem, Button, ButtonGroup } = require('react-bootstrap');
var initialState = { list: [] };

var DeviceList = React.createClass({
  mixins: [require('./SocketMixin')(initialState)],

  render: function() {
    var list = this.state.list;

    function boom(e) {
      e.preventDefault();
      console.log('trigger')
      socket.emit('get', router.pathname());
    }

    function navigate(event) {
      event.preventDefault();
      global.router.go(event.target.href, event.target.name);
    }

    return (
      <div className="device-list">
        <Panel header="Devices" >
        <a href="#" onClick={boom}>Trigger!</a>
        <ListGroup>

        {list.map(function(item) {

          var editPath = '/homemaker/devices/' + item.id + '/edit';
          var viewPath = '/homemaker/devices/' + item.id;
          var buttonGroup = '';

          if (parseInt(item.id, 10) > 0) {
            buttonGroup = (
              <ButtonGroup>
                <Button className="edit" href={editPath} onClick={navigate}>Edit</Button>
                <Button className="view" href={viewPath} onClick={navigate}>Commands</Button>
              </ButtonGroup>
            );
          } else {
            buttonGroup = (
              <ButtonGroup>
                <Button className="view" href={viewPath} onClick={navigate}>Commands</Button>
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
            
          // return (<Device key={item.name} id={item.id} type={item.responder_type} 
          //                 name={item.name} types={types} />);
        })}

        </ListGroup>
        </Panel>
      </div>
    );
  }
});

module.exports = DeviceList;
