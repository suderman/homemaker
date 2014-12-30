var routes = [];
routes = routes.concat(require('./gateways'));
routes = routes.concat(require('./devices'));
routes = routes.concat(require('./commands'));
module.exports = routes;
