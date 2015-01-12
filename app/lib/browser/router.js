var util = require('../util');
var Director = require('director');
var director = new Director.Router().configure({ html5history:true });

module.exports = function(browser) {

  return browser.router = {

    // Create new Director router
    director: director,

    // Pull from common util module
    routes: util.routes,
    regex: util.regex,
    req: util.req,
  
    // Wrapper around setRoute
    go: function(href) {
      href = href || location.href;
      director.setRoute(browser.router.path(href));
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
      if ((!route.html) || (!route.path)) return;

      // Set 'on' in director router with regex
      director.on(util.regex(route.path), function() {
        browser.router.load(route);
      });
    },

    // Load route into body and title
    load: function(route) {

      // Current path in browser
      var path = browser.router.path();

      // See if there's any state in localstorage
      browser.cache.get(path).then(function(state) {

        // Call the route's html method
        var html = route.html.call(browser, util.req(path, 'GET'), state);

        // Render the body and set the title
        browser.view.body(html.body);
        browser.view.title(html.title);

        // Request latest state via socket.io
        if ((!state) || (browser.cache.isNotCurrent(path)))  {
          browser.socket.emit('json', path);
        }

        state = null;
        html = null;
      });
    }

  };
}
