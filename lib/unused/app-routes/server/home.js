/* Homemaker Routes
 * -----------------------------
   /homemaker
*/
var Promise = require('bluebird');
var http = new (require('http-transport'))();

var React = require('react'),
    Page = require('app/components/Page'),
    DeviceList = require('app/components/DeviceList'),
    GatewayList = require('app/components/GatewayList');

module.exports = function(app) {

  // Define routes
  var router = require('app/routes/server')();

  // CATCH-ALL
  router.get(/^\/homemaker(.*)/, function(req, res) {
    var path = req.params[0];

    router.render(req, res, {
      title: 'Homemaker home ' + path,
      body: <Page/>
    });

  });

  return router.express;
};
