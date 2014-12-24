/* Homemaker Routes
 * -----------------------------
   /homemaker/nodes
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

  router.get('/homemaker/nodes', function(req, res) {

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

  return router.express;
};
