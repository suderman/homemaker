var _ = require('underscore');
module.exports = function(initialState) {

  initialState = initialState || {};
  return {

    getInitialState: function() {
      return this.props.state || initialState;
    },
  
    componentWillUnmount: function() {
      socket.removeAllListeners('json');
    },
  
    componentDidMount: function() {
      console.log('component did mount' + router.pathname())
      console.log(this)
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
      socket.emit('json', path);

      socket.on('json', function(path, state) {
        console.log('component did mount set state');
        console.log('old state')
        console.log(component.state)
        console.log('new state')
        console.log(state);
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
      socket.emit('json', path, this.state.item);

      // Also update the localstorage (only if not a new item)
      if (!path.match('/new$')=='/new') { 
        localStorage.setItem(path, JSON.stringify(this.state));
      }
    
    },

    removeItem: function(event) {
      var path = router.pathname();
      var newPath = event.target.href || '/homemaker';
      localStorage.removeItem(path);
      socket.emit('json', path, null);
      router.go(newPath);
    }

  }
}
