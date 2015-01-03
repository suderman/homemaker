var Promise = require('bluebird');
var React = require('react');
var { DeviceList, Device } = require('app/components');

var routes = [];

routes.push({
  path: '/homemaker/devices/new',

  html: function(req, state) {
    return {
      title: 'New Device', 
      state: state,
      body: <Device state={state}/>
    };
  },

  json: function(req, state) {
    switch(req.method) {

      case 'GET':
        return Promise.props({
          item:     { responder_type: 'HTTP Server' },
          types:    this.get('/responders/types'),
          commands: [],
          isNew:    true
        });
        break;

      case 'SET':
        return this.post('/devices', {
          name:            state.name,
          responder_type:  state.responder_type
        });
        break;
    }
  }
});


routes.push({
  path: '/homemaker/devices/:id',

  html: function(req, state) {
    return {
      title: 'Device Commands', 
      state: state,
      body: <Device state={state}/>
    }
  },

  json: function(req, state) {
    var id = req.slugs[3];
    switch(req.method) {

      case 'GET':
        return Promise.props({
          item:     this.get('/devices/' + id),
          types:    this.get('/responders/types'),
          commands: this.get('/devices/' + id + '/commands'),
          isNew:    false
        });
        break;

      case 'SET':
        return this.put('/devices/' + id, {
          name:            state.name,
          responder_type:  state.responder_type
        });
        break;

      case 'REMOVE':
        return this.delete('/devices/' + id);
        break;

    }
  }

});

routes.push({
  path: '/homemaker/devices',

  html: function(req, state) {
    return {
      title: 'Devices & Commands', 
      state: state,
      body: <DeviceList state={state}/>
    };
  },

  json: function(req, state) {
    switch(req.method) {
      case 'GET':
        return Promise.props({
          devices:  this.get('/devices/all')
        });
        break;
    }
  }

});

module.exports = routes;
