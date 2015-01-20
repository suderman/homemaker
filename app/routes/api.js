var Promise = require('bluebird');

var routes = [];

routes.push({
  path: '/:url',

  html: function(req, state) {
    console.log('html')
    console.log(req)
    return {
      title: 'Homemaker API', 
      state: state,
      body: state
    };
  },

  json: function(req, state) {
    console.log('json')
    console.log(req)
    console.log(state)
    switch(req.method) {

      case 'GET':
        return Promise.props({
          item:  this.router.get('/urls/' + req.path)
        });
        break;
    }
  }
});


module.exports = routes;
