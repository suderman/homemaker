var socket = io();

socket.on('newId', function(id) {
  var path = router.pathname();
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

  router.go(newPath);
  socket.emit('json', newPath);

});

socket.on('redirect', function(path) {
  console.log('on redirect ' + path);
  router.go(path);
});

global.socket = socket;
module.exports = socket;  
