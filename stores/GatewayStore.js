var Promise = require('../lib').Promise,
    Agent = require('../lib').Agent,
    Flux = require('../lib').Flux;

_gateways = global.initialData || [];

function addGateway(gateway) {
  _gateways.push(gateway);
}

function updateGateway(gateway) {
  _gateways.push(gateway);
}

var GatewayStore = Flux.createStore({

  getGateways: function() {

    return Agent.get('/homemaker/api/gateways').end().then(function(res) {
      _gateways = res.body;
      return _gateways;

    }).catch(function(error) {
      console.log(error);
    });
  }

}, function(payload) {

  console.log('GatewayStore')
  console.log(payload)

  switch(payload.actionType) {

    case 'ADD_GATEWAY':
      addGateway(payload.gateway);
    break;

    case 'UPDATE_GATEWAY':
      updateGateway(payload.gateway);
    break;

    default:
      return true;
  }

  GatewayStore.emitChange();
  return true;

});
module.exports = GatewayStore;
