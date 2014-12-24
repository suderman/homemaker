/* Homemaker Routes
 * -----------------------------
   /homemaker
*/
var Promise = require('bluebird');
var http = new (require('http-transport'))();

var React = require('react'),
    Page = require('../../components/Page'),
    DeviceList = require('../../components/DeviceList'),
    GatewayList = require('../../components/GatewayList');

module.exports = function(app) {

  // Define routes
  var router = require('lib/router')();
  return router

  // GET home page
  .get('/homemaker', function(req, res) {

    router.render(req, res, {
      title: 'Homemaker home page', 
      params: {},
      body: <Page/>
    });

  })

  // CATCH-ALL
  .get('/homemaker/jon', function(req, res) {
    var path = '/homemaker/' + req.params[0];

    router.render(req, res, {
      title: 'Homemaker ' + path,
      body: <Page/>
    });

  })

  .get('/homemaker/nodes', function(req, res) {

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

  })

  // router.on('/gateways', function () {
  //   var params = { 
  //     pathname: '/homemaker/gateways', 
  //     title: 'Gateways & Responders' 
  //   };
  //   router.render(<GatewayList/>, params);
  // });

  .get('/homemakers/gateways', function(req, res) {

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

  })


  .get('/homemaker/devices', function(req, res) {

    Promise.props({
      list: http.get(app.localhost() + '/homemaker/api/devices/all').get('body'),
      types: http.get(app.localhost() + '/homemaker/api/responders/types').get('body')

    }).then(function(state) {

      router.render(req, res, {
        title: 'Devices & Commands', 
        state: state,
        body: <DeviceList state={state}/>
      });

    }).catch(router.error.bind(router, res));

  })

  // // CATCH-ALL
  // .get(/^\/(.+)/, function(req, res) {
  //   var path = '/homemaker/' + req.params[0];
  //
  //   router.render(req, res, {
  //     title: 'Homemaker ' + path,
  //     body: <Page/>
  //   });
  //
  // })
};