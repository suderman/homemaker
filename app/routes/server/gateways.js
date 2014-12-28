/* Homemaker Routes
 * -----------------------------
   /homemaker/gateways
*/
var Promise = require('bluebird');
var http = new (require('http-transport'))();

var React = require('react');
var { Page, Device, DeviceList, Command, Gateway, GatewayList } = require('app/components');

module.exports = function(app) {
  var api = require('../api')(app);

  // Define routes
  var router = require('app/routes/server')();

  router.get('/homemaker/gateways', function(req, res) {
    api.get(req.url).then(function(state) {

      router.render(req, res, {
        title: 'Gateways & Responders', 
        state: state,
        body: <GatewayList state={state}/>
      });

    }).catch(router.error.bind(router, res));
  });

  router.get('/homemaker/gateways/:id', function(req, res) {
    api.get(req.url).then(function(state) {

      router.render(req, res, {
        title: 'Gateway Responders', 
        state: state,
        body: <Gateway state={state}/>
      });

    }).catch(router.error.bind(router, res));

  });

  return router.express;
};
