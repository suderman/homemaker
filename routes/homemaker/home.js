/* Homemaker Routes
 * -----------------------------
   /homemaker
*/
var Promise = require('bluebird');
var http = new (require('http-transport'))();

var React = require('react'),
    Page = require('components/Page'),
    DeviceList = require('components/DeviceList'),
    GatewayList = require('components/GatewayList');

module.exports = function(app) {

  // Define routes
  var router = require('lib/router/server')()

  // CATCH-ALL
  router.get(/^\/(.*)/, function(req, res) {
    var path = req.params[0];

    router.render(req, res, {
      title: 'Homemaker home ' + path,
      body: <Page/>
    });

  });

  return router;
};
