var _ = require('lodash');
var events = [];

events.push({
  name: 'redirect',

  browser: function(path) {
    console.log('on redirect ' + path);
    this.router.go(path);
  }

});

module.exports = events;
