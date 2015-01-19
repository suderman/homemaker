var _ = require('lodash');
var Promise = require('bluebird');
var React = require('react');
var Action = require('app/components/Action');

var routes = [];

routes.push({
  path: '/homemaker/nodes/:id/actions/new',

  html: function(req, state) {
    return {
      title: 'New Action', 
      state: state,
      body: <Action state={state}/>
    };
  },

  json: function(req, state) {
    var id = req.slugs[3];
    switch(req.method) {

      case 'GET':
        return Promise.props({
          item:       { node_id: id },
          nodeTree:   this.router.get('/nodes/tree'),
          allNodes:   this.router.get('/nodes/all'),
          responders: this.router.get('/responders'),
          commands:   [],
          isNew:      true
        });
        break;

      case 'SET':
        return this.router.post('/action', {
          node_id:             state.node_id,
          name:                state.name,
          responder_id:        state.responder_id,
          command_id:          state.command_id,
          custom_command:      state.custom_command,
          custom_feedback:     state.custom_feedback
        },{
          _redirect: '/homemaker/actions/:id'
        });
        break;
    }
  }
});


routes.push({
  path: '/homemaker/actions/:id',

  html: function(req, state) {
    return {
      title: 'Actions', 
      state: state,
      body: <Action state={state}/>
    }
  },

  json: function(req, state) {
    var id = req.slugs[3];
    switch(req.method) {

      case 'GET':
        return Promise.props({
          item:       { node_id: id },
          nodeTree:   this.router.get('/nodes/tree'),
          allNodes:   this.router.get('/nodes/all'),
          responders: this.router.get('/responders').then((responders) => {
                        return _(responders).map((responder) => {
                          responder.name = responder.title;
                          return responder;
                        }).sortBy((responder) => responder.name.toLowerCase()).value();
                      }),
          commands:   this.router.get('/actions/' + id).then((action) => {
                        return (!action.responder_id) ? [] : this.router.get('/responders/' + action.responder_id + '/commands');
                      }),
          isNew:      false
        });
        break;

      case 'SET':
        return this.router.put('/action/' + id, {
          node_id:             state.node_id,
          name:                state.name,
          responder_id:        state.responder_id,
          command_id:          state.command_id,
          custom_command:      state.custom_command,
          custom_feedback:     state.custom_feedback
        });
        break;

      case 'REMOVE':
        return this.router.delete('/actions/' + id);
        break;

    }
  }

});

module.exports = routes;
