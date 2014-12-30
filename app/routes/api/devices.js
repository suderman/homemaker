var _ = require('underscore');
var Promise = require('bluebird/js/browser/bluebird');
var http = new (require('http-transport'))();

// req = { path:'', slugs:[], api:function(){} }
var routes = [];

routes.push({
  path: '/homemaker/devices',

  get: function(req) {
    return Promise.props({
      devices:  http.get(req.api('/devices/all')).get('body')
    });
  }

});

routes.push({
  path: '/homemaker/devices/new',

  get: function(req) {
    return Promise.props({
      item:     { responder_type: 'HTTP Server' },
      types:    http.get(req.api('/responders/types')).get('body'),
      commands: [],
      isNew:    true
    });
  },

  set: function(req, state) { 
    return http.post(req.api('/devices'), req.parse({
      name:            state.name,
      responder_type:  state.responder_type
    })).get('body');
  }

});

routes.push({
  path: '/homemaker/devices/:id/commands/new',

  get: function(req) {
    console.log('commands/new')
    var id = req.slugs[3];
    return Promise.props({
      item:     { device_id: id },
      devices:  http.get(req.api('/devices')).get('body'),
      isNew:    true
    });
  },

  set: function(req, item) { 
    return http.post(req.api('/commands'), req.parse({
      name:       item.name,
      device_id:  item.device_id,
      feedback:   item.feedback,
      command:    item.command
    })).get('body');
  }

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

  set: function(req, state) { 
    var id = req.slugs[3];
    return http.put(req.api('/devices/' + id), req.parse({
      name:            state.name,
      responder_type:  state.responder_type
    }));
  },

  remove: function(req) {
    var id = req.slugs[3];
    return http.delete(req.api('/devices/' + id));
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

module.exports = routes;
