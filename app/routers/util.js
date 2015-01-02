var _ = require('underscore');
var methodFromState = function(state) {

  // If state is a string, its value is the method
  if (_.isString(state)) return state;

  // If state is undefined, get
  if (_.isUndefined(state)) return 'GET';

  // If state is null, remove
  if (_.isNull(state)) return 'REMOVE';

  // If state is an object, set
  return 'SET';
}

// Cached regexes
var regexSlash = /\//g;
var regexParam = /\:(\w+)/g;

module.exports = {

  routes: require('app/routes'),

  // Convert a path into a regex pattern
  regex: function(path) {
    var regex = '^' + path.trim() + '$';
    regex = this.regexSlash(regex);
    regex = this.regexParam(regex);
    return new RegExp(regex, 'i');
  },

  // Escape forward slashes
  regexSlash: function(path) {
    return path.replace(regexSlash, '\/'); 
  },

  // Everything except forward slashes
  regexParam: function(path) {
    return path.replace(regexParam, '([^\/]+)');
  },

  // Director router can't seem to handle anything trickier than this
  regexOn: function(path) {
    return path.replace(regexParam, '(.+)');
    // return path.replace(regexParam, '([^\/]*)');
  },

  // Assemble a simple request object
  req: function(path, state) {

    path = (path) ? path.split('#')[0].replace(/\/+$/, '') : '/';

    return {
      path: path,
      slugs: path.split('/'),
      method: methodFromState(state)
    }
  }
}
