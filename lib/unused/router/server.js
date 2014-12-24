var React = require('react'),
    Layout = require('app/components/Layout'),
    beautifyHTML = require('js-beautify').html;

module.exports = function() {
  var router = require('express').Router();

  // Render React template
  router.render = function(req, res, data) {
    var state = data.state || {};
    var title = data.title || 'Untitled';
    var route = req.originalUrl

    console.log(route);
    var body = React.renderToString(<Layout route={route} body={data.body} />);

    res.render('index', { 
      title: title, 
      state: JSON.stringify(state),
      body: beautifyHTML(body, { indent_size: 4, end_with_newline: true })
    });
  }

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

  // router.resource('get', Node); <-- only get
  // router.resource(Node) <-- all verbs
  router.resource = function (verb, Model) {

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
  router.indexResource = function (Model) {
    var router = this;
    router.get('/', function(req, res) {
      Model.findAll().then(function(collection){ 
        res.send(collection.toJSON()); 
      }).catch(router.error.bind(router, res));
    });
    return router;
  }

  // GET one
  router.getResource = function (Model) {
    var router = this;
    router.get('/:id(\\d+)/', function(req, res) {
      Model.find(req.params.id).then(function(model){ 
        res.send(model.toJSON()); 
      }).catch(router.error.bind(router, res));
    });
    return router;
  }

  // POST one
  router.postResource = function (Model) {
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
  router.putResource = function (Model) {
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
  router.deleteResource = function (Model) {
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
  router.nestedResource = function(Model) {
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

  return router;
}
