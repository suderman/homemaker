var _ = require('lodash/dist/lodash.underscore');
module.exports = function(app, server) {
  var io = require('socket.io')(server);
  var json = app.get('json');

  var numberOfConnections = 0;

  io.on('connection', function(socket){
    console.log('Notice: a user connected!');
    console.log(++numberOfConnections + ' connections')

    socket.on('disconnect', function() {
      console.log('Notice: a user disconnected!');
      console.log(--numberOfConnections + ' connections')
      // console.log(io.sockets.clients())
    });

    socket.on('json', function(path, stateForServer) {

      // Get method, send the new state back to the client
      if (_.isUndefined(stateForServer)) {
        get(path, socket);

      // Remove method
      } else if (_.isNull(stateForServer)) {
        remove(path, socket);

      // Set method, send the new state back to the client
      } else {
        set(path, socket, stateForServer);
      }
    });
  });


  // Methods
  // -------
  
  var get = function(path, socket) {
    json(path).then(function(stateForClient) {
      socket.emit('json', path, stateForClient);
    }).catch(function(error) { console.log(error); });
  };


  var set = function(path, socket, stateForServer) {
    json(path, stateForServer).then(function(stateForClient) {

      // TODO: emit state for all other paths changed by this update
      // For now just invalidating all routes
      // io.emit('invalidateAll');
      io.emit('invalidateAllExcept', [path]);
      // get(path, socket);

      var body = JSON.parse(stateForClient);
      socket.broadcast.emit('json', path, { item: body });
      if (body.id) redirectNew(path, socket, body.id);

    }).catch(function(error) { console.log(error); });
  };


  var remove = function(path, socket) {

    // TODO: emit state for all other paths changed by this update
    // For now just invalidating all routes
    io.emit('invalidateAll');

    json(path, null).then(function() {
      // Nothing here
    }).catch(function(error) { console.log(error); });
  };


  var redirectNew = function(path, socket, id) {

    function pathEndsWith(pattern) { 
      return path.match(pattern+'$')==pattern;
    }

    // Only redirect when current only a '/new' path
    if (!pathEndsWith('/new')) return;

    // Every path starts with this
    var newPath = '/homemaker';

    if      (pathEndsWith('/commands/new'))   newPath += '/commands/'   + id; 
    else if (pathEndsWith('/devices/new'))    newPath += '/devices/'    + id; 
    else if (pathEndsWith('/gateways/new'))   newPath += '/gateways/'   + id; 
    else if (pathEndsWith('/responders/new')) newPath += '/responders/' + id; 
    else if (pathEndsWith('/nodes/new'))      newPath += '/nodes/'      + id; 
    else if (pathEndsWith('/actions/new'))    newPath += '/actions/'    + id; 
    else if (pathEndsWith('/urls/new'))       newPath += '/urls/'       + id; 
    else if (pathEndsWith('/new'))            newPath = [path.split('/new')[0], id].join('/');

    socket.emit('redirect', newPath);
  }
}
