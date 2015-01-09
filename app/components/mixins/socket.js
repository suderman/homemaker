var _ = require('lodash/dist/lodash.underscore');
module.exports = function(initialState) {
  return {

    getInitialState: function() {
      initialState = initialState || {};

      // Snag global.state (if present) and nullify it
      if (global.state) {
        initialState = _.clone(global.state);
        global.state = null;
      }

      return this.props.state || initialState;
    },
  
    componentWillUnmount: function() {
      // app.socket.removeAllListeners('json');
      app.view.component = null;
    },
  
    componentDidMount: function() {
      console.log('component did mount' + app.router.path())
      app.view.component = this;

      var path = app.router.path();
      this.values = {};

      // this.setState({ isNew: (path.match('/new$')=='/new') ? true : false });

      // app.getItem(path).then(function(state) {
      //   console.log('state from localforage for ' + path);
      //   console.log(state);
      //   if (state) {
      //     this.setState(state); 
      //   }
      // }.bind(this));
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
      var path = app.router.path();
      app.socket.emit('json', path, this.state.item);

      // Also save to localstorage (only if not a new item)
      if (!(path.match('/new$')=='/new')) { 
        app.cache.set(path, this.state);
      }
    
    },

    removeItem: function(event) {
      console.log('remove item')
      event.preventDefault();

      var path = app.router.path();
      var newPath = event.target.href || '/homemaker';
      app.cache.invalidateAll();
      app.cache.remove(path);
      app.socket.emit('json', path, null);
      app.router.go(newPath);
    }

  }
}
