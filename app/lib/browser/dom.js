if ((Element) && (Element.prototype)) {

  Element.prototype.hasClass = function (className) {
    return new RegExp(' ' + className + ' ').test(' ' + this.className + ' ');
  };

  Element.prototype.addClass = function (className) {
    if (!this.hasClass(className)) {
      this.className += ' ' + className.trim();
    }
  };

  Element.prototype.removeClass = function (className) {
    var newClass = ' ' + this.className.replace(/[\t\r\n]/g, ' ') + ' '
    if (this.hasClass(className)) {
      while (newClass.indexOf( ' ' + className + ' ') >= 0) {
        newClass = newClass.replace(' ' + className + ' ', ' ');
      }
      this.className = newClass.replace(/^\s+|\s+$/g, ' ').trim();
    }
  };

  Element.prototype.toggleClass = function (className) {
    var newClass = ' ' + this.className.replace(/[\t\r\n]/g, " ") + ' ';
    if (this.hasClass(className)) {
      while (newClass.indexOf(" " + className + " ") >= 0) {
        newClass = newClass.replace(" " + className + " ", " ");
      }
      this.className = newClass.replace(/^\s+|\s+$/g, ' ').trim();
    } else {
      this.className += ' ' + className.trim();
    }
  };

}
