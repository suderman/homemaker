var _ = require('lodash');
var localforage = require('localforage');
var current = {};

module.exports = function(browser) {

  var cache = {

    // localforage
    localforage: localforage,

    // List of routes which are current/up-to-date
    current: current, 

    set: function(key) {
      cache.validate(key);
      return localforage.setItem.apply(localforage, arguments);
    },

    get: function() {
      return localforage.getItem.apply(localforage, arguments).catch((e) => null);
    },

    clear: function() {
      return localforage.clear();
    },

    remove: function(key) {
      cache.invalidate(key);
      return localforage.removeItem.apply(localforage, arguments);
    },

    merge: function(key, valueUpdate) {
      cache.validate(key);
      return localforage.getItem(key).then(function(value) {
        value = value || {};
        value = _.merge(value, valueUpdate);
        return localforage.setItem(key, value);
      }).catch((err) => console.log(err));
    },

    isCurrent: function(path) {
      return (current[path]) ? true : false;
    },

    isNotCurrent: function(path) {
      return (current[path]) ? false : true;
    },

    validate: function(paths) {
      console.log('validate ' + paths);
      paths = (_.isArray(paths)) ? paths : [paths];
      _(paths).each(function(path) {
        current[path] = true;
      });
    },

    invalidate: function(paths) {
      console.log('invalidate ' + paths);
      paths = (_.isArray(paths)) ? paths : [paths];
      _(paths).each(function(path) {
        current[path] = false;
      });
    },

    invalidateAll: function() {
      console.log('invalidate all');
      current = null;
      current = {};
    },

    invalidateAllExcept: function(paths) {
      console.log('invalidate all except ' + paths);
      paths = (_.isArray(paths)) ? paths : [paths];
      cache.invalidateAll();
      _(paths).each(function(path) {
        current[path] = true;
      });
    }

  };

  return browser.cache = cache;
}
