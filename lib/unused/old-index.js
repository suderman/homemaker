var isServer = typeof window === 'undefined';

if (isServer) {
  console.log('chosen server')
  module.exports = {};
  // module.exports = function(app) {
  //   return require('./server')(app);
  // }
} else {
  console.log('chosen client')
  // module.exports = require('./client');
  module.exports = {};

}
