var _ = require('lodash');
var mixin = {

  componentWillUnmount: function() {
    console.log('Unmounting component')
    browser.view.component = null;
    this.values = null;
  },

  componentDidMount: function() {
    console.log('Mounted component ' + browser.router.path())
    browser.view.component = this;
    this.values = {};
  },

  cacheItem: function(event) {
    console.log('cache item')
    this.values[event.target.name] = event.target.value;
  },

  setItem: function(event) {
    console.log('set item')

    // Set value object with target's value
    var itemUpdate = {};
    itemUpdate[event.target.name] = event.target.value;

    // Create new item object
    var item = _.merge({}, this.state.item, itemUpdate);

    // Set state and trigger re-render
    this.setState({ item: item });
  },

  saveItem: function(event) {

    // If nothing has changed, skip this
    if (this.values[event.target.name] == event.target.value) return;

    console.log('save item')

    // Cache value
    this.values[event.target.name] = event.target.value;

    // Send the state item to the server
    var path = browser.router.path();
    browser.socket.emit('json', path, this.state.item);

    // // Call for an update if data-attribute is set
    // if (event.target.getAttribute('data-update')) {
    //   browser.cache.invalidate(path);
    //   browser.socket.emit('json', path);
    //
    // // Also save to localstorage (only if not a new item)
    // } else if (!(path.match('/new$')=='/new')) {
    //   browser.cache.set(path, this.state);
    // }

    // Also save to localstorage (only if not a new item)
    if (!(path.match('/new$')=='/new')) {
      browser.cache.set(path, this.state);
    }

  },

  removeItem: function(event) {
    console.log('remove item')
    event.preventDefault();

    // Where we are and where we're going
    var path = browser.router.path();
    var newPath = event.target.href || '/homemaker';

    // Since the data has now changed, all routes must be re-fetched
    browser.cache.invalidateAll();
    browser.cache.remove(path);

    // Emit the json event; sending null to this path will cause a remove
    browser.socket.emit('json', path, null);

    // Move the browser off this now-removed route
    browser.router.go(newPath);
  }
}

// Include go method
mixin = _.assign(mixin, require('./go'));
module.exports = mixin;
