var _ = require('lodash/dist/lodash.underscore');

var protocols = {
  tcp: require('./tcp'),
  http: require('./http'),
  https: require('./http') // same code
}

// Export this handy function
module.exports = function(protocol) {

  // function(null) -> list all protocol types
  if (!protocol) {
    return _(protocols).keys();
  }

  // function(protocol) -> protocol doesn't exist
  if (!_(protocols).has(protocol)) {
    throw new Error('Missing protocol ' + protocol + ' not loaded');

  // function(protocol) -> return given protocol
  } else {
    return protocols[protocol];
  }
}
