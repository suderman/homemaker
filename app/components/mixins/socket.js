var _ = require('underscore');
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

      if (path.match('/new$')=='/new') { 
        component.setState({ isNew: true });
      } else {
        component.setState({ isNew: false });
      }

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
    },

    setItem: function(event) {
      console.log('set item')

      // Set value object with target's value
      var value = {};
      value[event.target.name] = event.target.value;

      // Create new state object with item object
      var state = { item: {} };
      _(state.item).extend(this.state.item, value);

      // Set state and trigger re-render
      this.setState(state);

    },

    saveItem: function(event) {
      console.log('save item')

      // Send the state item to the server
      var path = router.pathname();
      socket.emit('set', path, this.state.item);

      // Also update the localstorage (only if not a new item)
      if (!path.match('/new$')=='/new') { 
        localStorage.setItem(path, JSON.stringify(this.state));
      }
    
    },

    removeItem: function(event) {
      var path = router.pathname();
      localStorage.removeItem(path);
      socket.emit('remove', path);
    }

  }
}
