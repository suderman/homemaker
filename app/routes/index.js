var routes = [];
routes = routes.concat(require('./home'));
routes = routes.concat(require('./gateways'));
routes = routes.concat(require('./commands'));
routes = routes.concat(require('./devices'));

// List all routes in order
routes.forEach(function(route) {
  console.log(route.path);
});

module.exports = routes;
