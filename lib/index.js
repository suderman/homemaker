var Promise = require('bluebird/js/browser/bluebird');
exports.Promise = Promise;

var Agent = require('superagent-promise');
exports.Agent = Agent;

var McFly = require('mcfly');
exports.Flux = new McFly();

var React = require('react');
exports.React = React;
