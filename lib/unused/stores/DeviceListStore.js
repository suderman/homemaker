var _ = require('underscore');
var Promise = require('bluebird/js/browser/bluebird');
var http = new (require('http-transport'))();
var Reflux = require('reflux');

var __state = {
  list: global.initialData || [],
  types: []
}

function getByName(name) {
  return _(__state.list).findWhere({name: name});
}

var DeviceStoreList = Reflux.createStore({

  // this will set up listeners to all publishers in actions file, 
  // using onKeyname (or keyname) as callbacks
  listenables: [require('../actions/Actions')],

  onGetState: function() {
    var store = this;

    var state = JSON.parse(localStorage.getItem(router.pathname()));

    if (state) {
      store.trigger(state);
    } else {
      socket.emit('get', router.pathname());
    }
  },

});

      socket.on('set', function(path, state) {
        localStorage.setItem(path, JSON.stringify(state));
        store.trigger(state);
      });

module.exports = DeviceStoreList;
