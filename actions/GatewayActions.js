var Flux = new (require('mcfly'))();
// var McFly = require('mcfly');
// var Flux = new McFly();

var GatewayActions = Flux.createActions({

  // addTodo: function(text){
  //   return API.asyncCall(text)
  //   .then(function(text){
  //     return {
  //       actionType: "ADD_TODO",
  //       id: text
  //     }
  //   });
  // },

  tickleRobot: function(arg) {
    console.log(arg);
    console.log('beep boop');
  }
});

module.exports = GatewayActions;
