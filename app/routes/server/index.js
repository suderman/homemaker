var React = require('react'),
    Layout = require('app/components/Layout'),
    beautifyHTML = require('js-beautify').html;

var Router = function() {
  this.express = new require('express').Router();
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

module.exports = function() {
  return new Router();
}
