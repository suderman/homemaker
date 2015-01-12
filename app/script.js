// Fill in ES6 features
require("6to5/polyfill");

// Make browser app available everywhere
global.browser = require('app/lib/browser');
global._ = require('lodash');
