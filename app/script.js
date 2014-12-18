'use strict';

// React is used to render everything
require('react').initializeTouchEvents(true);

// Director is used to route everything
var router = require('./routes/client/routes');

// Save in-page state into local storage
localStorage.setItem(router.pathname(), JSON.stringify(global.state));

// Go to current route
document.addEventListener('DOMContentLoaded', function() {
  router.start();
});
