// Configure database
module.exports = function(app) {

  var knex = require('knex')({
    client: 'mysql',
    debug: false,
    connection: {
      host:     process.env.DB_HOST || '127.0.0.1',
      user:     process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'homemaker',
      charset: 'utf8'
    }
  });

  var bookshelf = require('bookshelf')(knex)

  bookshelf.plugin('registry');
  bookshelf.plugin('virtuals');
  bookshelf.plugin('visibility');

  app.set('db', bookshelf);
}

