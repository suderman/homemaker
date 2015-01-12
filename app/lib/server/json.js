// var _ = require('lodash/dist/lodash.underscore');
var _ = require('lodash');
var Promise = require('bluebird');
var http = new (require('http-transport'))();

var Json = function(router) {
  this.router = router;
  this.localhost = router.api;
};

Json.prototype.parseFields = function(fields) {
  _(fields).forEach(function(value, key) {
    if (!fields[key]) fields[key] = '';
    if (fields[key] === 'null') fields[key] = null;
  });
  return fields;
}

Json.prototype.matchRoute = function(path) {
  return _(this.router.routes).find(function(route) {
    return path.match(this.router.regex(route.path));
  }.bind(this));
}

Json.prototype.props = function(props) {
  return Promise.props(props);
}

Json.prototype.get = function(path) {
  return http.get(this.localhost + path).get('body');
}

Json.prototype.put = function(path, fields) {
  return http.put(this.localhost + path, this.parseFields(fields)).get('body');
}

Json.prototype.post = function(path, fields) {
  return http.post(this.localhost + path, this.parseFields(fields)).get('body');
}

Json.prototype.delete = function(path) {
  return http.delete(this.localhost + path);
}

module.exports = function(server) {

  // Create new Json object
  server.router.json = new Json(server.router);

  // Create new Json function
  return server.json = function(path, state) {
    var req = server.router.req(path, state);
    var route = server.router.json.matchRoute(req.path);

    if ((route) && (route.json)) {
      return route.json.call(server.router.json, req, state);
    } else {
      return Promise.reject(new Error('No matching json route: ' + path));
    }
  }
}
