module.exports = function(app) {
  var io = global.io();

  app.socket = {
    io: io,

    on: function() {
      return io.on.apply(io, arguments);
    },

    emit: function() {
      return io.emit.apply(io, arguments);
    },

  };

  require('app/events/client')(app);
  return app.socket;
}
