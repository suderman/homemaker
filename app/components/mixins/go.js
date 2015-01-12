module.exports = {

  // go: function(event) {
  //   event.preventDefault();
  //   if (event.target.href) {
  //     var name = event.target.name || this.name || undefined;
  //     browser.router.go(event.target.href, name);
  //   }
  // }

  go: function(event, href, name) {
    if ((event) && (event.preventDefault) && (event.target)) {
      event.preventDefault();
      name = event.target.name || this.name || undefined;
      href = event.target.href;
    }
    browser.router.go(href, name);
  }

}
