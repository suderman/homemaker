var _ = require('lodash');

// Constructor for brower's router (main global)
var Browser = function() {

  // Create new Director router
  require('./router')(this);

  // Cache with localforage
  require('./cache')(this);

  // Check network with Offline
  require('./network')(this);

  // Socket.io
  require('./socket')(this);

  // React.js
  require('./view')(this);

  // Save in-page state into local storage
  this.cache.set(this.router.path(), global.state);

  // Watch all routes
  _(this.router.routes).forEach(function(route) {
    this.router.observe(route);
  }.bind(this));

  // Go to current route on DOM load
  document.addEventListener('DOMContentLoaded', function() {
    this.router.init();
  }.bind(this));
};

module.exports = new Browser();
