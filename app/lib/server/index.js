var _ = require('lodash'),
    Promise = require('bluebird');

var Server = function(express) {
  
  // Create router
  require('./router')(this, express.api)

  // Socket.io
  require('./socket')(this, express.httpServer);

};

// Promise props pass-thru
Server.prototype.props = function(props) {
  return Promise.props(props);
}

// // Expose the router's json method
// Server.prototype.json = function() {
//   return this.router.json.apply(this.router, arguments);
// }

module.exports = function(express) {
  return new Server(express);
}
