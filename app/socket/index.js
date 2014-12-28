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
      api.set(path, state);
    });
  });
}
