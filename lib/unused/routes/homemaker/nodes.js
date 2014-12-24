/* Homemaker Routes
 * -----------------------------
   /homemaker/nodes
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
      list: [],
      types: []

    }).then(function(state) {

      router.render(req, res, {
        title: 'Nodes & Actions', 
        state: state,
        body: <Page state={state}/>
      });

    }).catch(router.error.bind(router, res));

  });

  return router;
};