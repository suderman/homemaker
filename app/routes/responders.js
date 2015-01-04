var _ = require('underscore');
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
        return this.get('/responders/' + id).then(function(unknownStatusResponder) {
          return this.get('/gateways/' + unknownStatusResponder.gateway_id + '/responders/all').then(function(responders) {
            return {
              item:  _(responders).find(function(potentialResponder) {
                        return unknownStatusResponder.identity == potentialResponder.identity;
                     }),
              isNew: false
            };
          });
        }.bind(this));
        break;

      case 'SET':
        return this.put('/responders/' + id, {
          gateway_id: state.gateway_id,
          name:       state.name,
          address:    state.address,
          type:       state.type
        });
        break;

      case 'REMOVE':
        return this.delete('/responders/' + id);
        break;
    }
  }
});

module.exports = routes;
