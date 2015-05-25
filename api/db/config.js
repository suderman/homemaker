// Configure database
var fs = require('fs');
module.exports = function(app) {

  var connection = {
    host:       process.env.DB_HOST || '127.0.0.1',
    user:       process.env.DB_USER || 'root',
    database:   process.env.DB_NAME || 'homemaker',
    charset: 'utf8'
  }
  if (process.env.DB_PASS)       connection.password   = process.env.DB_PASS;

  var ssl = {};
  if (process.env.DB_CA) {
    if (process.env.DB_CA)         ssl.ca         = fs.readFileSync(process.env.DB_CA);
    if (process.env.DB_PFX)        ssl.pfx        = fs.readFileSync(process.env.DB_PFX);
    if (process.env.DB_KEY)        ssl.key        = fs.readFileSync(process.env.DB_KEY);
    if (process.env.DB_PASSPHRASE) ssl.passphrase = process.env.DB_PASSPHRASE;
    if (process.env.DB_CERT)       ssl.cert       = fs.readFileSync(process.env.DB_CERT);
    if (process.env.DB_CRL)        ssl.crl        = fs.readFileSync(process.env.DB_CRL);
    if (process.env.DB_CIPHERS)    ssl.ciphers    = process.env.DB_CIPHERS;
    connection.ssl = ssl;
  }

  var knex = require('knex')({
    client: 'mysql',
    debug: false,
    connection: connection
  });

  var bookshelf = require('bookshelf')(knex)

  bookshelf.plugin('registry');
  bookshelf.plugin('virtuals');
  bookshelf.plugin('visibility');

  app.set('db', bookshelf);
}

