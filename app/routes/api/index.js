var _ = require('underscore');
module.exports = function(app) {

  var assembleReq = function(path) {
    path = (path) ? path.split('#')[0].replace(/\/+$/, '') : '/';
    return {
      path: path, 
      slugs: path.split('/'), 
      api: app.api 
    }
  }

  var routes = require('./routes'),
      regexSlash = /\//g,
      regexParam = /\:(\w+)/g;

  var matchRoute = function(path) {
    return _(routes).find(function(route) {
      var regex = '^' + route.path + '$';
      regex = regex.replace(regexSlash, '\/'); 
      regex = regex.replace(regexParam, '(.+)');
      return path.match(new RegExp(regex, 'i'));
    });
  };

  return {

    get: function(path) {
      var req = assembleReq(path);
      return matchRoute(req.path).get(req);
    },

    set: function(path, state) {
      var req = assembleReq(path);
      return matchRoute(req.path).set(req, state);
    }

  };
}