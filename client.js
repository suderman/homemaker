// var Promise = require('bluebird');
// var request = require('request-promise');

// Make older browsers smarter
require('es5-shim/es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');

var request = require('superagent'),
    React = require('react'),
    GatewayList = require('./components/GatewayList'),
    _ = require('underscore');

var client = { name: 'homemaker' };
global.client = client;
global._ = _;

React.render(<GatewayList/>, document.getElementById('mount')) 

// console.log('client code!!');
// request.get('/homemaker/api/gateways').end(function(res) {
//   console.log('requested');
//   console.log(res.body);
//   React.render(<Gateways url="/homemaker/api/gateways" collection={res.body}/>, document.getElementById('mount')) 
// });

// document.body.onclick = function() {
//   request.get('/homemaker/api/gateways/all').end(function(res) {
//     React.render(<Gateways collection={res.body}/>, document.getElementById('mount')) 
//   });
// }

