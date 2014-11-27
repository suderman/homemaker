module.exports = function(app) {
  var db = app.get('db');

  var Promise  = require('bluebird');
  var _ = require('underscore');

  var Model = db.Model.extend({
    // Instance properties
  },{
    // Constructor properties 
    
    // Default list of related tables to also fetch
    related: [],

    // Default list of nested routes
    nested: [],

    // Private method to handle find() and findAll()
    _find: function(fetch, args) {
      var attributes = _.clone(this.findAttributes) || {}, 

          // Optional first argument for additional findAttributes
          idAttr = args[0],

          // Optional second argument for related tables
          related = (_.isArray(args[1])) ? (args[1]) : this.related;
          // console.log(this.tableName + ': ' + ', related: ' + related + ', this.related: ' + this.related)
          
      // Find by id or by attribute object
      if (idAttr) {
        attributes = (_.isObject(idAttr)) 
            ? _(attributes).extend(idAttr) 
            : _(attributes).extend({ id: idAttr });
      }

      // Remove all attributes if passed null
      if (_.isNull(idAttr)) attributes = {};

      // fetch or fetchAll
      return this.query({ where: attributes })[fetch]({ withRelated: related });
    },

    // Returns a promise, which will resolve with the fetched model
    find: Promise.method(function() {
      var args = Array.prototype.slice.call(arguments, 0);
      if (args.length < 1) throw new Error('ID or attributes object is required');
      return this._find.call(this, 'fetch', args);
    }),

    // Returns a promise, which will resolve with the fetched collection
    findAll: Promise.method(function() {
      var args = Array.prototype.slice.call(arguments, 0);
      return this._find.call(this, 'fetchAll', args);
    }),

    new: Promise.method(function(attributes) {
      return new this(attributes);
    })
      
  });

  // Model.findAttributes = {};
  return db.model('Model', Model);
}
