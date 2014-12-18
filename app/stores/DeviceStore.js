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

var DeviceStore = Reflux.createStore({

  // this will set up listeners to all publishers in actions file, 
  // using onKeyname (or keyname) as callbacks
  listenables: [require('../actions/DeviceActions')],

  onGetState: function() {
    var store = this;

    var state = JSON.parse(localStorage.getItem(router.pathname()));
    console.log('localStorage: ' + router.pathname())
    if (state) {
      console.log('found in local storage: ' + state)
      store.trigger(state);

    } else {
      console.log('not found in local storage')
      Promise.props({

        list: http.get('/homemaker/api/devices/all').get('body'),
        types: http.get('/homemaker/api/responders/types').get('body')

      }).then(function(state) {
        localStorage.setItem(router.pathname(), JSON.stringify(state));
        store.trigger(state);
      });
    }
  },

  onGetDevices: function() {
    var self = this;

    self.getDevices().then(function() {
      return self.getDeviceTypes();
    }).then(function() {
      self.trigger(__state);
    });
  },

  onUpdateDevice: function(updatedDevice) {
    var existingDevice = getByName(updatedDevice.name);
    _(existingDevice).extend(updatedDevice);
    this.putDevice(updatedDevice);
    this.trigger(__state);
  },

  getDevices: function() {
    var path = '/homemaker/api/devices/all';
    return http.get(path).then(function(res) {
      __state.list = res.body;
      return __state.list;

    }).catch(function(error) {
      console.log(error);
    });
  },

  putDevice: function(device) {
    var path = '/homemaker/api/devices/' + device.id;
    return http.put(path, device).then(function(res) {
      return __state.list;
    }).catch(function(error) {
      console.log(error);
    });
  },

  getDeviceTypes: function() {
    var path = '/homemaker/api/responders/types';
    return http.get(path).then(function(res) {
      __state.types = res.body;
      return __state.types;
    }).catch(function(error) {
      console.log(error);
    });
  }

});

module.exports = DeviceStore;
