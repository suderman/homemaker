var _ = require('underscore');
var Promise = require('bluebird/js/browser/bluebird');
var http = new (require('http-transport'))();

// req = { path:'', slugs:[], api:function(){} }
var routes = [];

routes.push({
  path: '/homemaker/gateways',

  get: function(req) {
    return Promise.props({
      gateways:  http.get(req.api('/gateways/all')).get('body'),
    });
  }

});

routes.push({
  path: '/homemaker/gateways/:id',

  get: function(req) {
    var id = req.slugs[3];
    return Promise.props({
      item:       http.get(req.api('/gateways/' + id)).get('body'),
      types:      http.get(req.api('/gateways/types')).get('body'),
      responders: http.get(req.api('/gateways/' + id + '/responders/all')).get('body')
    });
  },

  set: function(req, state) { 
    var id = req.slugs[3];
    http.put(req.api('/gateways/' + id), req.parse({
      name:     state.name,
      type:     state.type,
      host:     state.host,
      port:     state.port,
      username: state.username,
      password: state.password,
      active:   state.active
    }));
  },

  remove: function(req) {
    var id = req.slugs[3];
    return http.delete(req.api('/gateways/' + id));
  }
});

module.exports = routes;
