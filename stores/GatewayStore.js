var _ = require('underscore');
var Promise = require('bluebird/js/browser/bluebird');
var Agent = require('superagent-promise');
var Reflux = require('reflux');

var __state = {
  list: global.initialData || [],
  types: []
}

function getById(id) {
  return _(__state.list).findWhere({id: id});
}

var GatewayStore = Reflux.createStore({

  // this will set up listeners to all publishers in actions file, 
  // using onKeyname (or keyname) as callbacks
  listenables: [require('../actions/GatewayActions')],

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

  getGateways: function() {
    var path = '/homemaker/api/gateways/all';
    return Agent.get(path).end().then(function(res) {
      __state.list = res.body;
      return __state.list;

    }).catch(function(error) {
      console.log(error);
    });
  },

  putGateway: function(gateway) {
    var path = '/homemaker/api/gateways/' + gateway.id;
    return Agent.put(path).send(gateway).end().then(function(res) {
      return __state.list;
    }).catch(function(error) {
      console.log(error);
    });
  },

  getGatewayTypes: function() {
    var path = '/homemaker/api/gateways/types';
    return Agent.get(path).end().then(function(res) {
      __state.types = res.body;
      return __state.types;
    }).catch(function(error) {
      console.log(error);
    });
  }

});

module.exports = GatewayStore;
