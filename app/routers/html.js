var _ = require('underscore');

var React = require('react'),
    Layout = require('app/components/Layout'),
    beautifyHTML = require('js-beautify').html;

var Router = function(json) {
  this.express = new require('express').Router();
  this.json = json;
};

// Error!
Router.prototype.error = function(res, err) {
  console.log(err)
  res.send(err);
};

// Normal 404 error page
Router.prototype.fourOhFour = function(res, err) {
  console.log(err)
  res.status(404);
  res.type('txt').send('Not found');
};

Router.prototype.get = function(path, callback) {
  return this.express.get(path, callback);
}

Router.prototype.post = function(path, callback) {
  return this.express.post(path, callback);
}

Router.prototype.put = function(path, callback) {
  return this.express.put(path, callback);
}

Router.prototype.delete = function(path, callback) {
  return this.express.delete(path, callback);
}

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

module.exports = function(app) {
  var json = app.get('json');
  var router = new Router(json);
  var util = require('./util');

  // Loop through all the routes
  _(util.routes).each(function(route) {

    // Make sure the route is valid
    if ((route.html) && (route.path)) {

      // Add route to app (all html routes are GET requests)
      app.use(route.path, function(req, res) {

        // Get path from express' req 
        var path = req.originalUrl;

        // Call the json API to get the state for this route
        json(path).then(function(state) {

          // Run the html method in the route to render
          var data = route.html.call(router, util.req(path, 'GET'), state);
          router.render(req, res, data);

        }).catch(router.error.bind(router, res));

      });
    }
  });

  // Set and return
  app.set('html', router);
  return router;
}
