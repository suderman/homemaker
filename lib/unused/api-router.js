var Router = function() {
  this.express = new require('express').Router();
};

// API typically errors out with an empty object
Router.prototype.error = function(res, err) {
  console.log(err)
  res.send({});
};

// Normal 404 error page
Router.prototype.fourOhFour = function(res, err) {
  console.log(err)
  res.status(404);
  res.type('txt').send('Not found');
};

Router.prototype.get = function(path, callback) {
  return this.express.get(path, callback);
}

Router.prototype.post = function(path, callback) {
  return this.express.post(path, callback);
}

Router.prototype.put = function(path, callback) {
  return this.express.put(path, callback);
}

Router.prototype.delete = function(path, callback) {
  return this.express.delete(path, callback);
}

// router.resource('get', Node); <-- only get
// router.resource(Node) <-- all verbs
Router.prototype.resource = function (verb, Model) {

  if (!Model) Model = verb; 
  var router = this;

  switch (verb) {
    case 'index':   router.indexResource(Model);   break;
    case 'get':     router.getResource(Model);     break;
    case 'post':    router.postResource(Model);    break;
    case 'put':     router.putResource(Model);     break;
    case 'delete':  router.deleteResource(Model);  break;
    case 'nested':  router.nestedResource(Model);  break;

    default:
      router.indexResource(Model); 
      router.getResource(Model);   
      router.postResource(Model);  
      router.putResource(Model);   
      router.deleteResource(Model);
      router.nestedResource(Model);
  }

  return router;
}


// GET all
Router.prototype.indexResource = function (Model) {
  var router = this;
  router.get('/', function(req, res) {
    Model.findAll().then(function(collection){ 
      res.send(collection.toJSON()); 
    }).catch(router.error.bind(router, res));
  });
  return router;
}

// GET one
Router.getResource = function (Model) {
  var router = this;
  router.get('/:id(\\d+)/', function(req, res) {
    Model.find(req.params.id).then(function(model){ 
      res.send(model.toJSON()); 
    }).catch(router.error.bind(router, res));
  });
  return router;
}

// POST one
Router.postResource = function (Model) {
  var router = this;
  router.post('/', function(req, res) {
    Model.new().then(function(model){ 
      return model.save(req.body, { patch: false }); 
    }).then(function(model){ 
      res.send(model.toJSON()); 
    }).catch(router.error.bind(router, res));
  });
  return router;
}

// PUT one
Router.putResource = function (Model) {
  var router = this;
  router.put('/:id(\\d+)/', function(req, res) {
    Model.find(req.params.id).then(function(model){
      return model.save(req.body, { patch: true }); 
    }).then(function(model){ 
      res.send(model.toJSON()); 
    }).catch(router.error.bind(router, res));
  });
  return router;
}

// DELETE one
Router.deleteResource = function (Model) {
  var router = this;
  router.delete('/:id(\\d+)/', function(req, res) {
    Model.find(req.params.id).then(function(model){
      return model.destroy(); 
    }).then(function(model){ 
      res.send(model.toJSON()); 
    }).catch(router.error.bind(router, res));
  })
  return router;
}

// Define nested routes from passed Model argument
Router.nestedResource = function(Model) {
  var router = this;

  Model.nested.forEach(function(name){
    router.get('/:id(\\d+)/' + name, function(req, res) {

      Model.find(req.params.id, [name]).then(function(model){ 
        return model.related(name); 

      }).then(function(collection) {
        return collection.load([collection.relatedData.parentTableName]);

      }).then(function(collection) {
        res.send(collection.toJSON()); 

      }).catch(router.error.bind(router, res));
    });

  });
  return router;
}

module.exports = function() {
  return new Router();
}
