var Promise = require('bluebird');
var _ = require('lodash');
var React = require('react');
var { GatewayList, Gateway } = require('app/components');

var routes = [];

routes.push({
  path: '/homemaker/gateways/new',

  html: function(req, state) {
    return {
      title: 'Gateway Device', 
      state: state,
      body: <Gateway state={state}/>
    };
  },

  json: function(req, state) {
    switch(req.method) {

      case 'GET':
        return Promise.props({
          item:       { type: 'HTTP' },
          types:      this.router.get('/gateways/types'),
          responders: [],
          isNew:      true
        });
        break;

      case 'SET':
        return this.router.post('/gateways', {
          name:      state.name,
          type:      state.type,
          host:      state.host,
          port:      state.port,
          username:  state.username,
          password:  state.password
        },{
          _redirect: '/homemaker/gateways/:id'
        });
        break;
    }
  }
});


routes.push({
  path: '/homemaker/gateways/:id',

  html: function(req, state) {
    return {
      title: 'Gateway Responders', 
      state: state,
      body: <Gateway state={state}/>
    }
  },

  json: function(req, state) {
    var id = req.slugs[3];
    switch(req.method) {

      case 'GET':
        return Promise.props({
          item:       this.router.get('/gateways/' + id),
          types:      this.router.get('/gateways/types'),
          responders: this.router.get('/gateways/' + id + '/responders/all'),
          isNew:      false
        });
        break;

      case 'SET':
        return this.router.put('/gateways/' + id, {
          name:     state.name,
          type:     state.type,
          host:     state.host,
          port:     state.port,
          username: state.username,
          password: state.password
        });
        break;

      case 'REMOVE':
        return this.router.delete('/gateways/' + id);
        break;
    }
  }

});


routes.push({
  path: '/homemaker/gateways',

  html: function(req, state) {
    return {
      title: 'Gatways & Responders', 
      state: state,
      body: <GatewayList state={state}/>
    };
  },

  json: function(req, state) {
    switch(req.method) {
      case 'GET':
        return Promise.props({
          gateways: this.router.get('/gateways/all'),
        });
        break;
    }
  }
});

module.exports = routes;
