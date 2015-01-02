var _ = require('underscore');
module.exports = function(app, server) {
  var io = require('socket.io')(server);
  var json = app.get('json');

  io.on('connection', function(socket){

    app.set('socket', socket);
    console.log('a user connected');

    socket.on('json', function(path, stateForServer) {

      // Get method, send the new state back to the client
      if (_.isUndefined(stateForServer)) {

        json(path).then(function(stateForClient) {
          socket.emit('json', path, stateForClient);
        }).catch(function(error) { console.log(error); });

      // Set/remove method, send the new state back to the client
      } else {

        json(path, stateForServer).then(function(stateForClient) {
          var body = JSON.parse(stateForClient);
          if (body.id) socket.emit('newId', body.id);
        }).catch(function(error) { console.log(error); });
      
      }
    });

  });
}
