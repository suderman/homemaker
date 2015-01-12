var Offline = Offlinejs();
OfflinejsReconnect(Offline);

module.exports = function(browser) {

  // Create Offline.js object
  var network = {
    offline: Offline,
    state: 'up'
  };

  network.offline.on('down', function() {
    network.state = 'down';
    browser.cache.invalidateAll();

    // Add offline class
    document.body.className = (document.body.className + ' offline').trim();
  });

  network.offline.on('up', function() {
    network.state = 'up';

    // Remove offline class
    document.body.className = document.body.className.replace(/offline/g, '').trim();
  });

  return browser.network = network;
}

// Offline.js require('offline-js/js/offline')
// Copied here because official module assigns to global
// Also integrated this fix to check for 502 - https://github.com/HubSpot/offline/pull/100
function Offlinejs() {
  var Offline, checkXHR, defaultOptions, extendNative, grab, handlers, init;

  extendNative = function(to, from) {
    var e, key, val, _results;
    _results = [];
    for (key in from.prototype) {
      try {
        val = from.prototype[key];
        if ((to[key] == null) && typeof val !== 'function') {
          _results.push(to[key] = val);
        } else {
          _results.push(void 0);
        }
      } catch (_error) {
        e = _error;
      }
    }
    return _results;
  };

  Offline = {};

  if (Offline.options == null) {
    Offline.options = {};
  }

  defaultOptions = {
    checks: {
      xhr: {
        url: function() {
          return "/favicon.ico?_=" + (Math.floor(Math.random() * 1000000000));
        },
        timeout: 5000
      },
      image: {
        url: function() {
          return "/favicon.ico?_=" + (Math.floor(Math.random() * 1000000000));
        }
      },
      active: 'xhr'
    },
    checkOnLoad: false,
    interceptRequests: true,
    reconnect: true
  };

  grab = function(obj, key) {
    var cur, i, part, parts, _i, _len;
    cur = obj;
    parts = key.split('.');
    for (i = _i = 0, _len = parts.length; _i < _len; i = ++_i) {
      part = parts[i];
      cur = cur[part];
      if (typeof cur !== 'object') {
        break;
      }
    }
    if (i === parts.length - 1) {
      return cur;
    } else {
      return void 0;
    }
  };

  Offline.getOption = function(key) {
    var val, _ref;
    val = (_ref = grab(Offline.options, key)) != null ? _ref : grab(defaultOptions, key);
    if (typeof val === 'function') {
      return val();
    } else {
      return val;
    }
  };

  if (typeof window.addEventListener === "function") {
    window.addEventListener('online', function() {
      return setTimeout(Offline.confirmUp, 100);
    }, false);
  }

  if (typeof window.addEventListener === "function") {
    window.addEventListener('offline', function() {
      return Offline.confirmDown();
    }, false);
  }

  Offline.state = 'up';

  Offline.markUp = function() {
    Offline.trigger('confirmed-up');
    if (Offline.state === 'up') {
      return;
    }
    Offline.state = 'up';
    return Offline.trigger('up');
  };

  Offline.markDown = function() {
    Offline.trigger('confirmed-down');
    if (Offline.state === 'down') {
      return;
    }
    Offline.state = 'down';
    return Offline.trigger('down');
  };

  handlers = {};

  Offline.on = function(event, handler, ctx) {
    var e, events, _i, _len, _results;
    events = event.split(' ');
    if (events.length > 1) {
      _results = [];
      for (_i = 0, _len = events.length; _i < _len; _i++) {
        e = events[_i];
        _results.push(Offline.on(e, handler, ctx));
      }
      return _results;
    } else {
      if (handlers[event] == null) {
        handlers[event] = [];
      }
      return handlers[event].push([ctx, handler]);
    }
  };

  Offline.off = function(event, handler) {
    var ctx, i, _handler, _ref, _results;
    if (handlers[event] == null) {
      return;
    }
    if (!handler) {
      return handlers[event] = [];
    } else {
      i = 0;
      _results = [];
      while (i < handlers[event].length) {
        _ref = handlers[event][i], ctx = _ref[0], _handler = _ref[1];
        if (_handler === handler) {
          _results.push(handlers[event].splice(i, 1));
        } else {
          _results.push(i++);
        }
      }
      return _results;
    }
  };

  Offline.trigger = function(event) {
    var ctx, handler, _i, _len, _ref, _ref1, _results;
    if (handlers[event] != null) {
      _ref = handlers[event];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], ctx = _ref1[0], handler = _ref1[1];
        _results.push(handler.call(ctx));
      }
      return _results;
    }
  };

  checkXHR = function(xhr, onUp, onDown) {
    var checkStatus, _onerror, _onload, _onreadystatechange, _ontimeout;
    // checkStatus = function() {
    //   if (xhr.status && xhr.status < 12000) {
    //     return onUp();
    //   } else {
    //     return onDown();
    //   }
    // };
    checkStatus = function() {
      if (xhr.status && xhr.status == 502) {
        return onDown();
      } else if ((xhr.status) && (xhr.status < 12000)) {
        return onUp();
      } else {
        return onDown();
      }
    };
    if (xhr.onprogress === null) {
      _onerror = xhr.onerror;
      xhr.onerror = function() {
        onDown();
        return typeof _onerror === "function" ? _onerror.apply(null, arguments) : void 0;
      };
      _ontimeout = xhr.ontimeout;
      xhr.ontimeout = function() {
        onDown();
        return typeof _ontimeout === "function" ? _ontimeout.apply(null, arguments) : void 0;
      };
      _onload = xhr.onload;
      return xhr.onload = function() {
        checkStatus();
        return typeof _onload === "function" ? _onload.apply(null, arguments) : void 0;
      };
    } else {
      _onreadystatechange = xhr.onreadystatechange;
      return xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          checkStatus();
        } else if (xhr.readyState === 0) {
          onDown();
        }
        return typeof _onreadystatechange === "function" ? _onreadystatechange.apply(null, arguments) : void 0;
      };
    }
  };

  Offline.checks = {};

  Offline.checks.xhr = function() {
    var e, xhr;
    xhr = new XMLHttpRequest;
    xhr.offline = false;
    xhr.open('HEAD', Offline.getOption('checks.xhr.url'), true);
    if (xhr.timeout != null) {
      xhr.timeout = Offline.getOption('checks.xhr.timeout');
    }
    checkXHR(xhr, Offline.markUp, Offline.markDown);
    try {
      xhr.send();
    } catch (_error) {
      e = _error;
      Offline.markDown();
    }
    return xhr;
  };

  Offline.checks.image = function() {
    var img;
    img = document.createElement('img');
    img.onerror = Offline.markDown;
    img.onload = Offline.markUp;
    img.src = Offline.getOption('checks.image.url');
    return void 0;
  };

  Offline.checks.down = Offline.markDown;

  Offline.checks.up = Offline.markUp;

  Offline.check = function() {
    Offline.trigger('checking');
    return Offline.checks[Offline.getOption('checks.active')]();
  };

  Offline.confirmUp = Offline.confirmDown = Offline.check;

  Offline.onXHR = function(cb) {
    var monitorXHR, _XDomainRequest, _XMLHttpRequest;
    monitorXHR = function(req, flags) {
      var _open;
      _open = req.open;
      return req.open = function(type, url, async, user, password) {
        cb({
          type: type,
          url: url,
          async: async,
          flags: flags,
          user: user,
          password: password,
          xhr: req
        });
        return _open.apply(req, arguments);
      };
    };
    _XMLHttpRequest = window.XMLHttpRequest;
    window.XMLHttpRequest = function(flags) {
      var req, _overrideMimeType, _setRequestHeader;
      req = new _XMLHttpRequest(flags);
      monitorXHR(req, flags);
      _setRequestHeader = req.setRequestHeader;
      req.headers = {};
      req.setRequestHeader = function(name, value) {
        req.headers[name] = value;
        return _setRequestHeader.call(req, name, value);
      };
      _overrideMimeType = req.overrideMimeType;
      req.overrideMimeType = function(type) {
        req.mimeType = type;
        return _overrideMimeType.call(req, type);
      };
      return req;
    };
    extendNative(window.XMLHttpRequest, _XMLHttpRequest);
    if (window.XDomainRequest != null) {
      _XDomainRequest = window.XDomainRequest;
      window.XDomainRequest = function() {
        var req;
        req = new _XDomainRequest;
        monitorXHR(req);
        return req;
      };
      return extendNative(window.XDomainRequest, _XDomainRequest);
    }
  };

  init = function() {
    if (Offline.getOption('interceptRequests')) {
      Offline.onXHR(function(_arg) {
        var xhr;
        xhr = _arg.xhr;
        if (xhr.offline !== false) {
          return checkXHR(xhr, Offline.confirmUp, Offline.confirmDown);
        }
      });
    }
    if (Offline.getOption('checkOnLoad')) {
      return Offline.check();
    }
  };

  setTimeout(init, 0);

  // window.Offline = Offline;
  return Offline;
};


// Offline.js require('offline-js/js/reconnect')
function OfflinejsReconnect(Offline) {
  var down, next, nope, rc, reset, retryIntv, tick, tryNow, up;

  // if (!window.Offline) {
  //   throw new Error("Offline Reconnect brought in without offline.js");
  // }

  rc = Offline.reconnect = {};

  retryIntv = null;

  reset = function() {
    var _ref;
    if ((rc.state != null) && rc.state !== 'inactive') {
      Offline.trigger('reconnect:stopped');
    }
    rc.state = 'inactive';
    return rc.remaining = rc.delay = (_ref = Offline.getOption('reconnect.initialDelay')) != null ? _ref : 3;
  };

  next = function() {
    var delay, _ref;
    delay = (_ref = Offline.getOption('reconnect.delay')) != null ? _ref : Math.min(Math.ceil(rc.delay * 1.5), 3600);
    return rc.remaining = rc.delay = delay;
  };

  tick = function() {
    if (rc.state === 'connecting') {
      return;
    }
    rc.remaining -= 1;
    Offline.trigger('reconnect:tick');
    if (rc.remaining === 0) {
      return tryNow();
    }
  };

  tryNow = function() {
    if (rc.state !== 'waiting') {
      return;
    }
    Offline.trigger('reconnect:connecting');
    rc.state = 'connecting';
    return Offline.check();
  };

  down = function() {
    if (!Offline.getOption('reconnect')) {
      return;
    }
    reset();
    rc.state = 'waiting';
    Offline.trigger('reconnect:started');
    return retryIntv = setInterval(tick, 1000);
  };

  up = function() {
    if (retryIntv != null) {
      clearInterval(retryIntv);
    }
    return reset();
  };

  nope = function() {
    if (!Offline.getOption('reconnect')) {
      return;
    }
    if (rc.state === 'connecting') {
      Offline.trigger('reconnect:failure');
      rc.state = 'waiting';
      return next();
    }
  };

  rc.tryNow = tryNow;

  reset();

  Offline.on('down', down);

  Offline.on('confirmed-down', nope);

  Offline.on('up', up);

};
