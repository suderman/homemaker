/* Devices Routes
 * -----------------------------
   /api/devices
   /api/devices/1
   /api/devices/1/commands
*/
module.exports = function(app) {

  // Models
  var Device = app.get('db').model('Device');

  // Define routes
  var router = app.get('router')(Device);
  return router
};
