module.exports = function(Model) {

  var router = require('express').Router();

  router.handleError = function(err, res) {
    console.log(err)
    res.send({});
  };

  router.fourOhFour = function(err, res) {
    console.log(err)
    res.status(404);
    res.type('txt').send('Not found');
  };

  if (!Model) { return router; }

  // Define nested routes from passed Model argument
  Model.nested.forEach(function(name){
  
    router.get('/:id/' + name, function(req, res) {
      Model.find(req.params.id, [name]).then(function(model){ 
        res.send(model.related(name).toJSON()); 
      }).catch(function(err){ 
        router.handleError(err, res); 
      });
    });

  });

  // Define default routes with passed Model argument
  return router

  // GET all
  .get('/', function(req, res) {
    Model.findAll().then(function(collection){ 
      res.send(collection.toJSON()); 
    }).catch(function(err){ 
      router.handleError(err, res); 
    });
  })

  // GET one
  .get('/:id(\\d+)/', function(req, res) {
    Model.find(req.params.id).then(function(model){ 
      res.send(model.toJSON()); 
    }).catch(function(err){ 
      router.handleError(err, res); 
    });
  })

  // POST one
  .post('/', function(req, res) {
    Model.new().then(function(model){ 
      return model.save(req.body, { patch: false }); 
    }).then(function(model){ 
      res.send(model.toJSON()); 
    }).catch(function(err){ 
      router.handleError(err, res); 
    });
  })

  // PUT one
  .put('/:id(\\d+)/', function(req, res) {
    Model.find(req.params.id).then(function(model){
      return model.save(req.body, { patch: true }); 
    }).then(function(model){ 
      res.send(model.toJSON()); 
    }).catch(function(err){ 
      router.handleError(err, res); 
    });
  })

  // DELETE one
  .delete('/:id(\\d+)/', function(req, res) {
    Model.find(req.params.id).then(function(model){
      return model.destroy(); 
    }).then(function(model){ 
      res.send(model.toJSON()); 
    }).catch(function(err){ 
      router.handleError(err, res); 
    });
  })

};

