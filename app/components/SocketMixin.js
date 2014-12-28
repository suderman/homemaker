var _ = require('underscore');
module.exports = function(initialState, itemName) {

  initialState = initialState || {};
  itemName = itemName || 'item';

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
    },

    handleChange: function(event) {

      var value = {};
      value[event.target.name] = event.target.value;

      var item = {};
      _(item).extend(this.state[itemName], value);

      var state = {};
      state[itemName] = item;

      this.setState(state);
    },

    handleBlur: function(event) {
      var path = router.pathname();
      localStorage.setItem(path, JSON.stringify(this.state));
      socket.emit('set', path, this.state[itemName]);
    }

  }
}
