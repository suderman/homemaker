var socket = io();

socket.on('newId', function(id) {
  var path = router.pathname();

  if (path.match('/commands/new$')=='/commands/new') { 
    router.go('/commands/' + id);
  } else if (path.match('/devices/new$')=='/devices/new') {
    router.go('/devices/' + id);
  } else if (path.match('/gateways/new$')=='/gateways/new') {
    router.go('/gateways/' + id);
  } else if (path.match('/responders/new$')=='/responders/new') {
    router.go('/responders/' + id);
  } else if (path.match('/nodes/new$')=='/nodes/new') {
    router.go('/nodes/' + id);
  } else if (path.match('/actions/new$')=='/actions/new') {
    router.go('/actions/' + id);
  } else if (path.match('/urls/new$')=='/urls/new') {
    router.go('/urls/' + id);
  } else if (path.match('/new$')=='/new') { 
    router.go([path.split('/new')[0], id].join('/'));
  }
});

socket.on('redirect', function(path) {
  console.log('on redirect ' + path);
  router.go(path);
});

global.socket = socket;
module.exports = socket;  
