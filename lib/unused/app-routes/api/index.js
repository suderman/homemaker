var _ = require('underscore');
var Promise = require('bluebird/js/browser/bluebird');
module.exports = function(app) {

  var parseFields = function(fields) {
    _(fields).each(function(value, key) {
      if (fields[key] == 'null') fields[key] = null;
    });
    return fields;
  }

  var assembleReq = function(path, state) {
    path = (path) ? path.split('#')[0].replace(/\/+$/, '') : '/';

    // If state is an object, set
    // If state is undefined, get
    var method = 'SET';
    if (_.isUndefined(state)) method = 'GET';
    if (_.isNull(state)) method = 'REMOVE';

    return {
      path: path, 
      slugs: path.split('/'), 
      method: method,
      parse: parseFields,
      api: app.api
    }
  }

  var routes = require('./routes'),
      regexSlash = /\//g,
      regexParam = /\:(\w+)/g;

  var matchRoute = function(path) {
    var route = _(routes).find(function(route) {
      var regex = '^' + route.path + '$';
      regex = regex.replace(regexSlash, '\/'); 
      regex = regex.replace(regexParam, '(.+)');
      return path.match(new RegExp(regex, 'i'));
    });

    var reject = function() {
      return Promise.reject(new Error('No matching route'));
    }
    if (!route)        route = {}; 
    if (!route.get)    route.get = reject; 
    if (!route.set)    route.set = reject; 
    if (!route.remove) route.remove = reject; 
    return route;
  };

  return {

    json: function(path, state) {
      var req = assembleReq(path, state);
      // return matchRoute(req.path).sync(req, state);
      return matchRoute(req.path).json(req, state) || Promise.reject(new Error('No matching route for sync'));
    },

    get: function(path) {
      var req = assembleReq(path);
      return matchRoute(req.path).get(req);
    },

    set: function(path, state) {
      var req = assembleReq(path);
      return matchRoute(req.path).set(req, state);
    },

    remove: function(path) {
      var req = assembleReq(path);
      return matchRoute(req.path).remove(req);
    }

  };
}
