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
          responders: this.router.get('/responders').then((responders) => {
                        return _(responders).map((responder) => {
                          responder.name = responder.title;
                          return responder;
                        }).sortBy((responder) => responder.name.toLowerCase()).value();
                      }),
          commands:   { 'Choose Command': [{ id: 'chooser', name: 'Choose Command' }]},
          isNew:      true
        });
        break;

      case 'SET':
        return this.router.post('/actions', {
          node_id:        state.node_id,
          name:           state.name,
          responder_id:   state.responder_id,
          command:        state.command,
          feedback:       state.feedback
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
          item:       this.router.get('/actions/' + id),
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

                      }).then((devices) => { 

                        var obj = {
                          'Choose Command': [{
                            id: 'chooser',
                            name: 'Choose Command'
                          }]
                        };

                        _(devices).forEach((commands, device) => {
                          obj[device] = _.map(commands, (command) => {
                            var id = JSON.stringify({name: command.name, command: command.command, feedback: command.feedback });
                            return { id: id, name: command.name };
                          });
                        });

                        return obj;
                      }),

          isNew:      false
        });
        break;

      case 'SET':
        return this.router.put('/actions/' + id, {
          node_id:      state.node_id,
          name:         state.name,
          responder_id: state.responder_id,
          command:      state.command,
          feedback:     state.feedback
        });
        break;

      case 'REMOVE':
        return this.router.delete('/actions/' + id);
        break;

    }
  }

});

module.exports = routes;
