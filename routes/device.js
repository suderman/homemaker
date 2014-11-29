/* Devices Routes
 * -----------------------------
   /api/devices
   /api/devices/all
   /api/devices/1
   /api/devices/1/commands
   /api/devices/adapter-device-name[1]
   /api/devices/adapter-device-name[1]/commands
*/
var Promise = require('bluebird');
module.exports = function(app) {

  // Models
  var Device = app.get('db').model('Device'),
      Responder = app.get('db').model('Responder');

  // Define routes
  var router = app.get('router')(Device);
  return router

  // GET all including adapters
  .get('/all', function(req, res) {
    Device.findAllAdapter().then(function(devices) {
      res.send(devices);
    }).catch(router.error.bind(router, res));
  })

  // GET adapter device
  .get('/:id', function(req, res) {
    var device = Device.fromParams(req.params);
    res.send(device);
  })

  // GET commands for adapter device
  .get('/:id/commands', function(req, res) {
    var device = Device.fromParams(req.params);

    Responder.find(device.responderId).then(function(responder) { 
      return responder.commands();

    }).then(function(device){
      var key = Object.keys(device)[0];
      return device[key];
     
    }).then(function(commands){
      res.send(commands);

    }).catch(router.error.bind(router, res));

  })

};
