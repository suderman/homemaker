var Promise = require('bluebird');
var React = require('react');
var { Responder } = require('app/components');

var routes = [];

routes.push({
  path: '/homemaker/responders/:id',

  html: function(req, state) {
    return {
      title: 'Gateway Responder', 
      state: state,
      body: <Responder state={state}/>
    };
  },

  json: function(req, state) {
    var id = req.slugs[3];
    switch(req.method) {

      case 'GET':
        return Promise.props({
          item:     this.get('/responders/' + id),
          gateways: this.get('/gateways/'),
          isNew:    false
        });
        break;

      case 'SET':
        return this.put('/responders/' + id, {
          gateway_id: state.gateway_id,
          name:       state.name
        });
        break;

      case 'REMOVE':
        return this.delete('/responders/' + id);
        break;
    }
  }
});

module.exports = routes;
