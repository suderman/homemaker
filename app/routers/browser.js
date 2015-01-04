var _ = require('underscore');
var Director = require('director');

var Router = function() {
  this.director = new Director.Router().configure({ html5history:true });
};

Router.prototype.pathname = function(href) {
  href = href || global.location.href; // passed href for current location  
  href = href.split('#')[0].replace(/\/+$/, ''); // strip trailing / and #
  var path = href.split('://').reverse().shift().split('/'); // don't want domain
  return path[0] = '', path.join('/');
}

// Shortcut to setRoute
Router.prototype.go = function(href, title) {
  href = href || location.href;
  var pathname = this.pathname(href);
  if (title) document.head.getElementsByTagName('title')[0].innerHTML = title;
  this.director.setRoute(pathname);
}

// Get or set the document title
Router.prototype.title = function(value) {

  // Get document title or return false if it's not there
  var title = document.head.getElementsByTagName('title')[0];
  if (!title) return false;

  // If textContent isn't supported, use innerText
  var text = ('innerText' in title) ? 'innerText' : 'textContent';

  // Set title with value (if supplied) and return title value
  if (value) title[text] = value;
  return title[text];

}

Router.prototype.on = function(path, callback) {
  return this.director.on(path, callback);
}

Router.prototype.start = function() {
  return this.director.init();
}

// React components
var React = require('react'),
    Layout = require('app/components/Layout');

// Render page overtop
Router.prototype.render = function (body, route) {
  route = route || '/';
  React.render(<Layout route={route} body={body} />, document.body);
}

// Create router
var router = new Router();
var util = require('./util');

// Load routes
_(util.routes).each(function(route) {
  if ((route.html) && (route.path)) {

    // Set 'on' in director router with regex
    router.on(util.regex(route.path), function() {

      // Call the route's html method
      var html = route.html.call(router, util.req(route.path, 'GET'));

      // Render the body and set the title
      router.render(html.body);
      router.title(html.title);

    });
  }
});

// Make this available everywhere
global.router = router;
module.exports = router;
