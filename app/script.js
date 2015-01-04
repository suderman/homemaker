'use strict';

// Director is used to route everything
var router = require('app/routers/browser');

// Save in-page state into local storage
localStorage.setItem(router.pathname(), JSON.stringify(global.state));

// Socket.io
var socket = require('app/sockets/client');

// Needed for mobile
require('react').initializeTouchEvents(true);

// Go to current route
document.addEventListener('DOMContentLoaded', function() {
  router.start();
});

