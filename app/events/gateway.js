var _ = require('lodash');
var events = [];

events.push({
  name: 'gateway-connect',

  browser: function(gateway) {
    console.log('Gateway connected');
    console.log(gateway);
  },

  server: function(gatewayId) {
    if (gatewayId) {
      this.router.get(`/gateways/${gatewayId}/connect`);
      setTimeout(() => {
        this.router.get(`/gateways/${gatewayId}`).then((gateway) => {
          if (gateway.connected) {
            this.socket.io.emit('gateway-connect', gateway);
            return this.router.put(`/gateways/${gatewayId}`, { active: 1 });
          }
        });
      }, 1000);
    }
  }

});

events.push({
  name: 'gateway-disconnect',

  browser: function(gateway) {
    console.log('Gateway disconnected');
    console.log(gateway);
  },

  server: function(gatewayId) {
    if (gatewayId) {
      this.router.get(`/gateways/${gatewayId}/disconnect`);
      setTimeout(() => {
        this.router.get(`/gateways/${gatewayId}`).then((gateway) => {
          if (!gateway.connected) {
            this.socket.io.emit('gateway-disconnect', gateway);
            return this.router.put(`/gateways/${gatewayId}`, { active: false });
          }
        });
      }, 1000);
    }
  }

});

module.exports = events;
