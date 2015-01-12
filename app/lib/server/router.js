var _ = require('lodash'),
    Promise = require('bluebird'),
    http = new (require('http-transport'))();

var React = require('react'),
    Layout = require('app/components/Layout'),
    beautifyHTML = require('js-beautify').html;

// Router for both JSON and HTML
var Router = function(server, apihost) {

  // Lib reference
  this.server = server;

  // Typically http://127.0.0.1:5006
  this.apihost = (_.isNumber(apihost)) ? 'http://127.0.0.1:' + apihost : apihost;

  // Routes to match against
  this.routes = require('app/routes');

  // Router util (shared with browser)
  var util = require('app/lib/util');
  this.regex = util.regex;
  this.req = util.req;
};

// Make changes to data before posting to API
Router.prototype.parseFields = function(fields) {
  _(fields).forEach(function(value, key) {
    if (!fields[key]) fields[key] = '';
    if (fields[key] === 'null') fields[key] = null;
  });
  return fields;
}

// Match passed path in routes
Router.prototype.matchRoute = function(path) {
  return _(this.routes).find((route) => {
    return path.match(this.regex(route.path));
  });
}

// HTTP GET method against API
Router.prototype.get = function(path) {
  return http.get(this.apihost + path).get('body');
}

// HTTP PUT method against API
Router.prototype.put = function(path, fields) {
  return http.put(this.apihost + path, this.parseFields(fields)).get('body');
}

// HTTP POST method against API
Router.prototype.post = function(path, fields) {
  return http.post(this.apihost + path, this.parseFields(fields)).get('body');
}

// HTTP DELETE method against API
Router.prototype.delete = function(path) {
  return http.delete(this.apihost + path);
}

// Send and get JSON from the API
Router.prototype.json = function(path, state, socket) {
  var req = this.req(path, state);
  var route = this.matchRoute(req.path);

  if ((route) && (route.json)) {
    return route.json.call(this.server, req, state);
  } else {
    return Promise.reject(new Error('No matching json route: ' + path));
  }
}

// Error as 404 page
Router.prototype.error = function(res, err) {
  console.log(err)
  // res.status(404);
  // res.type('txt').send('Not found');
};

// Render React template
Router.prototype.render = function(req, res, data) {
  var state = data.state || {};
  var title = data.title || 'Untitled';
  var route = req.originalUrl;

  var body = React.renderToString(<Layout route={route} body={data.body} />);

  res.render('index', { 
    title: title, 
    state: JSON.stringify(state),
    body: beautifyHTML(body, { indent_size: 4, end_with_newline: true })
  });
}

  // Loop routes to build middleware for Express (all html routes are GET requests)
  Router.prototype.middleware = function() {

    var express = new require('express').Router();

    // Loop through all the routes
    _(this.routes).forEach((route) => {

      // Make sure the route is valid
      if ((!route.html) || (!route.path)) return;

      // Add route to app (all html routes are GET requests)
      express.use(route.path, (req, res, next) => {

        // Get path from express' req 
        var path = req.originalUrl;

        // Call the json API to get the state for this route
        this.json(path).then((state) => {

          // Run the html method in the route to render
          var data = route.html.call(this.server, this.req(path, 'GET'), state);
          this.render(req, res, data);

        }).catch(this.error.bind(this, res));
      });
    });

    return express;
  }

module.exports = function(server, apihost) {
  return server.router = new Router(server, apihost);
}
