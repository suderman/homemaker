var _ = require('underscore'),
    React = require('react'),
    beautifyHTML = require('js-beautify').html;
    
module.exports = function(Model, argRoutes) {

  var router = require('express').Router();

  // Render react component
  router.render = function(payload) {
    return React.renderToString(payload); 
    // return beautifyHTML(React.renderToString(payload), { 
    //   indent_size: 4,
    //   end_with_newline: true 
    // });
  },

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

  argRoutes = (argRoutes) || {};
  var routes = { index: true, get: true, post: true, put: true, delete: true, nested: true }
  _(routes).extend(argRoutes);

  // Define default routes with passed Model argument
  // ------------------------------------------------
  
  // Define nested routes from passed Model argument
  if (routes['nested']) {
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
  }

  // GET all
  if (routes['index']) {
    router.get('/', function(req, res) {
      Model.findAll().then(function(collection){ 
        res.send(collection.toJSON()); 
      }).catch(router.error.bind(router, res));
    });
  }

  // GET one
  if (routes['get']) {
    router.get('/:id(\\d+)/', function(req, res) {
      Model.find(req.params.id).then(function(model){ 
        res.send(model.toJSON()); 
      }).catch(router.error.bind(router, res));
    });
  }

  // POST one
  if (routes['post']) {
    router.post('/', function(req, res) {
      Model.new().then(function(model){ 
        return model.save(req.body, { patch: false }); 
      }).then(function(model){ 
        res.send(model.toJSON()); 
      }).catch(router.error.bind(router, res));
    });
  }

  // PUT one
  if (routes['put']) {
    router.put('/:id(\\d+)/', function(req, res) {
      Model.find(req.params.id).then(function(model){
        return model.save(req.body, { patch: true }); 
      }).then(function(model){ 
        res.send(model.toJSON()); 
      }).catch(router.error.bind(router, res));
    })
  }

  // DELETE one
  if (routes['delete']) {
    router.delete('/:id(\\d+)/', function(req, res) {
      Model.find(req.params.id).then(function(model){
        return model.destroy(); 
      }).then(function(model){ 
        res.send(model.toJSON()); 
      }).catch(router.error.bind(router, res));
    })
  }

  return router;
};

