/* Homemaker Routes
 * -----------------------------
   /homemaker/devices
*/
var Promise = require('bluebird');
var http = new (require('http-transport'))();

var React = require('react'),
    Page = require('app/components/Page'),
    DeviceList = require('app/components/DeviceList'),
    GatewayList = require('app/components/GatewayList');

module.exports = function(app) {

  // Define routes
  var router = require('lib/router/server')();

  router.get('/', function(req, res) {

    Promise.props({
      list: http.get(app.api('/devices/all')).get('body'),
      types: http.get(app.api('/responders/types')).get('body')

    }).then(function(state) {

      router.render(req, res, {
        title: 'Devices & Commands', 
        state: state,
        body: <DeviceList state={state}/>
      });

    }).catch(router.error.bind(router, res));

  });

  return router;
};
