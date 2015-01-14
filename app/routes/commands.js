var Promise = require('bluebird');
var React = require('react');
var { Command } = require('app/components');

var routes = [];

routes.push({
  path: '/homemaker/devices/:id/commands/new',

  html: function(req, state) {
    return {
      title: 'New Command', 
      state: state,
      body: <Command state={state}/>
    };
  },

  json: function(req, state) {
    var id = req.slugs[3];
    switch(req.method) {

      case 'GET':
        return Promise.props({
          item:     { device_id: id },
          devices:  this.router.get('/devices'),
          isNew:    true
        });
        break;

      case 'SET':
        return this.router.post('/commands', {
          name:       state.name,
          device_id:  state.device_id,
          feedback:   state.feedback,
          command:    state.command
        },{
          _redirect: '/homemaker/commands/:id'
        });
        break;
    }
  }
});


routes.push({
  path: '/homemaker/commands/:id',

  html: function(req, state) {
    return {
      title: 'Device Command', 
      state: state,
      body: <Command state={state}/>
    };
  },

  json: function(req, state) {
    var id = req.slugs[3];
    switch(req.method) {

      case 'GET':
        return Promise.props({
          item:     this.router.get('/commands/' + id),
          devices:  this.router.get('/devices'),
          isNew:    false
        });
        break;

      case 'SET':
        return this.router.put('/commands/' + id, {
          device_id: state.device_id,
          name:      state.name,
          feedback:  state.feedback,
          command:   state.command
        });
        break;

      case 'REMOVE':
        return this.router.delete('/commands/' + id);
        break;
    }
  }
});

module.exports = routes;
