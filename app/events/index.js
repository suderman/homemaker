var events = [];
events = events.concat(require('./cache'));
events = events.concat(require('./json'));
events = events.concat(require('./redirect'));

// List all events in order
events.forEach(function(event) {
  console.log(event.name);
});

module.exports = events;
