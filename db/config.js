// Configure database
module.exports = function(app) {

  var knex = require('knex')({
    client: 'mysql',
    debug: false,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: 'utf8'
    }
  });

  var bookshelf = require('bookshelf')(knex)

  bookshelf.plugin('registry');
  bookshelf.plugin('virtuals');
  bookshelf.plugin('visibility');

  app.set('db', bookshelf);
}

