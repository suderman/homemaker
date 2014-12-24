var _ = require('underscore');
var Promise = require('bluebird/js/browser/bluebird');
var http = new (require('http-transport'))();

// req = { path:'', slugs:[], api:function(){} }
var routes = [];

routes.push({
  path: '/homemaker/devices',

  get: function(req) {
    return Promise.props({
      list:     http.get(req.api('/devices/all')).get('body')
    });
  },

  set: function(req, state){}
});


routes.push({
  path: '/homemaker/devices/:id',

  get: function(req) {
    var id = req.slugs[3];
    return Promise.props({
      item:     http.get(req.api('/devices/' + id)).get('body'),
      types:    http.get(req.api('/responders/types')).get('body'),
      commands: http.get(req.api('/devices/' + id + '/commands')).get('body')
    });
  },

  set: function(req, state){}
});


routes.push({
  path: '/homemaker/anything',

  get: function(req){},
  set: function(req, state){}
});

module.exports = routes;
