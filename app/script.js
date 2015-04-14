// Fill in ES6 features
require("babel/polyfill");

// Make browser app available everywhere
global.browser = require('app/lib/browser');
global._ = require('lodash');
