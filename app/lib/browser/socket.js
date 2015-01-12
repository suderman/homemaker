var _ = require('lodash');
var util = require('app/lib/util');

module.exports = function(browser) {

  var socket = {
    io: require('socket.io-client')(),
    events: util.events,
    connections: 0,

    on: function() {
      return socket.io.on.apply(socket.io, arguments);
    },

    emit: function() {
      return socket.io.emit.apply(socket.io, arguments);
    }
  }

  // Update connection count
  socket.on('connections', function(connections) {
    socket.connections = connections;
  });

  // Add event listeners
  _(socket.events).forEach(function(event) {

    // Make sure the event is valid
    if ((!event.browser) || (!event.name)) return;

    // Add event for the socket
    socket.io.on(event.name, function() {

      // Convert arguments to array
      var args = Array.prototype.slice.call(arguments);

      // Add socket as the last argument
      args.push(socket.io);

      // Call the event's browser method
      event.browser.apply(browser, args);
    
    });
  });

  return browser.socket = socket;
}
