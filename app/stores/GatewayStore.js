var _ = require('underscore');
var Promise = require('bluebird/js/browser/bluebird');
var http = new (require('http-transport'))();
var Reflux = require('reflux');

var __state = {
  list: [],
  types: []
}

function getById(id) {
  return _(__state.list).findWhere({id: id});
}

var GatewayStore = Reflux.createStore({

  // this will set up listeners to all publishers in actions file, 
  // using onKeyname (or keyname) as callbacks
  listenables: [require('../actions/GatewayActions')],

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

        list: http.get('/homemaker/api/gateways/all').get('body'),
        types: http.get('/homemaker/api/gateways/types').get('body')

      }).then(function(state) {
        store.trigger(state);
      });
    }
  },

  onFireball: function(victim) {
    console.log(victim + ' got torched!');
  },

  onGetGateways: function() {
    var self = this;

    self.getGateways().then(function() {
      return self.getGatewayTypes();
    }).then(function() {
      self.trigger(__state);
    });
  },
  
  onUpdateGateway: function(updatedGateway) {
    var existingGateway = getById(updatedGateway.id);
    _(existingGateway).extend(updatedGateway);
    this.putGateway(updatedGateway);
    this.trigger(__state);
  },

  getGateway: function(id) {
    var path = '/homemaker/api/gateways/' + id;
    return http.get(path).then(function(res) {
      __state.list = res.body;
      return __state.list;

    }).catch(function(error) {
      console.log(error);
    });
  },

  getGateways: function() {
    var path = '/homemaker/api/gateways/all';
    return http.get(path).then(function(res) {
      __state.list = res.body;
      return __state.list;

    }).catch(function(error) {
      console.log(error);
    });
  },

  putGateway: function(gateway) {
    var path = '/homemaker/api/gateways/' + gateway.id;
    return http.put(path, gateway).then(function(res) {
      return __state.list;
    }).catch(function(error) {
      console.log(error);
    });
  },

  getGatewayTypes: function() {
    var path = '/homemaker/api/gateways/types';
    return http.get(path).then(function(res) {
      __state.types = res.body;
      return __state.types;
    }).catch(function(error) {
      console.log(error);
    });
  }
});

module.exports = GatewayStore;
