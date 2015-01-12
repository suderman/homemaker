var _ = require('lodash');
var events = [];

events.push({
  name: 'invalidate',

  browser: function(paths) {
    this.cache.invalidate(paths);
  }
});

events.push({
  name: 'invalidateAll',

  browser: function() {
    this.cache.invalidateAll();
  }
});

events.push({
  name: 'invalidateAllExcept',

  browser: function(paths) {
    this.cache.invalidateAllExcept(paths);
  }
});

module.exports = events;
