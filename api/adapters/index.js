var _ = require('underscore');
var fs = require('fs');
var adapters = {}

// require all files in adapters directory (except this file)
_(fs.readdirSync(__dirname)).each(function(filename) {
  if ((filename !== _(__filename.split('/')).last()) && (filename !== 'adapter.js')) { 
    var adapter = require('./' + filename);
    adapters[adapter.name] = adapter;
  }
});

// Export this handy function
module.exports = function(gateway, responder) {

  // function(null) -> list all gateways types
  if (!gateway) {
    return _(adapters).keys();
  }

  // function(gateway) -> gateway doesn't exist
  if (!_(adapters).has(gateway)) {
    throw new Error('Missing adapter ' + gateway + ' not loaded');
  }

  // function(name, null) -> list all responder types for given gateway
  if (_.isNull(responder)) {
    return _(adapters[gateway].responders).keys();
  }

  // function(gateway) -> return given gateway
  if (_.isUndefined(responder)) {
    return adapters[gateway];
  }

  // function(gateway, responder) -> return responder for given gateway
  if (_(adapters[gateway].responders).has(responder)) {
    return adapters[gateway].responders[responder];

  // function(gateway, responder) -> responder doesn't exist
  } else {
    throw new Error('Adapter ' + gateway + ' responder ' + responder + ' does not exist');
  }

}
