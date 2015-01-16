var Promise = require('bluebird');
var React = require('react');
var N0deListRoot = require('app/components/NodeListRoot'),
    N0de = require('app/components/Node');

var routes = [];

routes.push({
  path: '/homemaker/nodes/new',

  html: function(req, state) {
    return {
      title: 'New Node', 
      state: state,
      body: <N0de state={state}/>
    };
  },

  json: function(req, state) {
    switch(req.method) {

      case 'GET':
        return Promise.props({
          item:       {},
          nodes:      [],
          nodeTree:   this.router.get('/nodes/tree'),
          allNodes:   this.router.get('/nodes/all'),
          actions:    this.router.get('/actions'),
          responders: this.router.get('/responders'),
          isNew:      true
        });
        break;

      case 'SET':
        return this.router.post('/nodes', {
          node_id:             state.node_id,
          name:                state.name,
          status:              state.status,
          status_responder_id: state.status_responder_id,
          last_action_id:      state.last_action_id
        },{
          _redirect: '/homemaker/nodes/:id'
        });
        break;
    }
  }
});


routes.push({
  path: '/homemaker/nodes/:id',

  html: function(req, state) {
    return {
      title: 'Nodes & Actions', 
      state: state,
      body: <N0de state={state}/>
    }
  },

  json: function(req, state) {
    var id = req.slugs[3];
    switch(req.method) {

      case 'GET':
        return Promise.props({
          item:       this.router.get('/nodes/' + id),
          nodes:      this.router.get('/nodes/' + id + '/nodes'),
          nodeTree:   this.router.get('/nodes/tree'),
          allNodes:   this.router.get('/nodes/all'),
          actions:    this.router.get('/actions'),
          responders: this.router.get('/responders'),
          isNew:      false
        });
        break;

      case 'SET':
        return this.router.put('/nodes/' + id, {
          node_id:             state.node_id,
          name:                state.name,
          status:              state.status,
          status_responder_id: state.status_responder_id,
          last_action_id:      state.last_action_id
        });
        break;

      case 'REMOVE':
        return this.router.delete('/nodes/' + id);
        break;

    }
  }

});

routes.push({
  path: '/homemaker/nodes',

  html: function(req, state) {
    return {
      title: 'Nodes & Actions', 
      state: state,
      body: <N0deListRoot state={state}/>
    };
  },

  json: function(req, state) {
    switch(req.method) {
      case 'GET':
        return Promise.props({
          nodes:  this.router.get('/nodes')
        });
        break;
    }
  }

});

module.exports = routes;
