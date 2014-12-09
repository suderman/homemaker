// Make older browsers smarter
require('es5-shim/es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');

var Promise = require('bluebird/js/browser/bluebird');
var Agent = require('superagent-promise');
var React = require('react');

var GatewayList = require('./components/GatewayList');

React.render(<GatewayList/>, document.getElementById('mount')) 

