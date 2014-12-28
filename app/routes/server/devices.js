/* Homemaker Routes
 * -----------------------------
   /homemaker/devices
*/
var Promise = require('bluebird');
var http = new (require('http-transport'))();

var React = require('react');
var { Page, Device, DeviceList, Command, Gateway, GatewayList } = require('app/components');

module.exports = function(app) {
  var api = require('../api')(app);

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

  router.get('/homemaker/commands/:id', function(req, res) {

    api.get(req.url).then(function(state) {

      router.render(req, res, {
        title: 'Device Command', 
        state: state,
        body: <Command state={state}/>
      });

    }).catch(router.error.bind(router, res));

  });

  return router.express;
}
