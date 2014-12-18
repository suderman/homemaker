/* Homemaker Routes
 * -----------------------------
   /homemaker/gateways
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

  router.get('/', function(req, res) {

    Promise.props({
      list: http.get(app.localhost() + '/homemaker/api/gateways/all').get('body'),
      types: http.get(app.localhost() + '/homemaker/api/gateways/types').get('body')

    }).then(function(state) {

      router.render(req, res, {
        title: 'Gateways & Responders', 
        state: state,
        body: <GatewayList state={state}/>
      });

    }).catch(router.error.bind(router, res));

  });

  return router;
};
