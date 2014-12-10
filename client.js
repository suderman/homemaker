// Make older browsers smarter
// require('es5-shim/es5-shim');
// require('es5-shim/es5-sham');
require('console-polyfill');
var Promise = require('bluebird/js/browser/bluebird');
var Agent = require('superagent-promise');

// React is used to render everything
var React = require('react');
React.initializeTouchEvents(true);

// Get routes
var Router = require('react-router'),
    routes = require('./components/routes');

// Render a component based on the current URL
Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.body);
});
