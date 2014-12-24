/* Homemaker Routes
 * -----------------------------
   /homemaker/devices
*/
var Promise = require('bluebird');
var http = new (require('http-transport'))();

var React = require('react'),
    Page = require('app/components/Page'),
    Device = require('app/components/Device'),
    DeviceList = require('app/components/DeviceList'),
    Gateway = require('app/components/Gateway');
    GatewayList = require('app/components/GatewayList');
// var React = require('react');
// var { Page, DeviceList, Device, GatewayList, Gateway } = require('app/components');


module.exports = function(app) {
  var api = require('../api')(app);

  // function pathParams(req) {
  //   var ret = { 
  //     path: req.url, 
  //     // path: req.route.path, 
  //     params: req.params
  //   };
  //   if (ret.params.id) {
  //     ret.params.id = encodeURIComponent(ret.params.id);
  //   } 
  //   return ret;
  // }

  // Define routes
  var router = require('app/routes/server')();

  router.get('/homemaker/devices', function(req, res) {

    // var {path, params} = pathParams(req);
    api.get(req.url).then(function(state) {

      router.render(req, res, {
        title: 'Devices & Commands', 
        state: state,
        body: <DeviceList state={state}/>
      });

    }).catch(router.error.bind(router, res));

  });

  router.get('/homemaker/devices/:id', function(req, res) {

    // var {path, params} = pathParams(req);
    api.get(req.url).then(function(state) {

      router.render(req, res, {
        title: 'Device Commands', 
        state: state,
        body: <Device state={state}/>
      });

    }).catch(router.error.bind(router, res));

  });

  return router.express;
}
