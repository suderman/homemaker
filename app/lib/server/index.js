var _ = require('lodash'),
    Promise = require('bluebird');

var Server = function(apihost, http) {
  
  // Create router
  this.router = require('./router')(this, apihost);

  // Socket.io
  this.socket = require('./socket')(this, http);

};

// Promise props pass-thru
Server.prototype.props = function(props) {
  return Promise.props(props);
}

// // Expose the router's json method
// Server.prototype.json = function() {
//   return this.router.json.apply(this.router, arguments);
// }

module.exports = function(apihost, http) {
  return new Server(apihost, http);
}
