'use strict';

// Make browser router available everywhere
global.app = require('app/routers/browser');

// Go to current route on DOM load
document.addEventListener('DOMContentLoaded', function() {
  app.start();
});
