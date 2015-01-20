module.exports = function(app) {

  var knex = app.get('db').knex;
  var createTable = function(name, fn) {
    return knex.schema.hasTable(name).then(function(exists) {
      if (!exists) {
        return knex.schema.createTable(name, fn);    
      }
    });
  };
  
  createTable('action', function(t) {
    t.increments('id').primary(),
    t.integer('node_id'),
    t.integer('responder_id'),
    t.string('name', 255);
    t.text('command'),
    t.string('feedback', 255);
  });

  createTable('command', function(t) {
    t.increments('id').primary(),
    t.integer('device_id'),
    t.string('name', 255),
    t.string('feedback', 255),
    t.text('command');
  });

  createTable('device', function(t) {
    t.increments('id').primary(),
    t.string('name', 255),
    t.string('responder_type', 255);
  });

  createTable('gateway', function(t) {
    t.increments('id').primary(),
    t.string('name', 255),
    t.string('type', 255),
    t.string('host', 255),
    t.integer('port'),
    t.string('username', 255),
    t.string('password', 255),
    t.boolean('active');
  });

  createTable('node', function(t) {
    t.increments('id').primary(),
    t.integer('node_id'),
    t.string('name', 255),
    t.string('status', 255),
    t.integer('status_responder_id');
  });

  createTable('responder', function(t) {
    t.increments('id').primary(),
    t.string('name', 255);
    t.string('type', 255),
    t.integer('gateway_id'),
    t.string('address', 255),
    t.string('custom_status_lookup', 255);
  });

  createTable('url', function(t) {
    t.increments('id').primary(),
    t.integer('node_id'),
    t.integer('action_id'),
    t.string('type', 255),
    t.string('path', 255);
  });

};
