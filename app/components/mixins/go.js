module.exports = {

  go: function(event, href, name) {
    if ((event) && (event.preventDefault) && (event.currentTarget)) {
      event.preventDefault();
      name = event.currentTarget.name || this.name || undefined;
      href = event.currentTarget.href;
    }
    browser.router.go(href, name);
  }

}
