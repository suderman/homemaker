module.exports = {

  go: function(event) {
    event.preventDefault();
    if (event.target.href) {
      var name = event.target.name || this.name || undefined;
      app.go(event.target.href, name);
    }
  }

}
