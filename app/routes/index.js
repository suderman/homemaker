var routes = [];
routes = routes.concat(require('./responders'));
routes = routes.concat(require('./gateways'));
routes = routes.concat(require('./commands'));
routes = routes.concat(require('./devices'));
routes = routes.concat(require('./actions'));
routes = routes.concat(require('./nodes'));
routes = routes.concat(require('./home'));

// // List all routes in order
// routes.forEach(function(route) {
//   console.log('Route: ' + route.path);
// });

module.exports = routes;
