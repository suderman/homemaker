module.exports = function(app) {
  require('./model')(app);
  require('./action')(app);
  require('./command')(app);
  require('./device')(app);
  require('./gateway')(app);
  require('./node')(app);
  require('./responder')(app);
  require('./url')(app);
}
