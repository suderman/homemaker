var _ = require('underscore');
var Promise = require('bluebird/js/browser/bluebird');
var Agent = require('superagent-promise');
var Reflux = require('reflux');

var _gateways = global.initialData || [];

function getById(id) {
  return _(_gateways).findWhere({id: id});
}

var GatewayStore = Reflux.createStore({

  // this will set up listeners to all publishers in actions file, 
  // using onKeyname (or keyname) as callbacks
  listenables: [require('../actions/GatewayActions')],

  onFireball: function(victim) {
    console.log(victim + ' got torched!');
  },

  onUpdateGateway: function(updatedGateway) {
    this.updateList(updatedGateway);
  },

  getGateways: function() {
    var path = '/homemaker/api/gateways/';
    return Agent.get(path).end().then(function(res) {
      _gateways = res.body;
      return _gateways;

    }).catch(function(error) {
      console.log(error);
    });
  },

  putGateway: function(gateway) {
    var path = '/homemaker/api/gateways/' + gateway.id;
    return Agent.put(path).send(gateway).end().then(function(res) {
      return _gateways;

    }).catch(function(error) {
      console.log(error);
    });
  },

  updateList: function(updatedGateway) {
    var existingGateway = getById(updatedGateway.id);
    _(existingGateway).extend(updatedGateway);
    this.putGateway(updatedGateway);
    return _gateways;
  }

});

module.exports = GatewayStore;
