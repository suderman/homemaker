module.exports = function(initialState) {

  initialState = initialState || {};
  return {

    getInitialState: function() {
      return this.props.state || initialState;
    },
  
    componentWillUnmount: function() {
      socket.removeAllListeners('set');
    },
  
    componentDidMount: function() {
      var component = this;
      var path = router.pathname();

      var state = JSON.parse(localStorage.getItem(path));
      if (state) { 
        component.setState(state); 
      }
      socket.emit('get', path);

      socket.on('set', function(path, state) {
        if (state) {
          localStorage.setItem(path, JSON.stringify(state));
          component.setState(state); 
        }
      });
    }

  }
}
