var _ = require('lodash');
var events = [];

events.push({
  name: 'run',

  server: function(actionId) {
    console.log('run ' + actionId);
    if (actionId) {
      this.router.get(`/actions/${actionId}/run`);
    }
  }

});

module.exports = events;
