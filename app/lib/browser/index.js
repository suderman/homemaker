var _ = require('lodash');
require('./dom'); // extend dom

// Constructor for brower's router (main global)
var Browser = function() {

  // Create new Director router
  this.router = require('./router')(this);

  // Cache with localforage
  this.cache = require('./cache')(this);

  // Check network with Offline
  this.network = require('./network')(this);

  // Socket.io
  this.socket = require('./socket')(this);

  // React.js
  this.view = require('./view')(this);

  // Watch all routes
  _(this.router.routes).forEach((route) => {
    this.router.observe(route);
  }).value();

  // Clear cache
  if (this.network.state == 'up') {
    this.cache.clear();
  }

  // Save in-page state into local storage
  document.addEventListener('DOMContentLoaded', () => {
    this.cache.set(this.router.path(), global.state, () => this.router.init());
  });

  // // Go to current route on DOM load
  // document.addEventListener('DOMContentLoaded', () => {
  //   this.router.init();
  // });
};

module.exports = new Browser();
