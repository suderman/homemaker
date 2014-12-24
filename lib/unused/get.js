var _ = require('underscore');
var Promise = require('bluebird/js/browser/bluebird');
var http = new (require('http-transport'))();


module.exports = function(app) {
  var api = app.api;
  var routes = {

    '/homemaker/devices': function(params) {
      return Promise.props({
        list: http.get(api('/devices/all')).get('body')
      });
    },

    '/homemaker/devices/:id': function(params) {
      return Promise.props({
        item: http.get(api('/devices/'+params.id)).get('body'),
        types: http.get(api('/responders/types')).get('body'),
        commands: http.get(api('/devices/'+params.id+'/commands')).get('body')
      });
    },

    '/': function(params, api) {
      return Promise.resolve({});
    }
  };

  return function(path, params) {
    path = path || '/';
    path = path.split('#')[0];
    if (!routes[path]) {
      return Promise.resolve({});
    } else {
      return routes[path](params);
    }
  }
}
