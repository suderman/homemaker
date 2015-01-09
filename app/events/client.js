var _ = require('lodash/dist/lodash.underscore');

module.exports = function(app) {
  var socket = app.socket;

  socket.on('invalidate', function(paths) {
    app.cache.invalidate(paths);
  });

  socket.on('invalidateAll', function() {
    app.cache.invalidateAll();
  });

  socket.on('invalidateAllExcept', function(paths) {
    app.cache.invalidateAllExcept(paths);
  });


  socket.on('json', function(path, state) {
    console.log('json received for ' + path);
    console.log(state)

    // If state is null, remove
    if (_.isNull(state)) {
      app.cache.invalidate(path);
      app.cache.remove(path);

    // Else, set item
    } else if (state) {
      app.cache.validate(path);
      app.cache.merge(path, state);

      // If this item is the current route, re-render now
      if (path == app.router.path()) {
        console.log('about to setState for ' + path)
        app.view.setState(state);
      }
    }
  });


  socket.on('redirect', function(path) {
    console.log('on redirect ' + path);
    app.router.go(path);
  });

}
