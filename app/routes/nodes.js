var Promise = require('bluebird');
var React = require('react');
var { Page } = require('app/components');

var routes = [];

routes.push({
  path: '/homemaker/nodes',

  html: function(req, state) {
    return {
      title: 'Nodes & Actions', 
      state: state,
      body: <Page state={state}/>
    };
  },

  json: function(req, state) {
    switch(req.method) {

      case 'GET':
        return Promise.props({
          item: Promise.resolve({})
        });
        break;
    }
  }
});


module.exports = routes;
