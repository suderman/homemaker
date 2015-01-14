var _ = require('lodash');
var events = [];

events.push({
  name: 'json',

  browser: function(path, state, socket) {

    // Deal with GET requests, where the state is undefined, 
    // which puts the socket in the second argument position
    if (!socket) [socket, state] = [state, undefined];

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
    if (!socket) [socket, state] = [state, undefined];

    switch (require('app/lib/util').method(state)) {

      // Get method, send the new state back to the client
      case 'GET':
        this.router.json(path).then((stateForClient) => {
          socket.emit('json', path, stateForClient);
        }).catch((err) => console.log(err));
        break;

      // Set method, send the new state back to the client
      case 'SET':
        this.router.json(path, state).then((item) => {

          // TODO: emit state for all other paths changed by this update
          // For now just invalidating all routes
          this.socket.io.emit('invalidateAllExcept', [path]);

          // Remove redirect from item
          var redirect = item._redirect;
          delete item._redirect;

          // Update everybody's localstorage
          socket.broadcast.emit('json', path, { item: item });

          // Check for _redirect instructions
          if (_.isString(redirect)) {

            // Replace all :colon slugs with value in item
            redirect = redirect.split('/').map((slug) => {
              let [ colon, key ] = slug.split(':');
              return item[key] || slug;
            }).join('/');

            // Send redirect to client
            socket.emit('redirect', redirect);
          }

        }).catch((err) => console.log(err));
        break;

      // Remove method
      case 'REMOVE':

        // TODO: emit state for all other paths changed by this update
        // For now just invalidating all routes
        this.socket.io.emit('invalidateAll');

        // Remove on client-side
        this.router.json(path, null).catch((err) => console.log(err));
        break;
    }
  }
});

module.exports = events;
