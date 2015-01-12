var _ = require('lodash'),
    Promise = require('bluebird');

var Server = function(localhostAPI, httpServer) {
  
  // Create router
  this.router = require('./router')(this, localhostAPI);

  // Socket.io
  this.socket = require('./socket')(this, httpServer);

};

// Promise props pass-thru
Server.prototype.props = function(props) {
  return Promise.props(props);
}

// // Expose the router's json method
// Server.prototype.json = function() {
//   return this.router.json.apply(this.router, arguments);
// }

module.exports = function(localhostAPI, httpServer) {
  return new Server(localhostAPI, httpServer);
}
