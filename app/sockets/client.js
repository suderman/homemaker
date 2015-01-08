var _ = require('underscore');
var socket = io();

/* 
socket.on('newId', function(id) {
  var path = app.pathname();
  
  // Only redirect when current only a '/new' path
  if (path.match('/new$')!='/new')  return

  // Every path starts with this
  var newPath = '/homemaker';

  if (path.match('/commands/new$')=='/commands/new') { 
    newPath += '/commands/' + id;
  } else if (path.match('/devices/new$')=='/devices/new') {
    newPath += '/devices/' + id;
  } else if (path.match('/gateways/new$')=='/gateways/new') {
    newPath += '/gateways/' + id;
  } else if (path.match('/responders/new$')=='/responders/new') {
    newPath += '/responders/' + id;
  } else if (path.match('/nodes/new$')=='/nodes/new') {
    newPath += '/nodes/' + id;
  } else if (path.match('/actions/new$')=='/actions/new') {
    newPath += '/actions/' + id;
  } else if (path.match('/urls/new$')=='/urls/new') {
    newPath += '/urls/' + id;
  } else if (path.match('/new$')=='/new') { 
    newPath = [path.split('/new')[0], id].join('/');
  }

  // Redirect to the new path and send a GET request
  app.go(newPath);
  // socket.emit('json', newPath);
});
*/

socket.on('invalidate', function(paths) {
  console.log('invalidate ' + paths);
  _(paths).each(function(path) {
    app.upToDate[path] = false;
  });
});

socket.on('invalidateAll', function() {
  console.log('invalidate all');
  app.upToDate = null;
  app.upToDate = {};
});

socket.on('invalidateAllExcept', function(paths) {
  console.log('invalidate all except ' + paths);
  app.upToDate = null;
  app.upToDate = {};
  _(paths).each(function(path) {
    app.upToDate[path] = true;
  });
});


socket.on('json', function(path, state) {
  console.log('json received for ' + path);
  console.log(state)

  // If state is null, remove
  if (_.isNull(state)) {
    app.upToDate[path] = false;
    app.removeItem(path);

  // Else, set item
  } else if (state) {
    app.upToDate[path] = true;
    app.mergeItem(path, state);

    // If this item is the current route, re-render now
    if (path == app.pathname()) {
      console.log('about to setState for ' + path)
      app.setState(state);
    }
  }
});


socket.on('redirect', function(path) {
  console.log('on redirect ' + path);
  app.go(path);
});

module.exports = socket;  
