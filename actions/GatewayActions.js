var Reflux = require('reflux');

var GatewayActions = Reflux.createActions([
  'updateGateway',
  'fireball'
  // "toggleItem",     // called by button in TodoItem
  // "toggleAllItems", // called by button in TodoMain (even though you'd think TodoHeader)
  // "addItem",        // called by hitting enter in field in TodoHeader
  // "removeItem",     // called by button in TodoItem
  // "clearCompleted", // called by button in TodoFooter
  // "editItem"        // called by finishing edit in TodoItem
]);

module.exports = GatewayActions;
