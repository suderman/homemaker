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
      var path = router.pathname();
      this.values = {};

      if (path.match('/new$')=='/new') { 
        this.setState({ isNew: true });
      } else {
        this.setState({ isNew: false });
      }

      var state = JSON.parse(localStorage.getItem(path));
      if (state) { 
        this.setState(state); 
      }
      socket.emit('json', path);

      socket.on('json', function(path, state) {
        if (state) {
          localStorage.setItem(path, JSON.stringify(state));
          this.setState(state); 
        }
      }.bind(this));
    },

    cacheItem: function(event) {
      console.log('cache item')
      this.values[event.target.name] = event.target.value;
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

      // If nothing has changed, skip this
      if (this.values[event.target.name] == event.target.value) return;

      console.log('save item')

      // Cache value
      this.values[event.target.name] = event.target.value;

      // Send the state item to the server
      var path = router.pathname();
      socket.emit('json', path, this.state.item);

      // Also update the localstorage (only if not a new item)
      if (!path.match('/new$')=='/new') { 
        localStorage.setItem(path, JSON.stringify(this.state));
      }
    
    },

    removeItem: function(event) {
      console.log('remove item')
      event.preventDefault();

      var path = router.pathname();
      var newPath = event.target.href || '/homemaker';
      localStorage.removeItem(path);
      socket.emit('json', path, null);
      router.go(newPath);
    }

  }
}
