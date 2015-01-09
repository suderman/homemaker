// React components
var React = require('react');
var Layout = require('app/components/Layout');

module.exports = function(app) {

  // Needed for mobile
  React.initializeTouchEvents(true);

  // React.js
  return app.view = { 

    // Currently mounted component
    component: null,

    // setState for currently mounted component
    setState: function(state) {
      if ((app.view.component) && (app.view.component.setState)) {
        app.view.component.setState(state);
      }
    },

    // Render page overtop
    body: function (body, route) {
      route = route || '/';
      React.render(<Layout route={route} body={body} />, document.body);
    },

    // Get or set the document title
    title: function(value) {

      // Get document title or return false if it's not there
      var title = document.head.getElementsByTagName('title')[0];
      if (!title) return false;

      // If textContent isn't supported, use innerText
      var text = ('innerText' in title) ? 'innerText' : 'textContent';

      // Set title with value (if supplied) and return title value
      if (value) title[text] = value;
      return title[text];
    }

  }
}


