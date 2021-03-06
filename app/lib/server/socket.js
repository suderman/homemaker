var _ = require('lodash');
module.exports = function(server, http) {

  var socket = {
    io: require('socket.io')(http),
    events: require('app/events'),
    connections: 0
  }

  socket.io.on('connection', function(clientSocket){
    console.log('Notice: a user connected!');
    console.log(++socket.connections + ' connections')
    socket.io.emit('connections', socket.connections);

    clientSocket.on('disconnect', function() {
      console.log('Notice: a user disconnected!');
      console.log(--socket.connections + ' connections')
      socket.io.emit('connections', socket.connections);
    });

    _(socket.events).forEach(function(event) {

      // Make sure the event is valid
      if ((!event.server) || (!event.name)) return;

      // Add event for this client's socket
      clientSocket.on(event.name, function() {
        
        // Convert arguments to array
        var args = Array.prototype.slice.call(arguments);

        // Add socket as the last argument
        args.push(clientSocket);

        // Call the event's server method
        event.server.apply(server, args);

      });
    
    }).value();
  });

  return server.socket = socket;
}
