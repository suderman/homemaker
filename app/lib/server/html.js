var _ = require('lodash');

var React = require('react'),
    Layout = require('app/components/Layout'),
    beautifyHTML = require('js-beautify').html;

var Html = function(json) {
  this.router = new require('express').Router();
  this.json = json;
};


// Add route to app (all html routes are GET requests)
Html.prototype.observe = function(req, res, route) {

  // Html router
  var html = this.server.router.html;

  // Get path from express' req 
  var path = req.originalUrl;

  // Call the json API to get the state for this route
  this.json(path).then(function(state) {

    // Run the html method in the route to render
    var data = route.html.call(html, server.router.req(path, 'GET'), state);
    html.render(req, res, data);

  }).catch(html.error.bind(html, res));

};

// Error!
Html.prototype.error = function(res, err) {
  console.log(err)
  res.send(err);
};

// Normal 404 error page
Html.prototype.fourOhFour = function(res, err) {
  console.log(err)
  res.status(404);
  res.type('txt').send('Not found');
};

Html.prototype.get = function(path, callback) {
  return this.router.get(path, callback);
}

Html.prototype.post = function(path, callback) {
  return this.router.post(path, callback);
}

Html.prototype.put = function(path, callback) {
  return this.router.put(path, callback);
}

Html.prototype.delete = function(path, callback) {
  return this.router.delete(path, callback);
}

// Render React template
Html.prototype.render = function(req, res, data) {
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

module.exports = function(server, app) {

  // Create new Html object
  server.router.html = new Html(server.router);

  // Loop through all the routes
  _(server.router.routes).forEach(function(route) {

    // Make sure the route is valid
    if ((!route.html) || (!route.path)) return;

    // Add route to app (all html routes are GET requests)
    app.use(route.path, server.router.observe(req, res, route));

  });

  return server.router.html;

  // // Loop through all the routes
  // _(server.router.routes).forEach(function(route) {
  //
  //   // Make sure the route is valid
  //   if ((route.html) && (route.path)) {
  //
  //     // Add route to app (all html routes are GET requests)
  //     app.use(route.path, function(req, res) {
  //
  //       // Get path from express' req 
  //       var path = req.originalUrl;
  //
  //       // Call the json API to get the state for this route
  //       server.json(path).then(function(state) {
  //
  //         // Run the html method in the route to render
  //         var data = route.html.call(html, server.router.req(path, 'GET'), state);
  //         html.render(req, res, data);
  //
  //       }).catch(html.error.bind(html, res));
  //
  //     });
  //   }
  // });
}
