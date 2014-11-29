/* Devices Routes
 * -----------------------------
   /api/devices
   /api/devices/all
   /api/devices/1
   /api/devices/1/commands
*/
var Promise = require('bluebird');
module.exports = function(app) {

  // Models
  var Device = app.get('db').model('Device');

  // Define routes
  var router = app.get('router')(Device);
  return router

  // GET all including adapters
  .get('/all', function(req, res) {
    Device.findAllAdapter().then(function(devices) {
      res.send(devices);
    }).catch(router.error.bind(router, res));
  })

  .get('/:id', function(req, res) {
    var id = decodeURIComponent(req.params.id);
    res.send(id);
  })

};
