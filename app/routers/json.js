var _ = require('underscore');
var Promise = require('bluebird');
var http = new (require('http-transport'))();
var util = require('./util');

var Router = function(localhost) {
  this.localhost = localhost;
};

Router.prototype.parseFields = function(fields) {
  _(fields).each(function(value, key) {
    if (!fields[key]) fields[key] = '';
    if (fields[key] === 'null') fields[key] = null;
  });
  return fields;
}

Router.prototype.matchRoute = function(path) {
  return _(util.routes).find(function(route) {
    return path.match(util.regex(route.path));
  });
}

Router.prototype.props = function(props) {
  return Promise.props(props);
}

Router.prototype.get = function(path) {
  return http.get(this.localhost + path).get('body');
}

Router.prototype.put = function(path, fields) {
  return http.put(this.localhost + path, this.parseFields(fields)).get('body');
}

Router.prototype.post = function(path, fields) {
  return http.post(this.localhost + path, this.parseFields(fields)).get('body');
}

Router.prototype.delete = function(path) {
  return http.delete(this.localhost + path);
}

module.exports = function(app, localhost) {
  var router = new Router(localhost);

  var json = function(path, state) {
    var req = util.req(path, state);
    var route = router.matchRoute(req.path);

    if ((route) && (route.json)) {
      return route.json.call(router, req, state);
    } else {
      return Promise.reject(new Error('No matching json route: ' + path));
    }
  }

  // Set and return
  app.set('json', json);
  return json;
}
