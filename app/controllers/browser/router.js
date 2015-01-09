var util = require('../util');
var Director = require('director');
var director = new Director.Router().configure({ html5history:true });

module.exports = function(app) {

  return app.router = {

    // Create new Director router
    director: director,

    // Pull from common util module
    routes: util.routes,
    regex: util.regex,
    req: util.req,
  
    // Wrapper around setRoute
    go: function(href, title) {
      href = href || location.href;
      var path = app.router.path(href);

      if (title) app.view.title(title);
      director.setRoute(path);

      // Request latest state via socket.io
      if (app.cache.isNotCurrent(path)) {
        app.socket.emit('json', path);
      }
    },

    // Get pathname from href
    path: function(href) { 
      href = href || global.location.href; // passed href for current location  
      href = href.split('#')[0].replace(/\/+$/, ''); // strip trailing / and #
      var path = href.split('://').reverse().shift().split('/'); // don't want domain
      return path[0] = '', path.join('/');
    },

    init: function() {
      return director.init.apply(director, arguments);
    },

    on: function() {
      return director.on.apply(director, arguments);
    },

    observe: function(route) {
      if ((!route.html) || (!route.path)) return false;

      // Set 'on' in director router with regex
      director.on(util.regex(route.path), function() {

        // See if there's any state in localstorage
        app.cache.get(app.router.path()).then(function(state) {

          // Call the route's html method
          var html = route.html.call(app, util.req(route.path, 'GET'), state);

          // Render the body and set the title
          app.view.body(html.body);
          app.view.title(html.title);

        });
      });

      return true;
    }
  };
}
