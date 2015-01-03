var Promise = require('bluebird');
var React = require('react');
var { GatewayList, Gateway } = require('app/components');

var routes = [];

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
          item:       this.get('/gateways/' + id),
          types:      this.get('/gateways/types'),
          responders: this.get('/gateways/' + id + '/responders/all'),
          isNew:      false
        });
        break;

      case 'SET':
        return this.put('/gateways/' + id, {
          name:     state.name,
          type:     state.type,
          host:     state.host,
          port:     state.port,
          username: state.username,
          password: state.password,
          active:   state.active
        });
        break;

      case 'REMOVE':
        return this.delete('/gateways/' + id);
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
          gateways: this.get('/gateways/all'),
        });
        break;
    }
  }
});

module.exports = routes;
