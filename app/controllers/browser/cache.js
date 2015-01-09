var _ = require('lodash/dist/lodash.underscore');
var localforage = require('localforage');
var current = {};

module.exports = function(app) {

  return app.cache = {

    // localforage
    localforage: localforage,

    // List of routes which are current/up-to-date
    current: current, 

    set: function() {
      return localforage.setItem.apply(localforage, arguments);
    },

    get: function() {
      return localforage.getItem.apply(localforage, arguments);
    },

    remove: function() {
      return localforage.removeItem.apply(localforage, arguments);
    },

    merge: function(key, valueUpdate) {
      return localforage.getItem(key).then(function(value) {
        value = value || {};
        return localforage.setItem(key, _(value).merge(valueUpdate));
      });
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
      app.cache.invalidateAll();
      _(paths).each(function(path) {
        current[path] = true;
      });
    }

  };
}
