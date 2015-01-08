var _ = require('underscore');
    _.mixin({deepExtend: require('underscore-deep-extend')(_)});

var Director = require('director'),
    localforage = require('localforage'),
    React = require('react');
    require('offline-js/js/offline'); // bad module assigns to global.Offline

// Constructor for brower's router (main global)
var Router = function() {

  // Create new Director router
  this.director = new Director.Router().configure({ html5history:true });

  // Replacement for localstorage
  this.localforage = localforage;

  // Save in-page state into local storage
  this.setItem(this.pathname(), global.state);
  
  // React.js
  this.component = null;

  // Socket.io
  this.socket = require('app/sockets/client');

  // Keep track of routes/pages that are current
  this.upToDate = {};
  this.offline = global.Offline; 
  this.offline.on('down', function() {
    this.upToDate = {};
  }.bind(this));

};

// localforage
Router.prototype.setItem = function() {
  return this.localforage.setItem.apply(this.localforage, arguments);
}

Router.prototype.getItem = function() {
  return this.localforage.getItem.apply(this.localforage, arguments);
}

Router.prototype.removeItem = function() {
  return this.localforage.removeItem.apply(this.localforage, arguments);
}

Router.prototype.mergeItem = function(key, newValue) {
  return this.localforage.getItem(key).then(function(value) {
    value = value || {};
    _(value).deepExtend(newValue);
    return this.localforage.setItem(key, value);
  }.bind(this));
}


// Socket.io
Router.prototype.on = function() {
  return this.socket.on.apply(this.socket, arguments);
}

Router.prototype.emit = function() {
  return this.socket.emit.apply(this.socket, arguments);
}


// offline.js
Router.prototype.state = function() {
  return this.offline.state;
}

// director.js (setRoute)
Router.prototype.go = function(href, title) {
  href = href || location.href;
  var pathname = this.pathname(href);
  if (title) this.title(title);
  this.director.setRoute(pathname);

  // Request latest state via socket.io
  if (!this.upToDate[pathname]) {
    this.emit('json', pathname);
  }
}

// React.js
Router.prototype.setState = function(state) {
  if ((this.component) && (this.component.setState)) {
    this.component.setState(state);
  }
}


// Get pathname from href
Router.prototype.pathname = function(href) {
  href = href || global.location.href; // passed href for current location  
  href = href.split('#')[0].replace(/\/+$/, ''); // strip trailing / and #
  var path = href.split('://').reverse().shift().split('/'); // don't want domain
  return path[0] = '', path.join('/');
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

// Started at DOM load 
Router.prototype.start = function() {

  // Initialize routes
  return this.director.init();
}

// React components
var Layout = require('app/components/Layout');

// Render page overtop
Router.prototype.render = function (body, route) {
  route = route || '/';
  React.render(<Layout route={route} body={body} />, document.body);
}

// Create router
var app = new Router();
var util = require('./util');

// Load routes
_(util.routes).each(function(route) {
  if ((route.html) && (route.path)) {

    // Set 'on' in director router with regex
    app.director.on(util.regex(route.path), function() {

      // See if there's any state in localstorage
      app.getItem(app.pathname()).then(function(state) {

        // Call the route's html method
        var html = route.html.call(app, util.req(route.path, 'GET'), state);
        // console.log(state);
        // console.log(html);
        // alert('console.logged state and html for ' + app.pathname())

        // Render the body and set the title
        app.render(html.body);
        app.title(html.title);

      });
    });
  }
});

// Needed for mobile
React.initializeTouchEvents(true);
module.exports = app;
