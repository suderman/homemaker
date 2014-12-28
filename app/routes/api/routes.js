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
  },

  set: function(req, state){}
});


routes.push({
  path: '/homemaker/gateways/:id',

  get: function(req) {
    var id = req.slugs[3];
    return Promise.props({
      gateway:    http.get(req.api('/gateways/' + id)).get('body'),
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
  }

});


routes.push({
  path: '/homemaker/devices',

  get: function(req) {
    return Promise.props({
      devices:  http.get(req.api('/devices/all')).get('body')
    });
  },

  set: function(req, state){}
});


routes.push({
  path: '/homemaker/devices/:id',

  get: function(req) {
    var id = req.slugs[3];
    return Promise.props({
      device:   http.get(req.api('/devices/' + id)).get('body'),
      types:    http.get(req.api('/responders/types')).get('body'),
      commands: http.get(req.api('/devices/' + id + '/commands')).get('body')
    });
  },

  set: function(req, state) { 
    var id = req.slugs[3];
    http.put(req.api('/devices/' + id), req.parse({
      name:            state.name,
      responder_type:  state.responder_type
    }));
  }

  // client: function (id) {
  //   router.render(<Device id={id}/>);
  // },
  //
  // server: function(req, res, api) {
  //   api.get(req.url).then(function(state) {
  //     router.render(req, res, {
  //       title: 'Device Commands', 
  //       state: state,
  //       body: <Device state={state}/>
  //     });
  //   }).catch(router.error.bind(router, res));
  // }

});


routes.push({
  path: '/homemaker/commands/:id',

  get: function(req) {
    var id = req.slugs[3];
    return Promise.props({
      command:   http.get(req.api('/commands/' + id)).get('body'),
      devices:   http.get(req.api('/devices')).get('body')
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
  }

});

routes.push({
  path: '/homemaker/anything',

  get: function(req){},
  set: function(req, state){}
});

module.exports = routes;
