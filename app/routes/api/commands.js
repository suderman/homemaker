var _ = require('underscore');
var Promise = require('bluebird/js/browser/bluebird');
var http = new (require('http-transport'))();

// req = { path:'', slugs:[], api:function(){} }
var routes = [];

routes.push({
  path: '/homemaker/commands/:id',

  get: function(req) {
    var id = req.slugs[3];
    return Promise.props({
      item:     http.get(req.api('/commands/' + id)).get('body'),
      devices:  http.get(req.api('/devices')).get('body'),
      isNew:    false
    });
  },

  set: function(req, state) { 
    var id = req.slugs[3];
    var fields = req.parse({
      device_id: state.device_id,
      name:      state.name,
      feedback:  state.feedback,
      command:   state.command
    });
    http.put(req.api('/commands/' + id), fields);
  },

  remove: function(req) {
    var id = req.slugs[3];
    return http.delete(req.api('/commands/' + id));
  }

});

module.exports = routes;
