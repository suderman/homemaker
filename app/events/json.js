var _ = require('lodash');
var events = [];

events.push({
  name: 'json',

  browser: function(path, state, socket) {

    // Deal with GET requests, where the state is undefined, 
    // which puts the socket in the second argument position
    if (!socket) {
      socket = state;
      state = undefined;
    }

    console.log('json received for ' + path);
    console.log(state)

    switch (require('app/lib/util').method(state)) {

      // Else, set item
      case 'SET':
        this.cache.merge(path, state);

        // If this item is the current route, re-render now
        if (path == this.router.path()) {
          console.log('about to setState for ' + path)
          this.view.setState(state);
        }
        break;

      // If state is null, remove
      case 'REMOVE':
        this.cache.remove(path);
        break;
    }
  },

  server: function(path, state, socket) {

    // Deal with GET requests, where the state is undefined, 
    // which puts the socket in the second argument position
    if (!socket) {
      socket = state;
      state = undefined;
    }

    switch (require('app/lib/util').method(state)) {

      // Get method, send the new state back to the client
      case 'GET':
        this.router.json(path).then(function(stateForClient) {
          socket.emit('json', path, stateForClient);
        }).catch(function(error) { console.log(error); });
        break;

      // Set method, send the new state back to the client
      case 'SET':
        this.router.json(path, state).then(function(stateForClient) {

          // TODO: emit state for all other paths changed by this update
          // For now just invalidating all routes
          this.socket.io.emit('invalidateAllExcept', [path]);

          var body = JSON.parse(stateForClient);
          socket.broadcast.emit('json', path, { item: body });

          if (!body.id) return;
          var newPath = redirectFrom(path, body.id);
          if (newPath) {
            socket.emit('redirect', newPath);
          }

        }.bind(this)).catch(function(error) { console.log(error); });
        break;

      // Remove method
      case 'REMOVE':

        // TODO: emit state for all other paths changed by this update
        // For now just invalidating all routes
        this.socket.io.emit('invalidateAll');

        // Remove on client-side
        this.router.json(path, null).catch(function(error) { console.log(error); });
        break;
    }
  }
});


function redirectFrom(path, id) {
  var pathEndsWith = function(pattern) { return path.match(pattern+'$')==pattern; }

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

  return newPath;
}


module.exports = events;
