module.exports = function(Model) {

  var router = require('express').Router();

  // API typically errors out with an empty object
  router.error = function(res, err) {
    console.log(err)
    res.send({});
  };

  // Normal 404 error page
  router.fourOhFour = function(res, err) {
    console.log(err)
    res.status(404);
    res.type('txt').send('Not found');
  };

  // Without a passed Model, return here
  if (!Model) { return router; }

  // Define nested routes from passed Model argument
  Model.nested.forEach(function(name){
    router.get('/:id/' + name, function(req, res) {

      Model.find(req.params.id, [name]).then(function(model){ 
        return model.related(name); 

      }).then(function(collection) {
        return collection.load([collection.relatedData.parentTableName]);

      }).then(function(collection) {
        res.send(collection.toJSON()); 

      }).catch(router.error.bind(router, res));
    });

  });

  // Define default routes with passed Model argument
  return router

  // GET all
  .get('/', function(req, res) {
    Model.findAll().then(function(collection){ 
      res.send(collection.toJSON()); 
    }).catch(router.error.bind(router, res));
  })

  // GET one
  .get('/:id(\\d+)/', function(req, res) {
    Model.find(req.params.id).then(function(model){ 
      res.send(model.toJSON()); 
    }).catch(router.error.bind(router, res));
  })

  // POST one
  .post('/', function(req, res) {
    Model.new().then(function(model){ 
      return model.save(req.body, { patch: false }); 
    }).then(function(model){ 
      res.send(model.toJSON()); 
    }).catch(router.error.bind(router, res));
  })

  // PUT one
  .put('/:id(\\d+)/', function(req, res) {
    Model.find(req.params.id).then(function(model){
      return model.save(req.body, { patch: true }); 
    }).then(function(model){ 
      res.send(model.toJSON()); 
    }).catch(router.error.bind(router, res));
  })

  // DELETE one
  .delete('/:id(\\d+)/', function(req, res) {
    Model.find(req.params.id).then(function(model){
      return model.destroy(); 
    }).then(function(model){ 
      res.send(model.toJSON()); 
    }).catch(router.error.bind(router, res));
  })

};

