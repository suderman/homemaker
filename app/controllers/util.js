var _ = require('lodash/dist/lodash.underscore');
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

var regexSlashBefore = /\//g;
var regexSlashAfter  = '\\/';
function regexSlash(path) {
  return path.replace(regexSlashBefore, regexSlashAfter); 
}

var regexParamBefore = /\:(\w+)/g;
var regexParamAfter  = '[\\w\\[\\]\\(\\)\\<\\>\\{\\}\\+\\*\\=\\$\\.\\|\\!%-]+';
function regexParam(path) {
  return path.replace(regexParamBefore, regexParamAfter);
}

module.exports = {

  routes: require('app/routes'),

  // Convert a path into a regex pattern
  regex: function(path) {
    var regex = path.trim();
    regex = regexSlash(regex);
    regex = regexParam(regex);
    return new RegExp(regex, 'i');
  },

  // Assemble a simple req object
  req: function(path, state) {

    path = (path) ? path.split('#')[0].replace(/\/+$/, '') : '/';

    return {
      path: path,
      slugs: path.split('/'),
      method: methodFromState(state)
    }
  }
}
