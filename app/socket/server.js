module.exports = function(app, server) {
  var io = require('socket.io')(server);
  var api = require('../routes/api')(app);

  io.on('connection', function(socket){

    app.set('socket', socket);
    console.log('a user connected');

    socket.on('get', function(path) {
      console.log('get path: ' + path)

      api.get(path).then(function(state) {
        socket.emit('set', path, state);
      });

    });

    socket.on('set', function(path, state) {
      console.log('set path: ' + path)

      var promise = api.set(path, state);
      if (!promise) return;
      
      promise.then(function(json) {
        var body = JSON.parse(json);
        if (body.id) {
          socket.emit('newId', body.id);
        }
      });
    });

    socket.on('remove', function(path) {
      console.log('remove path: ' + path)
      api.remove(path);
      // var array = path.split('/'); array.pop();
      // socket.emit('redirect', array.join('/'));
    });

  });
}
