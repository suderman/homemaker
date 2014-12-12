// Let's use Director's router
var director = require('director'),
    router = new director.Router().configure({ html5history:true });

// helper function to get full pathname including querystring
router.pathname = function(href) {
  href = href || global.location.href;
  var path = href.split('://').reverse().shift().split('/');
  return path[0] = '', path.join('/');
}

// Shortcut to setRout
router.go = function(href) {
  href = href || location.href;
  var pathname = router.pathname(href);
  router.setRoute(pathname);
}

// React components
var React = require('react'),
    Layout = require('../../components/Layout');

// Render helper function
router.render = function (body, params) {
  params = params || {};
  React.render(<Layout params={params} body={body} />, document.body);
}

// Make this available everywhere
global.router = router;
module.exports = router;
