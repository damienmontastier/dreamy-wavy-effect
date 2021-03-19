// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)?\/[^/]+(?:\?.*)?$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"css/reset.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"index.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"/css/reset":"css/reset.css","_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"js/raf.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Raf {
  constructor(fps = 60) {
    this.then = null;
    this.tolerance = 0.1;
    this.interval = 1000 / fps;
    this.rafs = {};
    this.raf = null;
  }

  add(id, callback, priority = 0, once = false) {
    if (typeof callback !== "function") {
      console.error("add() : Callback argument must be a function");
    } else if (this.rafs[id]) {
      console.error(`id : This id: ${id} is already used`);
    } else {
      this.rafs[id] = {
        id,
        callback,
        priority,
        once
      };
    }

    this.then = performance.now();
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  addOnce(id, callback) {
    return this.add(id, callback, priority, true);
  }

  remove(id, callback) {
    if (typeof callback !== "function") {
      console.error("add() : Callback argument must be a function");
    } else if (!this.rafs[id]) {
      console.error(`id: This id : ${id} doesn't exist`);
    } else {
      delete this.rafs[id];
    }
  }

  update(timestamp) {
    const delta = timestamp - this.then;

    if (delta >= this.interval - this.tolerance) {
      this.then = timestamp - delta % this.interval;
      Object.values(this.rafs).sort((a, b) => {
        return a.priority - b.priority;
      }).forEach(raf => {
        // console.log(raf)
        raf.callback();

        if (raf.once) {
          this.remove(raf.id, raf.callback);
        }
      }); // for (let index = 0; index < Object.keys(this.rafs).length; index++) {
      //   const raf = Object.values(this.rafs)[index]
      //   raf.callback()
      //   if (raf.once) {
      //     this.remove(raf.id, raf.callback)
      //   }
      // }
    }

    window.requestAnimationFrame(this.update.bind(this));
  }

}

const instanceRaf = new Raf();
Object.freeze(instanceRaf);

var _default = new Raf();

exports.default = _default;
},{}],"node_modules/events/events.js":[function(require,module,exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict';

var R = typeof Reflect === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};
var ReflectOwnKeys;

if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}

module.exports = EventEmitter;
module.exports.once = once; // Backwards-compat with node 0.10.x

EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.

var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function () {
    return defaultMaxListeners;
  },
  set: function (arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }

    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function () {
  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}; // Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.


EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }

  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];

  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);

  var doError = type === 'error';
  var events = this._events;
  if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false; // If there is no 'error' event listener then throw.

  if (doError) {
    var er;
    if (args.length > 0) er = args[0];

    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    } // At least give some kind of context to the user


    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];
  if (handler === undefined) return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;
  checkListener(listener);
  events = target._events;

  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener); // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object

      events = target._events;
    }

    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener]; // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    } // Check for listener leak


    m = _getMaxListeners(target);

    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true; // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax

      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0) return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = {
    fired: false,
    wrapFn: undefined,
    target: target,
    type: type,
    listener: listener
  };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  checkListener(listener);
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
}; // Emits a 'removeListener' event if and only if the listener was removed.


EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;
  checkListener(listener);
  events = this._events;
  if (events === undefined) return this;
  list = events[type];
  if (list === undefined) return this;

  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = Object.create(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;

    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }

    if (position < 0) return this;
    if (position === 0) list.shift();else {
      spliceOne(list, position);
    }
    if (list.length === 1) events[type] = list[0];
    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;
  events = this._events;
  if (events === undefined) return this; // not listening for removeListener, no need to emit

  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
    }

    return this;
  } // emit removeListener for all listeners on all events


  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;

    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }

    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }

  listeners = events[type];

  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }

  return this;
};

function _listeners(target, type, unwrap) {
  var events = target._events;
  if (events === undefined) return [];
  var evlistener = events[type];
  if (evlistener === undefined) return [];
  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;

function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);

  for (var i = 0; i < n; ++i) copy[i] = arr[i];

  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) list[index] = list[index + 1];

  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);

  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }

  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }

      resolve([].slice.call(arguments));
    }

    ;
    eventTargetAgnosticAddListener(emitter, name, resolver, {
      once: true
    });

    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, {
        once: true
      });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }

      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}
},{}],"js/viewport.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _events = _interopRequireDefault(require("events"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Viewport {
  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.ratio = window.innerWidth / window.innerHeight;
    this.events = new _events.default();
    this.events.setMaxListeners(50);
    this.onWindowResize();
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
  }

  onWindowResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.ratio = this.width / this.height; // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/

    const vh = this.height * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    this.events.emit("resize", this.$data);
  }

}

var _default = new Viewport();

exports.default = _default;
},{"events":"node_modules/events/events.js"}],"node_modules/ogl/src/math/functions/Vec3Func.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.length = length;
exports.copy = copy;
exports.set = set;
exports.add = add;
exports.subtract = subtract;
exports.multiply = multiply;
exports.divide = divide;
exports.scale = scale;
exports.distance = distance;
exports.squaredDistance = squaredDistance;
exports.squaredLength = squaredLength;
exports.negate = negate;
exports.inverse = inverse;
exports.normalize = normalize;
exports.dot = dot;
exports.cross = cross;
exports.lerp = lerp;
exports.transformMat4 = transformMat4;
exports.scaleRotateMat4 = scaleRotateMat4;
exports.transformMat3 = transformMat3;
exports.transformQuat = transformQuat;
exports.exactEquals = exactEquals;
exports.angle = void 0;
const EPSILON = 0.000001;
/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */

function length(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  return Math.sqrt(x * x + y * y + z * z);
}
/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */


function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */


function set(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */


function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */


function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */


function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */


function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}
/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */


function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */


function distance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  return Math.sqrt(x * x + y * y + z * z);
}
/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */


function squaredDistance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  return x * x + y * y + z * z;
}
/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */


function squaredLength(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  return x * x + y * y + z * z;
}
/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */


function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */


function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
}
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */


function normalize(out, a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let len = x * x + y * y + z * z;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */


function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */


function cross(out, a, b) {
  let ax = a[0],
      ay = a[1],
      az = a[2];
  let bx = b[0],
      by = b[1],
      bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */


function lerp(out, a, b, t) {
  let ax = a[0];
  let ay = a[1];
  let az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}
/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */


function transformMat4(out, a, m) {
  let x = a[0],
      y = a[1],
      z = a[2];
  let w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
/**
 * Same as above but doesn't apply translation.
 * Useful for rays.
 */


function scaleRotateMat4(out, a, m) {
  let x = a[0],
      y = a[1],
      z = a[2];
  let w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z) / w;
  return out;
}
/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */


function transformMat3(out, a, m) {
  let x = a[0],
      y = a[1],
      z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */


function transformQuat(out, a, q) {
  // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
  let x = a[0],
      y = a[1],
      z = a[2];
  let qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3];
  let uvx = qy * z - qz * y;
  let uvy = qz * x - qx * z;
  let uvz = qx * y - qy * x;
  let uuvx = qy * uvz - qz * uvy;
  let uuvy = qz * uvx - qx * uvz;
  let uuvz = qx * uvy - qy * uvx;
  let w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2;
  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2;
  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
/**
 * Get the angle between two 3D vectors
 * @param {vec3} a The first operand
 * @param {vec3} b The second operand
 * @returns {Number} The angle in radians
 */


const angle = function () {
  const tempA = [0, 0, 0];
  const tempB = [0, 0, 0];
  return function (a, b) {
    copy(tempA, a);
    copy(tempB, b);
    normalize(tempA, tempA);
    normalize(tempB, tempB);
    let cosine = dot(tempA, tempB);

    if (cosine > 1.0) {
      return 0;
    } else if (cosine < -1.0) {
      return Math.PI;
    } else {
      return Math.acos(cosine);
    }
  };
}();
/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */


exports.angle = angle;

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
},{}],"node_modules/ogl/src/math/Vec3.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vec3 = void 0;

var Vec3Func = _interopRequireWildcard(require("./functions/Vec3Func.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class Vec3 extends Array {
  constructor(x = 0, y = x, z = x) {
    super(x, y, z);
    return this;
  }

  get x() {
    return this[0];
  }

  get y() {
    return this[1];
  }

  get z() {
    return this[2];
  }

  set x(v) {
    this[0] = v;
  }

  set y(v) {
    this[1] = v;
  }

  set z(v) {
    this[2] = v;
  }

  set(x, y = x, z = x) {
    if (x.length) return this.copy(x);
    Vec3Func.set(this, x, y, z);
    return this;
  }

  copy(v) {
    Vec3Func.copy(this, v);
    return this;
  }

  add(va, vb) {
    if (vb) Vec3Func.add(this, va, vb);else Vec3Func.add(this, this, va);
    return this;
  }

  sub(va, vb) {
    if (vb) Vec3Func.subtract(this, va, vb);else Vec3Func.subtract(this, this, va);
    return this;
  }

  multiply(v) {
    if (v.length) Vec3Func.multiply(this, this, v);else Vec3Func.scale(this, this, v);
    return this;
  }

  divide(v) {
    if (v.length) Vec3Func.divide(this, this, v);else Vec3Func.scale(this, this, 1 / v);
    return this;
  }

  inverse(v = this) {
    Vec3Func.inverse(this, v);
    return this;
  } // Can't use 'length' as Array.prototype uses it


  len() {
    return Vec3Func.length(this);
  }

  distance(v) {
    if (v) return Vec3Func.distance(this, v);else return Vec3Func.length(this);
  }

  squaredLen() {
    return Vec3Func.squaredLength(this);
  }

  squaredDistance(v) {
    if (v) return Vec3Func.squaredDistance(this, v);else return Vec3Func.squaredLength(this);
  }

  negate(v = this) {
    Vec3Func.negate(this, v);
    return this;
  }

  cross(va, vb) {
    if (vb) Vec3Func.cross(this, va, vb);else Vec3Func.cross(this, this, va);
    return this;
  }

  scale(v) {
    Vec3Func.scale(this, this, v);
    return this;
  }

  normalize() {
    Vec3Func.normalize(this, this);
    return this;
  }

  dot(v) {
    return Vec3Func.dot(this, v);
  }

  equals(v) {
    return Vec3Func.exactEquals(this, v);
  }

  applyMatrix4(mat4) {
    Vec3Func.transformMat4(this, this, mat4);
    return this;
  }

  scaleRotateMatrix4(mat4) {
    Vec3Func.scaleRotateMat4(this, this, mat4);
    return this;
  }

  applyQuaternion(q) {
    Vec3Func.transformQuat(this, this, q);
    return this;
  }

  angle(v) {
    return Vec3Func.angle(this, v);
  }

  lerp(v, t) {
    Vec3Func.lerp(this, this, v, t);
    return this;
  }

  clone() {
    return new Vec3(this[0], this[1], this[2]);
  }

  fromArray(a, o = 0) {
    this[0] = a[o];
    this[1] = a[o + 1];
    this[2] = a[o + 2];
    return this;
  }

  toArray(a = [], o = 0) {
    a[o] = this[0];
    a[o + 1] = this[1];
    a[o + 2] = this[2];
    return a;
  }

  transformDirection(mat4) {
    const x = this[0];
    const y = this[1];
    const z = this[2];
    this[0] = mat4[0] * x + mat4[4] * y + mat4[8] * z;
    this[1] = mat4[1] * x + mat4[5] * y + mat4[9] * z;
    this[2] = mat4[2] * x + mat4[6] * y + mat4[10] * z;
    return this.normalize();
  }

}

exports.Vec3 = Vec3;
},{"./functions/Vec3Func.js":"node_modules/ogl/src/math/functions/Vec3Func.js"}],"node_modules/ogl/src/core/Geometry.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Geometry = void 0;

var _Vec = require("../math/Vec3.js");

// attribute params
// {
//     data - typed array eg UInt16Array for indices, Float32Array
//     size - int default 1
//     instanced - default null. Pass divisor amount
//     type - gl enum default gl.UNSIGNED_SHORT for 'index', gl.FLOAT for others
//     normalized - boolean default false
//     buffer - gl buffer, if buffer exists, don't need to provide data
//     stride - default 0 - for when passing in buffer
//     offset - default 0 - for when passing in buffer
//     count - default null - for when passing in buffer
//     min - array - for when passing in buffer
//     max - array - for when passing in buffer
// }
// TODO: fit in transform feedback
// TODO: when would I disableVertexAttribArray ?
// TODO: use offset/stride if exists
const tempVec3 = new _Vec.Vec3();
let ID = 1;
let ATTR_ID = 1; // To stop inifinite warnings

let isBoundsWarned = false;

class Geometry {
  constructor(gl, attributes = {}) {
    if (!gl.canvas) console.error('gl not passed as first argument to Geometry');
    this.gl = gl;
    this.attributes = attributes;
    this.id = ID++; // Store one VAO per program attribute locations order

    this.VAOs = {};
    this.drawRange = {
      start: 0,
      count: 0
    };
    this.instancedCount = 0; // Unbind current VAO so that new buffers don't get added to active mesh

    this.gl.renderer.bindVertexArray(null);
    this.gl.renderer.currentGeometry = null; // Alias for state store to avoid redundant calls for global state

    this.glState = this.gl.renderer.state; // create the buffers

    for (let key in attributes) {
      this.addAttribute(key, attributes[key]);
    }
  }

  addAttribute(key, attr) {
    this.attributes[key] = attr; // Set options

    attr.id = ATTR_ID++; // TODO: currently unused, remove?

    attr.size = attr.size || 1;
    attr.type = attr.type || (attr.data.constructor === Float32Array ? this.gl.FLOAT : attr.data.constructor === Uint16Array ? this.gl.UNSIGNED_SHORT : this.gl.UNSIGNED_INT); // Uint32Array

    attr.target = key === 'index' ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER;
    attr.normalized = attr.normalized || false;
    attr.stride = attr.stride || 0;
    attr.offset = attr.offset || 0;
    attr.count = attr.count || (attr.stride ? attr.data.byteLength / attr.stride : attr.data.length / attr.size);
    attr.divisor = attr.instanced || 0;
    attr.needsUpdate = false;

    if (!attr.buffer) {
      attr.buffer = this.gl.createBuffer(); // Push data to buffer

      this.updateAttribute(attr);
    } // Update geometry counts. If indexed, ignore regular attributes


    if (attr.divisor) {
      this.isInstanced = true;

      if (this.instancedCount && this.instancedCount !== attr.count * attr.divisor) {
        console.warn('geometry has multiple instanced buffers of different length');
        return this.instancedCount = Math.min(this.instancedCount, attr.count * attr.divisor);
      }

      this.instancedCount = attr.count * attr.divisor;
    } else if (key === 'index') {
      this.drawRange.count = attr.count;
    } else if (!this.attributes.index) {
      this.drawRange.count = Math.max(this.drawRange.count, attr.count);
    }
  }

  updateAttribute(attr) {
    if (this.glState.boundBuffer !== attr.buffer) {
      this.gl.bindBuffer(attr.target, attr.buffer);
      this.glState.boundBuffer = attr.buffer;
    }

    this.gl.bufferData(attr.target, attr.data, this.gl.STATIC_DRAW);
    attr.needsUpdate = false;
  }

  setIndex(value) {
    this.addAttribute('index', value);
  }

  setDrawRange(start, count) {
    this.drawRange.start = start;
    this.drawRange.count = count;
  }

  setInstancedCount(value) {
    this.instancedCount = value;
  }

  createVAO(program) {
    this.VAOs[program.attributeOrder] = this.gl.renderer.createVertexArray();
    this.gl.renderer.bindVertexArray(this.VAOs[program.attributeOrder]);
    this.bindAttributes(program);
  }

  bindAttributes(program) {
    // Link all attributes to program using gl.vertexAttribPointer
    program.attributeLocations.forEach((location, {
      name,
      type
    }) => {
      // If geometry missing a required shader attribute
      if (!this.attributes[name]) {
        console.warn(`active attribute ${name} not being supplied`);
        return;
      }

      const attr = this.attributes[name];
      this.gl.bindBuffer(attr.target, attr.buffer);
      this.glState.boundBuffer = attr.buffer; // For matrix attributes, buffer needs to be defined per column

      let numLoc = 1;
      if (type === 35674) numLoc = 2; // mat2

      if (type === 35675) numLoc = 3; // mat3

      if (type === 35676) numLoc = 4; // mat4

      const size = attr.size / numLoc;
      const stride = numLoc === 1 ? 0 : numLoc * numLoc * numLoc;
      const offset = numLoc === 1 ? 0 : numLoc * numLoc;

      for (let i = 0; i < numLoc; i++) {
        this.gl.vertexAttribPointer(location + i, size, attr.type, attr.normalized, attr.stride + stride, attr.offset + i * offset);
        this.gl.enableVertexAttribArray(location + i); // For instanced attributes, divisor needs to be set.
        // For firefox, need to set back to 0 if non-instanced drawn after instanced. Else won't render

        this.gl.renderer.vertexAttribDivisor(location + i, attr.divisor);
      }
    }); // Bind indices if geometry indexed

    if (this.attributes.index) this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.attributes.index.buffer);
  }

  draw({
    program,
    mode = this.gl.TRIANGLES
  }) {
    if (this.gl.renderer.currentGeometry !== `${this.id}_${program.attributeOrder}`) {
      if (!this.VAOs[program.attributeOrder]) this.createVAO(program);
      this.gl.renderer.bindVertexArray(this.VAOs[program.attributeOrder]);
      this.gl.renderer.currentGeometry = `${this.id}_${program.attributeOrder}`;
    } // Check if any attributes need updating


    program.attributeLocations.forEach((location, {
      name
    }) => {
      const attr = this.attributes[name];
      if (attr.needsUpdate) this.updateAttribute(attr);
    });

    if (this.isInstanced) {
      if (this.attributes.index) {
        this.gl.renderer.drawElementsInstanced(mode, this.drawRange.count, this.attributes.index.type, this.attributes.index.offset + this.drawRange.start * 2, this.instancedCount);
      } else {
        this.gl.renderer.drawArraysInstanced(mode, this.drawRange.start, this.drawRange.count, this.instancedCount);
      }
    } else {
      if (this.attributes.index) {
        this.gl.drawElements(mode, this.drawRange.count, this.attributes.index.type, this.attributes.index.offset + this.drawRange.start * 2);
      } else {
        this.gl.drawArrays(mode, this.drawRange.start, this.drawRange.count);
      }
    }
  }

  getPositionArray() {
    // Use position buffer, or min/max if available
    const attr = this.attributes.position; // if (attr.min) return [...attr.min, ...attr.max];

    if (attr.data) return attr.data;
    if (isBoundsWarned) return;
    console.warn('No position buffer data found to compute bounds');
    return isBoundsWarned = true;
  }

  computeBoundingBox(array) {
    if (!array) array = this.getPositionArray();

    if (!this.bounds) {
      this.bounds = {
        min: new _Vec.Vec3(),
        max: new _Vec.Vec3(),
        center: new _Vec.Vec3(),
        scale: new _Vec.Vec3(),
        radius: Infinity
      };
    }

    const min = this.bounds.min;
    const max = this.bounds.max;
    const center = this.bounds.center;
    const scale = this.bounds.scale;
    min.set(+Infinity);
    max.set(-Infinity); // TODO: use offset/stride if exists
    // TODO: check size of position (eg triangle with Vec2)

    for (let i = 0, l = array.length; i < l; i += 3) {
      const x = array[i];
      const y = array[i + 1];
      const z = array[i + 2];
      min.x = Math.min(x, min.x);
      min.y = Math.min(y, min.y);
      min.z = Math.min(z, min.z);
      max.x = Math.max(x, max.x);
      max.y = Math.max(y, max.y);
      max.z = Math.max(z, max.z);
    }

    scale.sub(max, min);
    center.add(min, max).divide(2);
  }

  computeBoundingSphere(array) {
    if (!array) array = this.getPositionArray();
    if (!this.bounds) this.computeBoundingBox(array);
    let maxRadiusSq = 0;

    for (let i = 0, l = array.length; i < l; i += 3) {
      tempVec3.fromArray(array, i);
      maxRadiusSq = Math.max(maxRadiusSq, this.bounds.center.squaredDistance(tempVec3));
    }

    this.bounds.radius = Math.sqrt(maxRadiusSq);
  }

  remove() {
    if (this.vao) this.gl.renderer.deleteVertexArray(this.vao);

    for (let key in this.attributes) {
      this.gl.deleteBuffer(this.attributes[key].buffer);
      delete this.attributes[key];
    }
  }

}

exports.Geometry = Geometry;
},{"../math/Vec3.js":"node_modules/ogl/src/math/Vec3.js"}],"node_modules/ogl/src/core/Program.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Program = void 0;
// TODO: upload empty texture if null ? maybe not
// TODO: upload identity matrix if null ?
// TODO: sampler Cube
let ID = 1; // cache of typed arrays used to flatten uniform arrays

const arrayCacheF32 = {};

class Program {
  constructor(gl, {
    vertex,
    fragment,
    uniforms = {},
    transparent = false,
    cullFace = gl.BACK,
    frontFace = gl.CCW,
    depthTest = true,
    depthWrite = true,
    depthFunc = gl.LESS
  } = {}) {
    if (!gl.canvas) console.error('gl not passed as fist argument to Program');
    this.gl = gl;
    this.uniforms = uniforms;
    this.id = ID++;
    if (!vertex) console.warn('vertex shader not supplied');
    if (!fragment) console.warn('fragment shader not supplied'); // Store program state

    this.transparent = transparent;
    this.cullFace = cullFace;
    this.frontFace = frontFace;
    this.depthTest = depthTest;
    this.depthWrite = depthWrite;
    this.depthFunc = depthFunc;
    this.blendFunc = {};
    this.blendEquation = {}; // set default blendFunc if transparent flagged

    if (this.transparent && !this.blendFunc.src) {
      if (this.gl.renderer.premultipliedAlpha) this.setBlendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);else this.setBlendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    } // compile vertex shader and log errors


    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertex);
    gl.compileShader(vertexShader);

    if (gl.getShaderInfoLog(vertexShader) !== '') {
      console.warn(`${gl.getShaderInfoLog(vertexShader)}\nVertex Shader\n${addLineNumbers(vertex)}`);
    } // compile fragment shader and log errors


    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragment);
    gl.compileShader(fragmentShader);

    if (gl.getShaderInfoLog(fragmentShader) !== '') {
      console.warn(`${gl.getShaderInfoLog(fragmentShader)}\nFragment Shader\n${addLineNumbers(fragment)}`);
    } // compile program and log errors


    this.program = gl.createProgram();
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      return console.warn(gl.getProgramInfoLog(this.program));
    } // Remove shader once linked


    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader); // Get active uniform locations

    this.uniformLocations = new Map();
    let numUniforms = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);

    for (let uIndex = 0; uIndex < numUniforms; uIndex++) {
      let uniform = gl.getActiveUniform(this.program, uIndex);
      this.uniformLocations.set(uniform, gl.getUniformLocation(this.program, uniform.name)); // split uniforms' names to separate array and struct declarations

      const split = uniform.name.match(/(\w+)/g);
      uniform.uniformName = split[0];

      if (split.length === 3) {
        uniform.isStructArray = true;
        uniform.structIndex = Number(split[1]);
        uniform.structProperty = split[2];
      } else if (split.length === 2 && isNaN(Number(split[1]))) {
        uniform.isStruct = true;
        uniform.structProperty = split[1];
      }
    } // Get active attribute locations


    this.attributeLocations = new Map();
    const locations = [];
    const numAttribs = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES);

    for (let aIndex = 0; aIndex < numAttribs; aIndex++) {
      const attribute = gl.getActiveAttrib(this.program, aIndex);
      const location = gl.getAttribLocation(this.program, attribute.name);
      locations[location] = attribute.name;
      this.attributeLocations.set(attribute, location);
    }

    this.attributeOrder = locations.join('');
  }

  setBlendFunc(src, dst, srcAlpha, dstAlpha) {
    this.blendFunc.src = src;
    this.blendFunc.dst = dst;
    this.blendFunc.srcAlpha = srcAlpha;
    this.blendFunc.dstAlpha = dstAlpha;
    if (src) this.transparent = true;
  }

  setBlendEquation(modeRGB, modeAlpha) {
    this.blendEquation.modeRGB = modeRGB;
    this.blendEquation.modeAlpha = modeAlpha;
  }

  applyState() {
    if (this.depthTest) this.gl.renderer.enable(this.gl.DEPTH_TEST);else this.gl.renderer.disable(this.gl.DEPTH_TEST);
    if (this.cullFace) this.gl.renderer.enable(this.gl.CULL_FACE);else this.gl.renderer.disable(this.gl.CULL_FACE);
    if (this.blendFunc.src) this.gl.renderer.enable(this.gl.BLEND);else this.gl.renderer.disable(this.gl.BLEND);
    if (this.cullFace) this.gl.renderer.setCullFace(this.cullFace);
    this.gl.renderer.setFrontFace(this.frontFace);
    this.gl.renderer.setDepthMask(this.depthWrite);
    this.gl.renderer.setDepthFunc(this.depthFunc);
    if (this.blendFunc.src) this.gl.renderer.setBlendFunc(this.blendFunc.src, this.blendFunc.dst, this.blendFunc.srcAlpha, this.blendFunc.dstAlpha);
    this.gl.renderer.setBlendEquation(this.blendEquation.modeRGB, this.blendEquation.modeAlpha);
  }

  use({
    flipFaces = false
  } = {}) {
    let textureUnit = -1;
    const programActive = this.gl.renderer.currentProgram === this.id; // Avoid gl call if program already in use

    if (!programActive) {
      this.gl.useProgram(this.program);
      this.gl.renderer.currentProgram = this.id;
    } // Set only the active uniforms found in the shader


    this.uniformLocations.forEach((location, activeUniform) => {
      let name = activeUniform.uniformName; // get supplied uniform

      let uniform = this.uniforms[name]; // For structs, get the specific property instead of the entire object

      if (activeUniform.isStruct) {
        uniform = uniform[activeUniform.structProperty];
        name += `.${activeUniform.structProperty}`;
      }

      if (activeUniform.isStructArray) {
        uniform = uniform[activeUniform.structIndex][activeUniform.structProperty];
        name += `[${activeUniform.structIndex}].${activeUniform.structProperty}`;
      }

      if (!uniform) {
        return warn(`Active uniform ${name} has not been supplied`);
      }

      if (uniform && uniform.value === undefined) {
        return warn(`${name} uniform is missing a value parameter`);
      }

      if (uniform.value.texture) {
        textureUnit = textureUnit + 1; // Check if texture needs to be updated

        uniform.value.update(textureUnit);
        return setUniform(this.gl, activeUniform.type, location, textureUnit);
      } // For texture arrays, set uniform as an array of texture units instead of just one


      if (uniform.value.length && uniform.value[0].texture) {
        const textureUnits = [];
        uniform.value.forEach(value => {
          textureUnit = textureUnit + 1;
          value.update(textureUnit);
          textureUnits.push(textureUnit);
        });
        return setUniform(this.gl, activeUniform.type, location, textureUnits);
      }

      setUniform(this.gl, activeUniform.type, location, uniform.value);
    });
    this.applyState();
    if (flipFaces) this.gl.renderer.setFrontFace(this.frontFace === this.gl.CCW ? this.gl.CW : this.gl.CCW);
  }

  remove() {
    this.gl.deleteProgram(this.program);
  }

}

exports.Program = Program;

function setUniform(gl, type, location, value) {
  value = value.length ? flatten(value) : value;
  const setValue = gl.renderer.state.uniformLocations.get(location); // Avoid redundant uniform commands

  if (value.length) {
    if (setValue === undefined || setValue.length !== value.length) {
      // clone array to store as cache
      gl.renderer.state.uniformLocations.set(location, value.slice(0));
    } else {
      if (arraysEqual(setValue, value)) return; // Update cached array values

      setValue.set ? setValue.set(value) : setArray(setValue, value);
      gl.renderer.state.uniformLocations.set(location, setValue);
    }
  } else {
    if (setValue === value) return;
    gl.renderer.state.uniformLocations.set(location, value);
  }

  switch (type) {
    case 5126:
      return value.length ? gl.uniform1fv(location, value) : gl.uniform1f(location, value);
    // FLOAT

    case 35664:
      return gl.uniform2fv(location, value);
    // FLOAT_VEC2

    case 35665:
      return gl.uniform3fv(location, value);
    // FLOAT_VEC3

    case 35666:
      return gl.uniform4fv(location, value);
    // FLOAT_VEC4

    case 35670: // BOOL

    case 5124: // INT

    case 35678: // SAMPLER_2D

    case 35680:
      return value.length ? gl.uniform1iv(location, value) : gl.uniform1i(location, value);
    // SAMPLER_CUBE

    case 35671: // BOOL_VEC2

    case 35667:
      return gl.uniform2iv(location, value);
    // INT_VEC2

    case 35672: // BOOL_VEC3

    case 35668:
      return gl.uniform3iv(location, value);
    // INT_VEC3

    case 35673: // BOOL_VEC4

    case 35669:
      return gl.uniform4iv(location, value);
    // INT_VEC4

    case 35674:
      return gl.uniformMatrix2fv(location, false, value);
    // FLOAT_MAT2

    case 35675:
      return gl.uniformMatrix3fv(location, false, value);
    // FLOAT_MAT3

    case 35676:
      return gl.uniformMatrix4fv(location, false, value);
    // FLOAT_MAT4
  }
}

function addLineNumbers(string) {
  let lines = string.split('\n');

  for (let i = 0; i < lines.length; i++) {
    lines[i] = i + 1 + ': ' + lines[i];
  }

  return lines.join('\n');
}

function flatten(a) {
  const arrayLen = a.length;
  const valueLen = a[0].length;
  if (valueLen === undefined) return a;
  const length = arrayLen * valueLen;
  let value = arrayCacheF32[length];
  if (!value) arrayCacheF32[length] = value = new Float32Array(length);

  for (let i = 0; i < arrayLen; i++) value.set(a[i], i * valueLen);

  return value;
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;

  for (let i = 0, l = a.length; i < l; i++) {
    if (a[i] !== b[i]) return false;
  }

  return true;
}

function setArray(a, b) {
  for (let i = 0, l = a.length; i < l; i++) {
    a[i] = b[i];
  }
}

let warnCount = 0;

function warn(message) {
  if (warnCount > 100) return;
  console.warn(message);
  warnCount++;
  if (warnCount > 100) console.warn('More than 100 program warnings - stopping logs.');
}
},{}],"node_modules/ogl/src/core/Renderer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Renderer = void 0;

var _Vec = require("../math/Vec3.js");

// TODO: Handle context loss https://www.khronos.org/webgl/wiki/HandlingContextLost
// Not automatic - devs to use these methods manually
// gl.colorMask( colorMask, colorMask, colorMask, colorMask );
// gl.clearColor( r, g, b, a );
// gl.stencilMask( stencilMask );
// gl.stencilFunc( stencilFunc, stencilRef, stencilMask );
// gl.stencilOp( stencilFail, stencilZFail, stencilZPass );
// gl.clearStencil( stencil );
const tempVec3 = new _Vec.Vec3();
let ID = 1;

class Renderer {
  constructor({
    canvas = document.createElement('canvas'),
    width = 300,
    height = 150,
    dpr = 1,
    alpha = false,
    depth = true,
    stencil = false,
    antialias = false,
    premultipliedAlpha = false,
    preserveDrawingBuffer = false,
    powerPreference = 'default',
    autoClear = true,
    webgl = 2
  } = {}) {
    const attributes = {
      alpha,
      depth,
      stencil,
      antialias,
      premultipliedAlpha,
      preserveDrawingBuffer,
      powerPreference
    };
    this.dpr = dpr;
    this.alpha = alpha;
    this.color = true;
    this.depth = depth;
    this.stencil = stencil;
    this.premultipliedAlpha = premultipliedAlpha;
    this.autoClear = autoClear;
    this.id = ID++; // Attempt WebGL2 unless forced to 1, if not supported fallback to WebGL1

    if (webgl === 2) this.gl = canvas.getContext('webgl2', attributes);
    this.isWebgl2 = !!this.gl;

    if (!this.gl) {
      this.gl = canvas.getContext('webgl', attributes) || canvas.getContext('experimental-webgl', attributes);
    }

    if (!this.gl) console.error('unable to create webgl context'); // Attach renderer to gl so that all classes have access to internal state functions

    this.gl.renderer = this; // initialise size values

    this.setSize(width, height); // gl state stores to avoid redundant calls on methods used internally

    this.state = {};
    this.state.blendFunc = {
      src: this.gl.ONE,
      dst: this.gl.ZERO
    };
    this.state.blendEquation = {
      modeRGB: this.gl.FUNC_ADD
    };
    this.state.cullFace = null;
    this.state.frontFace = this.gl.CCW;
    this.state.depthMask = true;
    this.state.depthFunc = this.gl.LESS;
    this.state.premultiplyAlpha = false;
    this.state.flipY = false;
    this.state.unpackAlignment = 4;
    this.state.framebuffer = null;
    this.state.viewport = {
      width: null,
      height: null
    };
    this.state.textureUnits = [];
    this.state.activeTextureUnit = 0;
    this.state.boundBuffer = null;
    this.state.uniformLocations = new Map(); // store requested extensions

    this.extensions = {}; // Initialise extra format types

    if (this.isWebgl2) {
      this.getExtension('EXT_color_buffer_float');
      this.getExtension('OES_texture_float_linear');
    } else {
      this.getExtension('OES_texture_float');
      this.getExtension('OES_texture_float_linear');
      this.getExtension('OES_texture_half_float');
      this.getExtension('OES_texture_half_float_linear');
      this.getExtension('OES_element_index_uint');
      this.getExtension('OES_standard_derivatives');
      this.getExtension('EXT_sRGB');
      this.getExtension('WEBGL_depth_texture');
      this.getExtension('WEBGL_draw_buffers');
    } // Create method aliases using extension (WebGL1) or native if available (WebGL2)


    this.vertexAttribDivisor = this.getExtension('ANGLE_instanced_arrays', 'vertexAttribDivisor', 'vertexAttribDivisorANGLE');
    this.drawArraysInstanced = this.getExtension('ANGLE_instanced_arrays', 'drawArraysInstanced', 'drawArraysInstancedANGLE');
    this.drawElementsInstanced = this.getExtension('ANGLE_instanced_arrays', 'drawElementsInstanced', 'drawElementsInstancedANGLE');
    this.createVertexArray = this.getExtension('OES_vertex_array_object', 'createVertexArray', 'createVertexArrayOES');
    this.bindVertexArray = this.getExtension('OES_vertex_array_object', 'bindVertexArray', 'bindVertexArrayOES');
    this.deleteVertexArray = this.getExtension('OES_vertex_array_object', 'deleteVertexArray', 'deleteVertexArrayOES');
    this.drawBuffers = this.getExtension('WEBGL_draw_buffers', 'drawBuffers', 'drawBuffersWEBGL'); // Store device parameters

    this.parameters = {};
    this.parameters.maxTextureUnits = this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
    this.parameters.maxAnisotropy = this.getExtension('EXT_texture_filter_anisotropic') ? this.gl.getParameter(this.getExtension('EXT_texture_filter_anisotropic').MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0;
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.gl.canvas.width = width * this.dpr;
    this.gl.canvas.height = height * this.dpr;
    Object.assign(this.gl.canvas.style, {
      width: width + 'px',
      height: height + 'px'
    });
  }

  setViewport(width, height) {
    if (this.state.viewport.width === width && this.state.viewport.height === height) return;
    this.state.viewport.width = width;
    this.state.viewport.height = height;
    this.gl.viewport(0, 0, width, height);
  }

  enable(id) {
    if (this.state[id] === true) return;
    this.gl.enable(id);
    this.state[id] = true;
  }

  disable(id) {
    if (this.state[id] === false) return;
    this.gl.disable(id);
    this.state[id] = false;
  }

  setBlendFunc(src, dst, srcAlpha, dstAlpha) {
    if (this.state.blendFunc.src === src && this.state.blendFunc.dst === dst && this.state.blendFunc.srcAlpha === srcAlpha && this.state.blendFunc.dstAlpha === dstAlpha) return;
    this.state.blendFunc.src = src;
    this.state.blendFunc.dst = dst;
    this.state.blendFunc.srcAlpha = srcAlpha;
    this.state.blendFunc.dstAlpha = dstAlpha;
    if (srcAlpha !== undefined) this.gl.blendFuncSeparate(src, dst, srcAlpha, dstAlpha);else this.gl.blendFunc(src, dst);
  }

  setBlendEquation(modeRGB, modeAlpha) {
    modeRGB = modeRGB || this.gl.FUNC_ADD;
    if (this.state.blendEquation.modeRGB === modeRGB && this.state.blendEquation.modeAlpha === modeAlpha) return;
    this.state.blendEquation.modeRGB = modeRGB;
    this.state.blendEquation.modeAlpha = modeAlpha;
    if (modeAlpha !== undefined) this.gl.blendEquationSeparate(modeRGB, modeAlpha);else this.gl.blendEquation(modeRGB);
  }

  setCullFace(value) {
    if (this.state.cullFace === value) return;
    this.state.cullFace = value;
    this.gl.cullFace(value);
  }

  setFrontFace(value) {
    if (this.state.frontFace === value) return;
    this.state.frontFace = value;
    this.gl.frontFace(value);
  }

  setDepthMask(value) {
    if (this.state.depthMask === value) return;
    this.state.depthMask = value;
    this.gl.depthMask(value);
  }

  setDepthFunc(value) {
    if (this.state.depthFunc === value) return;
    this.state.depthFunc = value;
    this.gl.depthFunc(value);
  }

  activeTexture(value) {
    if (this.state.activeTextureUnit === value) return;
    this.state.activeTextureUnit = value;
    this.gl.activeTexture(this.gl.TEXTURE0 + value);
  }

  bindFramebuffer({
    target = this.gl.FRAMEBUFFER,
    buffer = null
  } = {}) {
    if (this.state.framebuffer === buffer) return;
    this.state.framebuffer = buffer;
    this.gl.bindFramebuffer(target, buffer);
  }

  getExtension(extension, webgl2Func, extFunc) {
    // if webgl2 function supported, return func bound to gl context
    if (webgl2Func && this.gl[webgl2Func]) return this.gl[webgl2Func].bind(this.gl); // fetch extension once only

    if (!this.extensions[extension]) {
      this.extensions[extension] = this.gl.getExtension(extension);
    } // return extension if no function requested


    if (!webgl2Func) return this.extensions[extension]; // Return null if extension not supported

    if (!this.extensions[extension]) return null; // return extension function, bound to extension

    return this.extensions[extension][extFunc].bind(this.extensions[extension]);
  }

  sortOpaque(a, b) {
    if (a.renderOrder !== b.renderOrder) {
      return a.renderOrder - b.renderOrder;
    } else if (a.program.id !== b.program.id) {
      return a.program.id - b.program.id;
    } else if (a.zDepth !== b.zDepth) {
      return a.zDepth - b.zDepth;
    } else {
      return b.id - a.id;
    }
  }

  sortTransparent(a, b) {
    if (a.renderOrder !== b.renderOrder) {
      return a.renderOrder - b.renderOrder;
    }

    if (a.zDepth !== b.zDepth) {
      return b.zDepth - a.zDepth;
    } else {
      return b.id - a.id;
    }
  }

  sortUI(a, b) {
    if (a.renderOrder !== b.renderOrder) {
      return a.renderOrder - b.renderOrder;
    } else if (a.program.id !== b.program.id) {
      return a.program.id - b.program.id;
    } else {
      return b.id - a.id;
    }
  }

  getRenderList({
    scene,
    camera,
    frustumCull,
    sort
  }) {
    let renderList = [];
    if (camera && frustumCull) camera.updateFrustum(); // Get visible

    scene.traverse(node => {
      if (!node.visible) return true;
      if (!node.draw) return;

      if (frustumCull && node.frustumCulled && camera) {
        if (!camera.frustumIntersectsMesh(node)) return;
      }

      renderList.push(node);
    });

    if (sort) {
      const opaque = [];
      const transparent = []; // depthTest true

      const ui = []; // depthTest false

      renderList.forEach(node => {
        // Split into the 3 render groups
        if (!node.program.transparent) {
          opaque.push(node);
        } else if (node.program.depthTest) {
          transparent.push(node);
        } else {
          ui.push(node);
        }

        node.zDepth = 0; // Only calculate z-depth if renderOrder unset and depthTest is true

        if (node.renderOrder !== 0 || !node.program.depthTest || !camera) return; // update z-depth

        node.worldMatrix.getTranslation(tempVec3);
        tempVec3.applyMatrix4(camera.projectionViewMatrix);
        node.zDepth = tempVec3.z;
      });
      opaque.sort(this.sortOpaque);
      transparent.sort(this.sortTransparent);
      ui.sort(this.sortUI);
      renderList = opaque.concat(transparent, ui);
    }

    return renderList;
  }

  render({
    scene,
    camera,
    target = null,
    update = true,
    sort = true,
    frustumCull = true,
    clear
  }) {
    if (target === null) {
      // make sure no render target bound so draws to canvas
      this.bindFramebuffer();
      this.setViewport(this.width * this.dpr, this.height * this.dpr);
    } else {
      // bind supplied render target and update viewport
      this.bindFramebuffer(target);
      this.setViewport(target.width, target.height);
    }

    if (clear || this.autoClear && clear !== false) {
      // Ensure depth buffer writing is enabled so it can be cleared
      if (this.depth && (!target || target.depth)) {
        this.enable(this.gl.DEPTH_TEST);
        this.setDepthMask(true);
      }

      this.gl.clear((this.color ? this.gl.COLOR_BUFFER_BIT : 0) | (this.depth ? this.gl.DEPTH_BUFFER_BIT : 0) | (this.stencil ? this.gl.STENCIL_BUFFER_BIT : 0));
    } // updates all scene graph matrices


    if (update) scene.updateMatrixWorld(); // Update camera separately, in case not in scene graph

    if (camera) camera.updateMatrixWorld(); // Get render list - entails culling and sorting

    const renderList = this.getRenderList({
      scene,
      camera,
      frustumCull,
      sort
    });
    renderList.forEach(node => {
      node.draw({
        camera
      });
    });
  }

}

exports.Renderer = Renderer;
},{"../math/Vec3.js":"node_modules/ogl/src/math/Vec3.js"}],"node_modules/ogl/src/math/functions/Vec4Func.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copy = copy;
exports.set = set;
exports.add = add;
exports.scale = scale;
exports.length = length;
exports.normalize = normalize;
exports.dot = dot;
exports.lerp = lerp;
const EPSILON = 0.000001;
/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */


function set(out, x, y, z, w) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */


function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}
/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */


function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}
/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */


function length(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let w = a[3];
  return Math.sqrt(x * x + y * y + z * z + w * w);
}
/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */


function normalize(out, a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let w = a[3];
  let len = x * x + y * y + z * z + w * w;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }

  out[0] = x * len;
  out[1] = y * len;
  out[2] = z * len;
  out[3] = w * len;
  return out;
}
/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */


function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}
/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */


function lerp(out, a, b, t) {
  let ax = a[0];
  let ay = a[1];
  let az = a[2];
  let aw = a[3];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  out[3] = aw + t * (b[3] - aw);
  return out;
}
},{}],"node_modules/ogl/src/math/functions/QuatFunc.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.identity = identity;
exports.setAxisAngle = setAxisAngle;
exports.multiply = multiply;
exports.rotateX = rotateX;
exports.rotateY = rotateY;
exports.rotateZ = rotateZ;
exports.slerp = slerp;
exports.invert = invert;
exports.conjugate = conjugate;
exports.fromMat3 = fromMat3;
exports.fromEuler = fromEuler;
exports.normalize = exports.length = exports.lerp = exports.dot = exports.scale = exports.add = exports.set = exports.copy = void 0;

var vec4 = _interopRequireWildcard(require("./Vec4Func.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
function identity(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}
/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/


function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  let s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}
/**
 * Multiplies two quats
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */


function multiply(out, a, b) {
  let ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  let bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];
  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}
/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */


function rotateX(out, a, rad) {
  rad *= 0.5;
  let ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  let bx = Math.sin(rad),
      bw = Math.cos(rad);
  out[0] = ax * bw + aw * bx;
  out[1] = ay * bw + az * bx;
  out[2] = az * bw - ay * bx;
  out[3] = aw * bw - ax * bx;
  return out;
}
/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */


function rotateY(out, a, rad) {
  rad *= 0.5;
  let ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  let by = Math.sin(rad),
      bw = Math.cos(rad);
  out[0] = ax * bw - az * by;
  out[1] = ay * bw + aw * by;
  out[2] = az * bw + ax * by;
  out[3] = aw * bw - ay * by;
  return out;
}
/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */


function rotateZ(out, a, rad) {
  rad *= 0.5;
  let ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  let bz = Math.sin(rad),
      bw = Math.cos(rad);
  out[0] = ax * bw + ay * bz;
  out[1] = ay * bw - ax * bz;
  out[2] = az * bw + aw * bz;
  out[3] = aw * bw - az * bz;
  return out;
}
/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */


function slerp(out, a, b, t) {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations
  let ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  let bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];
  let omega, cosom, sinom, scale0, scale1; // calc cosine

  cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

  if (cosom < 0.0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  } // calculate coefficients


  if (1.0 - cosom > 0.000001) {
    // standard case (slerp)
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  } // calculate final values


  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */


function invert(out, a) {
  let a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  let dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
  let invDot = dot ? 1.0 / dot : 0; // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

  out[0] = -a0 * invDot;
  out[1] = -a1 * invDot;
  out[2] = -a2 * invDot;
  out[3] = a3 * invDot;
  return out;
}
/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */


function conjugate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  return out;
}
/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */


function fromMat3(out, m) {
  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
  // article "Quaternion Calculus and Fast Animation".
  let fTrace = m[0] + m[4] + m[8];
  let fRoot;

  if (fTrace > 0.0) {
    // |w| > 1/2, may as well choose w > 1/2
    fRoot = Math.sqrt(fTrace + 1.0); // 2w

    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot; // 1/(4w)

    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    // |w| <= 1/2
    let i = 0;
    if (m[4] > m[0]) i = 1;
    if (m[8] > m[i * 3 + i]) i = 2;
    let j = (i + 1) % 3;
    let k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }

  return out;
}
/**
 * Creates a quaternion from the given euler angle x, y, z.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} euler Angles to rotate around each axis in degrees.
 * @param {String} order detailing order of operations. Default 'XYZ'.
 * @returns {quat} out
 * @function
 */


function fromEuler(out, euler, order = 'YXZ') {
  let sx = Math.sin(euler[0] * 0.5);
  let cx = Math.cos(euler[0] * 0.5);
  let sy = Math.sin(euler[1] * 0.5);
  let cy = Math.cos(euler[1] * 0.5);
  let sz = Math.sin(euler[2] * 0.5);
  let cz = Math.cos(euler[2] * 0.5);

  if (order === 'XYZ') {
    out[0] = sx * cy * cz + cx * sy * sz;
    out[1] = cx * sy * cz - sx * cy * sz;
    out[2] = cx * cy * sz + sx * sy * cz;
    out[3] = cx * cy * cz - sx * sy * sz;
  } else if (order === 'YXZ') {
    out[0] = sx * cy * cz + cx * sy * sz;
    out[1] = cx * sy * cz - sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
  } else if (order === 'ZXY') {
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz + sx * sy * cz;
    out[3] = cx * cy * cz - sx * sy * sz;
  } else if (order === 'ZYX') {
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
  } else if (order === 'YZX') {
    out[0] = sx * cy * cz + cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz - sx * sy * sz;
  } else if (order === 'XZY') {
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz - sx * cy * sz;
    out[2] = cx * cy * sz + sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
  }

  return out;
}
/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */


const copy = vec4.copy;
/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */

exports.copy = copy;
const set = vec4.set;
/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */

exports.set = set;
const add = vec4.add;
/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */

exports.add = add;
const scale = vec4.scale;
/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */

exports.scale = scale;
const dot = vec4.dot;
/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */

exports.dot = dot;
const lerp = vec4.lerp;
/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 */

exports.lerp = lerp;
const length = vec4.length;
/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */

exports.length = length;
const normalize = vec4.normalize;
exports.normalize = normalize;
},{"./Vec4Func.js":"node_modules/ogl/src/math/functions/Vec4Func.js"}],"node_modules/ogl/src/math/Quat.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Quat = void 0;

var QuatFunc = _interopRequireWildcard(require("./functions/QuatFunc.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class Quat extends Array {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    super(x, y, z, w);

    this.onChange = () => {};

    return this;
  }

  get x() {
    return this[0];
  }

  get y() {
    return this[1];
  }

  get z() {
    return this[2];
  }

  get w() {
    return this[3];
  }

  set x(v) {
    this[0] = v;
    this.onChange();
  }

  set y(v) {
    this[1] = v;
    this.onChange();
  }

  set z(v) {
    this[2] = v;
    this.onChange();
  }

  set w(v) {
    this[3] = v;
    this.onChange();
  }

  identity() {
    QuatFunc.identity(this);
    this.onChange();
    return this;
  }

  set(x, y, z, w) {
    if (x.length) return this.copy(x);
    QuatFunc.set(this, x, y, z, w);
    this.onChange();
    return this;
  }

  rotateX(a) {
    QuatFunc.rotateX(this, this, a);
    this.onChange();
    return this;
  }

  rotateY(a) {
    QuatFunc.rotateY(this, this, a);
    this.onChange();
    return this;
  }

  rotateZ(a) {
    QuatFunc.rotateZ(this, this, a);
    this.onChange();
    return this;
  }

  inverse(q = this) {
    QuatFunc.invert(this, q);
    this.onChange();
    return this;
  }

  conjugate(q = this) {
    QuatFunc.conjugate(this, q);
    this.onChange();
    return this;
  }

  copy(q) {
    QuatFunc.copy(this, q);
    this.onChange();
    return this;
  }

  normalize(q = this) {
    QuatFunc.normalize(this, q);
    this.onChange();
    return this;
  }

  multiply(qA, qB) {
    if (qB) {
      QuatFunc.multiply(this, qA, qB);
    } else {
      QuatFunc.multiply(this, this, qA);
    }

    this.onChange();
    return this;
  }

  dot(v) {
    return QuatFunc.dot(this, v);
  }

  fromMatrix3(matrix3) {
    QuatFunc.fromMat3(this, matrix3);
    this.onChange();
    return this;
  }

  fromEuler(euler) {
    QuatFunc.fromEuler(this, euler, euler.order);
    return this;
  }

  fromAxisAngle(axis, a) {
    QuatFunc.setAxisAngle(this, axis, a);
    return this;
  }

  slerp(q, t) {
    QuatFunc.slerp(this, this, q, t);
    return this;
  }

  fromArray(a, o = 0) {
    this[0] = a[o];
    this[1] = a[o + 1];
    this[2] = a[o + 2];
    this[3] = a[o + 3];
    return this;
  }

  toArray(a = [], o = 0) {
    a[o] = this[0];
    a[o + 1] = this[1];
    a[o + 2] = this[2];
    a[o + 3] = this[3];
    return a;
  }

}

exports.Quat = Quat;
},{"./functions/QuatFunc.js":"node_modules/ogl/src/math/functions/QuatFunc.js"}],"node_modules/ogl/src/math/functions/Mat4Func.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copy = copy;
exports.set = set;
exports.identity = identity;
exports.transpose = transpose;
exports.invert = invert;
exports.determinant = determinant;
exports.multiply = multiply;
exports.translate = translate;
exports.scale = scale;
exports.rotate = rotate;
exports.getTranslation = getTranslation;
exports.getScaling = getScaling;
exports.getMaxScaleOnAxis = getMaxScaleOnAxis;
exports.fromRotationTranslationScale = fromRotationTranslationScale;
exports.fromQuat = fromQuat;
exports.perspective = perspective;
exports.ortho = ortho;
exports.targetTo = targetTo;
exports.add = add;
exports.subtract = subtract;
exports.multiplyScalar = multiplyScalar;
exports.getRotation = void 0;
const EPSILON = 0.000001;
/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */


function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */


function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */


function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    let a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    let a12 = a[6],
        a13 = a[7];
    let a23 = a[11];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }

  return out;
}
/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */


function invert(out, a) {
  let a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  let a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  let a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  let a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */


function determinant(a) {
  let a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  let a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  let a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  let a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}
/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */


function multiply(out, a, b) {
  let a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  let a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  let a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  let a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15]; // Cache only the current line of the second matrix

  let b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */


function translate(out, a, v) {
  let x = v[0],
      y = v[1],
      z = v[2];
  let a00, a01, a02, a03;
  let a10, a11, a12, a13;
  let a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}
/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/


function scale(out, a, v) {
  let x = v[0],
      y = v[1],
      z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */


function rotate(out, a, rad, axis) {
  let x = axis[0],
      y = axis[1],
      z = axis[2];
  let len = Math.hypot(x, y, z);
  let s, c, t;
  let a00, a01, a02, a03;
  let a10, a11, a12, a13;
  let a20, a21, a22, a23;
  let b00, b01, b02;
  let b10, b11, b12;
  let b20, b21, b22;

  if (Math.abs(len) < EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11]; // Construct the elements of the rotation matrix

  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  return out;
}
/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */


function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}
/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslationScale
 *  with a normalized Quaternion paramter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */


function getScaling(out, mat) {
  let m11 = mat[0];
  let m12 = mat[1];
  let m13 = mat[2];
  let m21 = mat[4];
  let m22 = mat[5];
  let m23 = mat[6];
  let m31 = mat[8];
  let m32 = mat[9];
  let m33 = mat[10];
  out[0] = Math.hypot(m11, m12, m13);
  out[1] = Math.hypot(m21, m22, m23);
  out[2] = Math.hypot(m31, m32, m33);
  return out;
}

function getMaxScaleOnAxis(mat) {
  let m11 = mat[0];
  let m12 = mat[1];
  let m13 = mat[2];
  let m21 = mat[4];
  let m22 = mat[5];
  let m23 = mat[6];
  let m31 = mat[8];
  let m32 = mat[9];
  let m33 = mat[10];
  const x = m11 * m11 + m12 * m12 + m13 * m13;
  const y = m21 * m21 + m22 * m22 + m23 * m23;
  const z = m31 * m31 + m32 * m32 + m33 * m33;
  return Math.sqrt(Math.max(x, y, z));
}
/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {mat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */


const getRotation = function () {
  const temp = [0, 0, 0];
  return function (out, mat) {
    let scaling = temp;
    getScaling(scaling, mat);
    let is1 = 1 / scaling[0];
    let is2 = 1 / scaling[1];
    let is3 = 1 / scaling[2];
    let sm11 = mat[0] * is1;
    let sm12 = mat[1] * is2;
    let sm13 = mat[2] * is3;
    let sm21 = mat[4] * is1;
    let sm22 = mat[5] * is2;
    let sm23 = mat[6] * is3;
    let sm31 = mat[8] * is1;
    let sm32 = mat[9] * is2;
    let sm33 = mat[10] * is3;
    let trace = sm11 + sm22 + sm33;
    let S = 0;

    if (trace > 0) {
      S = Math.sqrt(trace + 1.0) * 2;
      out[3] = 0.25 * S;
      out[0] = (sm23 - sm32) / S;
      out[1] = (sm31 - sm13) / S;
      out[2] = (sm12 - sm21) / S;
    } else if (sm11 > sm22 && sm11 > sm33) {
      S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
      out[3] = (sm23 - sm32) / S;
      out[0] = 0.25 * S;
      out[1] = (sm12 + sm21) / S;
      out[2] = (sm31 + sm13) / S;
    } else if (sm22 > sm33) {
      S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
      out[3] = (sm31 - sm13) / S;
      out[0] = (sm12 + sm21) / S;
      out[1] = 0.25 * S;
      out[2] = (sm23 + sm32) / S;
    } else {
      S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
      out[3] = (sm12 - sm21) / S;
      out[0] = (sm31 + sm13) / S;
      out[1] = (sm23 + sm32) / S;
      out[2] = 0.25 * S;
    }

    return out;
  };
}();
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @returns {mat4} out
 */


exports.getRotation = getRotation;

function fromRotationTranslationScale(out, q, v, s) {
  // Quaternion math
  let x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;
  let xx = x * x2;
  let xy = x * y2;
  let xz = x * z2;
  let yy = y * y2;
  let yz = y * z2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;
  let sx = s[0];
  let sy = s[1];
  let sz = s[2];
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */


function fromQuat(out, q) {
  let x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;
  let xx = x * x2;
  let yx = y * x2;
  let yy = y * y2;
  let zx = z * x2;
  let zy = z * y2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;
  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;
  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;
  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */


function perspective(out, fovy, aspect, near, far) {
  let f = 1.0 / Math.tan(fovy / 2);
  let nf = 1 / (near - far);
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = 2 * far * near * nf;
  out[15] = 0;
  return out;
}
/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */


function ortho(out, left, right, bottom, top, near, far) {
  let lr = 1 / (left - right);
  let bt = 1 / (bottom - top);
  let nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
/**
 * Generates a matrix that makes something look at something else.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} target Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */


function targetTo(out, eye, target, up) {
  let eyex = eye[0],
      eyey = eye[1],
      eyez = eye[2],
      upx = up[0],
      upy = up[1],
      upz = up[2];
  let z0 = eyex - target[0],
      z1 = eyey - target[1],
      z2 = eyez - target[2];
  let len = z0 * z0 + z1 * z1 + z2 * z2;

  if (len === 0) {
    // eye and target are in the same position
    z2 = 1;
  } else {
    len = 1 / Math.sqrt(len);
    z0 *= len;
    z1 *= len;
    z2 *= len;
  }

  let x0 = upy * z2 - upz * z1,
      x1 = upz * z0 - upx * z2,
      x2 = upx * z1 - upy * z0;
  len = x0 * x0 + x1 * x1 + x2 * x2;

  if (len === 0) {
    // up and z are parallel
    if (upz) {
      upx += 1e-6;
    } else if (upy) {
      upz += 1e-6;
    } else {
      upy += 1e-6;
    }

    x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
    len = x0 * x0 + x1 * x1 + x2 * x2;
  }

  len = 1 / Math.sqrt(len);
  x0 *= len;
  x1 *= len;
  x2 *= len;
  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
}
/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */


function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  out[9] = a[9] + b[9];
  out[10] = a[10] + b[10];
  out[11] = a[11] + b[11];
  out[12] = a[12] + b[12];
  out[13] = a[13] + b[13];
  out[14] = a[14] + b[14];
  out[15] = a[15] + b[15];
  return out;
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */


function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  out[9] = a[9] - b[9];
  out[10] = a[10] - b[10];
  out[11] = a[11] - b[11];
  out[12] = a[12] - b[12];
  out[13] = a[13] - b[13];
  out[14] = a[14] - b[14];
  out[15] = a[15] - b[15];
  return out;
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
 */


function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  out[9] = a[9] * b;
  out[10] = a[10] * b;
  out[11] = a[11] * b;
  out[12] = a[12] * b;
  out[13] = a[13] * b;
  out[14] = a[14] * b;
  out[15] = a[15] * b;
  return out;
}
},{}],"node_modules/ogl/src/math/Mat4.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mat4 = void 0;

var Mat4Func = _interopRequireWildcard(require("./functions/Mat4Func.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class Mat4 extends Array {
  constructor(m00 = 1, m01 = 0, m02 = 0, m03 = 0, m10 = 0, m11 = 1, m12 = 0, m13 = 0, m20 = 0, m21 = 0, m22 = 1, m23 = 0, m30 = 0, m31 = 0, m32 = 0, m33 = 1) {
    super(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
    return this;
  }

  get x() {
    return this[12];
  }

  get y() {
    return this[13];
  }

  get z() {
    return this[14];
  }

  get w() {
    return this[15];
  }

  set x(v) {
    this[12] = v;
  }

  set y(v) {
    this[13] = v;
  }

  set z(v) {
    this[14] = v;
  }

  set w(v) {
    this[15] = v;
  }

  set(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    if (m00.length) return this.copy(m00);
    Mat4Func.set(this, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
    return this;
  }

  translate(v, m = this) {
    Mat4Func.translate(this, m, v);
    return this;
  }

  rotate(v, axis, m = this) {
    Mat4Func.rotate(this, m, v, axis);
    return this;
  }

  scale(v, m = this) {
    Mat4Func.scale(this, m, typeof v === 'number' ? [v, v, v] : v);
    return this;
  }

  multiply(ma, mb) {
    if (mb) {
      Mat4Func.multiply(this, ma, mb);
    } else {
      Mat4Func.multiply(this, this, ma);
    }

    return this;
  }

  identity() {
    Mat4Func.identity(this);
    return this;
  }

  copy(m) {
    Mat4Func.copy(this, m);
    return this;
  }

  fromPerspective({
    fov,
    aspect,
    near,
    far
  } = {}) {
    Mat4Func.perspective(this, fov, aspect, near, far);
    return this;
  }

  fromOrthogonal({
    left,
    right,
    bottom,
    top,
    near,
    far
  }) {
    Mat4Func.ortho(this, left, right, bottom, top, near, far);
    return this;
  }

  fromQuaternion(q) {
    Mat4Func.fromQuat(this, q);
    return this;
  }

  setPosition(v) {
    this.x = v[0];
    this.y = v[1];
    this.z = v[2];
    return this;
  }

  inverse(m = this) {
    Mat4Func.invert(this, m);
    return this;
  }

  compose(q, pos, scale) {
    Mat4Func.fromRotationTranslationScale(this, q, pos, scale);
    return this;
  }

  getRotation(q) {
    Mat4Func.getRotation(q, this);
    return this;
  }

  getTranslation(pos) {
    Mat4Func.getTranslation(pos, this);
    return this;
  }

  getScaling(scale) {
    Mat4Func.getScaling(scale, this);
    return this;
  }

  getMaxScaleOnAxis() {
    return Mat4Func.getMaxScaleOnAxis(this);
  }

  lookAt(eye, target, up) {
    Mat4Func.targetTo(this, eye, target, up);
    return this;
  }

  determinant() {
    return Mat4Func.determinant(this);
  }

  fromArray(a, o = 0) {
    this[0] = a[o];
    this[1] = a[o + 1];
    this[2] = a[o + 2];
    this[3] = a[o + 3];
    this[4] = a[o + 4];
    this[5] = a[o + 5];
    this[6] = a[o + 6];
    this[7] = a[o + 7];
    this[8] = a[o + 8];
    this[9] = a[o + 9];
    this[10] = a[o + 10];
    this[11] = a[o + 11];
    this[12] = a[o + 12];
    this[13] = a[o + 13];
    this[14] = a[o + 14];
    this[15] = a[o + 15];
    return this;
  }

  toArray(a = [], o = 0) {
    a[o] = this[0];
    a[o + 1] = this[1];
    a[o + 2] = this[2];
    a[o + 3] = this[3];
    a[o + 4] = this[4];
    a[o + 5] = this[5];
    a[o + 6] = this[6];
    a[o + 7] = this[7];
    a[o + 8] = this[8];
    a[o + 9] = this[9];
    a[o + 10] = this[10];
    a[o + 11] = this[11];
    a[o + 12] = this[12];
    a[o + 13] = this[13];
    a[o + 14] = this[14];
    a[o + 15] = this[15];
    return a;
  }

}

exports.Mat4 = Mat4;
},{"./functions/Mat4Func.js":"node_modules/ogl/src/math/functions/Mat4Func.js"}],"node_modules/ogl/src/math/functions/EulerFunc.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromRotationMatrix = fromRotationMatrix;

// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
function fromRotationMatrix(out, m, order = 'YXZ') {
  if (order === 'XYZ') {
    out[1] = Math.asin(Math.min(Math.max(m[8], -1), 1));

    if (Math.abs(m[8]) < 0.99999) {
      out[0] = Math.atan2(-m[9], m[10]);
      out[2] = Math.atan2(-m[4], m[0]);
    } else {
      out[0] = Math.atan2(m[6], m[5]);
      out[2] = 0;
    }
  } else if (order === 'YXZ') {
    out[0] = Math.asin(-Math.min(Math.max(m[9], -1), 1));

    if (Math.abs(m[9]) < 0.99999) {
      out[1] = Math.atan2(m[8], m[10]);
      out[2] = Math.atan2(m[1], m[5]);
    } else {
      out[1] = Math.atan2(-m[2], m[0]);
      out[2] = 0;
    }
  } else if (order === 'ZXY') {
    out[0] = Math.asin(Math.min(Math.max(m[6], -1), 1));

    if (Math.abs(m[6]) < 0.99999) {
      out[1] = Math.atan2(-m[2], m[10]);
      out[2] = Math.atan2(-m[4], m[5]);
    } else {
      out[1] = 0;
      out[2] = Math.atan2(m[1], m[0]);
    }
  } else if (order === 'ZYX') {
    out[1] = Math.asin(-Math.min(Math.max(m[2], -1), 1));

    if (Math.abs(m[2]) < 0.99999) {
      out[0] = Math.atan2(m[6], m[10]);
      out[2] = Math.atan2(m[1], m[0]);
    } else {
      out[0] = 0;
      out[2] = Math.atan2(-m[4], m[5]);
    }
  } else if (order === 'YZX') {
    out[2] = Math.asin(Math.min(Math.max(m[1], -1), 1));

    if (Math.abs(m[1]) < 0.99999) {
      out[0] = Math.atan2(-m[9], m[5]);
      out[1] = Math.atan2(-m[2], m[0]);
    } else {
      out[0] = 0;
      out[1] = Math.atan2(m[8], m[10]);
    }
  } else if (order === 'XZY') {
    out[2] = Math.asin(-Math.min(Math.max(m[4], -1), 1));

    if (Math.abs(m[4]) < 0.99999) {
      out[0] = Math.atan2(m[6], m[5]);
      out[1] = Math.atan2(m[8], m[0]);
    } else {
      out[0] = Math.atan2(-m[9], m[10]);
      out[1] = 0;
    }
  }

  return out;
}
},{}],"node_modules/ogl/src/math/Euler.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Euler = void 0;

var EulerFunc = _interopRequireWildcard(require("./functions/EulerFunc.js"));

var _Mat = require("./Mat4.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const tmpMat4 = new _Mat.Mat4();

class Euler extends Array {
  constructor(x = 0, y = x, z = x, order = 'YXZ') {
    super(x, y, z);
    this.order = order;

    this.onChange = () => {};

    return this;
  }

  get x() {
    return this[0];
  }

  get y() {
    return this[1];
  }

  get z() {
    return this[2];
  }

  set x(v) {
    this[0] = v;
    this.onChange();
  }

  set y(v) {
    this[1] = v;
    this.onChange();
  }

  set z(v) {
    this[2] = v;
    this.onChange();
  }

  set(x, y = x, z = x) {
    if (x.length) return this.copy(x);
    this[0] = x;
    this[1] = y;
    this[2] = z;
    this.onChange();
    return this;
  }

  copy(v) {
    this[0] = v[0];
    this[1] = v[1];
    this[2] = v[2];
    this.onChange();
    return this;
  }

  reorder(order) {
    this.order = order;
    this.onChange();
    return this;
  }

  fromRotationMatrix(m, order = this.order) {
    EulerFunc.fromRotationMatrix(this, m, order);
    return this;
  }

  fromQuaternion(q, order = this.order) {
    tmpMat4.fromQuaternion(q);
    return this.fromRotationMatrix(tmpMat4, order);
  }

  toArray(a = [], o = 0) {
    a[o] = this[0];
    a[o + 1] = this[1];
    a[o + 2] = this[2];
    return a;
  }

}

exports.Euler = Euler;
},{"./functions/EulerFunc.js":"node_modules/ogl/src/math/functions/EulerFunc.js","./Mat4.js":"node_modules/ogl/src/math/Mat4.js"}],"node_modules/ogl/src/core/Transform.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transform = void 0;

var _Vec = require("../math/Vec3.js");

var _Quat = require("../math/Quat.js");

var _Mat = require("../math/Mat4.js");

var _Euler = require("../math/Euler.js");

class Transform {
  constructor() {
    this.parent = null;
    this.children = [];
    this.visible = true;
    this.matrix = new _Mat.Mat4();
    this.worldMatrix = new _Mat.Mat4();
    this.matrixAutoUpdate = true;
    this.position = new _Vec.Vec3();
    this.quaternion = new _Quat.Quat();
    this.scale = new _Vec.Vec3(1);
    this.rotation = new _Euler.Euler();
    this.up = new _Vec.Vec3(0, 1, 0);

    this.rotation.onChange = () => this.quaternion.fromEuler(this.rotation);

    this.quaternion.onChange = () => this.rotation.fromQuaternion(this.quaternion);
  }

  setParent(parent, notifyParent = true) {
    if (this.parent && parent !== this.parent) this.parent.removeChild(this, false);
    this.parent = parent;
    if (notifyParent && parent) parent.addChild(this, false);
  }

  addChild(child, notifyChild = true) {
    if (!~this.children.indexOf(child)) this.children.push(child);
    if (notifyChild) child.setParent(this, false);
  }

  removeChild(child, notifyChild = true) {
    if (!!~this.children.indexOf(child)) this.children.splice(this.children.indexOf(child), 1);
    if (notifyChild) child.setParent(null, false);
  }

  updateMatrixWorld(force) {
    if (this.matrixAutoUpdate) this.updateMatrix();

    if (this.worldMatrixNeedsUpdate || force) {
      if (this.parent === null) this.worldMatrix.copy(this.matrix);else this.worldMatrix.multiply(this.parent.worldMatrix, this.matrix);
      this.worldMatrixNeedsUpdate = false;
      force = true;
    }

    for (let i = 0, l = this.children.length; i < l; i++) {
      this.children[i].updateMatrixWorld(force);
    }
  }

  updateMatrix() {
    this.matrix.compose(this.quaternion, this.position, this.scale);
    this.worldMatrixNeedsUpdate = true;
  }

  traverse(callback) {
    // Return true in callback to stop traversing children
    if (callback(this)) return;

    for (let i = 0, l = this.children.length; i < l; i++) {
      this.children[i].traverse(callback);
    }
  }

  decompose() {
    this.matrix.getTranslation(this.position);
    this.matrix.getRotation(this.quaternion);
    this.matrix.getScaling(this.scale);
    this.rotation.fromQuaternion(this.quaternion);
  }

  lookAt(target, invert = false) {
    if (invert) this.matrix.lookAt(this.position, target, this.up);else this.matrix.lookAt(target, this.position, this.up);
    this.matrix.getRotation(this.quaternion);
    this.rotation.fromQuaternion(this.quaternion);
  }

}

exports.Transform = Transform;
},{"../math/Vec3.js":"node_modules/ogl/src/math/Vec3.js","../math/Quat.js":"node_modules/ogl/src/math/Quat.js","../math/Mat4.js":"node_modules/ogl/src/math/Mat4.js","../math/Euler.js":"node_modules/ogl/src/math/Euler.js"}],"node_modules/ogl/src/core/Camera.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Camera = void 0;

var _Transform = require("./Transform.js");

var _Mat = require("../math/Mat4.js");

var _Vec = require("../math/Vec3.js");

const tempMat4 = new _Mat.Mat4();
const tempVec3a = new _Vec.Vec3();
const tempVec3b = new _Vec.Vec3();

class Camera extends _Transform.Transform {
  constructor(gl, {
    near = 0.1,
    far = 100,
    fov = 45,
    aspect = 1,
    left,
    right,
    bottom,
    top,
    zoom = 1
  } = {}) {
    super();
    Object.assign(this, {
      near,
      far,
      fov,
      aspect,
      left,
      right,
      bottom,
      top,
      zoom
    });
    this.projectionMatrix = new _Mat.Mat4();
    this.viewMatrix = new _Mat.Mat4();
    this.projectionViewMatrix = new _Mat.Mat4();
    this.worldPosition = new _Vec.Vec3(); // Use orthographic if left/right set, else default to perspective camera

    this.type = left || right ? 'orthographic' : 'perspective';
    if (this.type === 'orthographic') this.orthographic();else this.perspective();
  }

  perspective({
    near = this.near,
    far = this.far,
    fov = this.fov,
    aspect = this.aspect
  } = {}) {
    Object.assign(this, {
      near,
      far,
      fov,
      aspect
    });
    this.projectionMatrix.fromPerspective({
      fov: fov * (Math.PI / 180),
      aspect,
      near,
      far
    });
    this.type = 'perspective';
    return this;
  }

  orthographic({
    near = this.near,
    far = this.far,
    left = this.left,
    right = this.right,
    bottom = this.bottom,
    top = this.top,
    zoom = this.zoom
  } = {}) {
    Object.assign(this, {
      near,
      far,
      left,
      right,
      bottom,
      top,
      zoom
    });
    left /= zoom;
    right /= zoom;
    bottom /= zoom;
    top /= zoom;
    this.projectionMatrix.fromOrthogonal({
      left,
      right,
      bottom,
      top,
      near,
      far
    });
    this.type = 'orthographic';
    return this;
  }

  updateMatrixWorld() {
    super.updateMatrixWorld();
    this.viewMatrix.inverse(this.worldMatrix);
    this.worldMatrix.getTranslation(this.worldPosition); // used for sorting

    this.projectionViewMatrix.multiply(this.projectionMatrix, this.viewMatrix);
    return this;
  }

  lookAt(target) {
    super.lookAt(target, true);
    return this;
  } // Project 3D coordinate to 2D point


  project(v) {
    v.applyMatrix4(this.viewMatrix);
    v.applyMatrix4(this.projectionMatrix);
    return this;
  } // Unproject 2D point to 3D coordinate


  unproject(v) {
    v.applyMatrix4(tempMat4.inverse(this.projectionMatrix));
    v.applyMatrix4(this.worldMatrix);
    return this;
  }

  updateFrustum() {
    if (!this.frustum) {
      this.frustum = [new _Vec.Vec3(), new _Vec.Vec3(), new _Vec.Vec3(), new _Vec.Vec3(), new _Vec.Vec3(), new _Vec.Vec3()];
    }

    const m = this.projectionViewMatrix;
    this.frustum[0].set(m[3] - m[0], m[7] - m[4], m[11] - m[8]).constant = m[15] - m[12]; // -x

    this.frustum[1].set(m[3] + m[0], m[7] + m[4], m[11] + m[8]).constant = m[15] + m[12]; // +x

    this.frustum[2].set(m[3] + m[1], m[7] + m[5], m[11] + m[9]).constant = m[15] + m[13]; // +y

    this.frustum[3].set(m[3] - m[1], m[7] - m[5], m[11] - m[9]).constant = m[15] - m[13]; // -y

    this.frustum[4].set(m[3] - m[2], m[7] - m[6], m[11] - m[10]).constant = m[15] - m[14]; // +z (far)

    this.frustum[5].set(m[3] + m[2], m[7] + m[6], m[11] + m[10]).constant = m[15] + m[14]; // -z (near)

    for (let i = 0; i < 6; i++) {
      const invLen = 1.0 / this.frustum[i].distance();
      this.frustum[i].multiply(invLen);
      this.frustum[i].constant *= invLen;
    }
  }

  frustumIntersectsMesh(node) {
    // If no position attribute, treat as frustumCulled false
    if (!node.geometry.attributes.position) return true;
    if (!node.geometry.bounds || node.geometry.bounds.radius === Infinity) node.geometry.computeBoundingSphere();
    if (!node.geometry.bounds) return true;
    const center = tempVec3a;
    center.copy(node.geometry.bounds.center);
    center.applyMatrix4(node.worldMatrix);
    const radius = node.geometry.bounds.radius * node.worldMatrix.getMaxScaleOnAxis();
    return this.frustumIntersectsSphere(center, radius);
  }

  frustumIntersectsSphere(center, radius) {
    const normal = tempVec3b;

    for (let i = 0; i < 6; i++) {
      const plane = this.frustum[i];
      const distance = normal.copy(plane).dot(center) + plane.constant;
      if (distance < -radius) return false;
    }

    return true;
  }

}

exports.Camera = Camera;
},{"./Transform.js":"node_modules/ogl/src/core/Transform.js","../math/Mat4.js":"node_modules/ogl/src/math/Mat4.js","../math/Vec3.js":"node_modules/ogl/src/math/Vec3.js"}],"node_modules/ogl/src/math/functions/Mat3Func.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromMat4 = fromMat4;
exports.fromQuat = fromQuat;
exports.copy = copy;
exports.set = set;
exports.identity = identity;
exports.transpose = transpose;
exports.invert = invert;
exports.determinant = determinant;
exports.multiply = multiply;
exports.translate = translate;
exports.rotate = rotate;
exports.scale = scale;
exports.normalFromMat4 = normalFromMat4;
exports.projection = projection;
exports.add = add;
exports.subtract = subtract;
exports.multiplyScalar = multiplyScalar;
const EPSILON = 0.000001;
/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */

function fromMat4(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[4];
  out[4] = a[5];
  out[5] = a[6];
  out[6] = a[8];
  out[7] = a[9];
  out[8] = a[10];
  return out;
}
/**
 * Calculates a 3x3 matrix from the given quaternion
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {quat} q Quaternion to create matrix from
 *
 * @returns {mat3} out
 */


function fromQuat(out, q) {
  let x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;
  let xx = x * x2;
  let yx = y * x2;
  let yy = y * y2;
  let zx = z * x2;
  let zy = z * y2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;
  out[0] = 1 - yy - zz;
  out[3] = yx - wz;
  out[6] = zx + wy;
  out[1] = yx + wz;
  out[4] = 1 - xx - zz;
  out[7] = zy - wx;
  out[2] = zx - wy;
  out[5] = zy + wx;
  out[8] = 1 - xx - yy;
  return out;
}
/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */


function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
/**
 * Set the components of a mat3 to the given values
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */


function set(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}
/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */


function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}
/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */


function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    let a01 = a[1],
        a02 = a[2],
        a12 = a[5];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a01;
    out[5] = a[7];
    out[6] = a02;
    out[7] = a12;
  } else {
    out[0] = a[0];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a[1];
    out[4] = a[4];
    out[5] = a[7];
    out[6] = a[2];
    out[7] = a[5];
    out[8] = a[8];
  }

  return out;
}
/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */


function invert(out, a) {
  let a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  let a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  let a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  let b01 = a22 * a11 - a12 * a21;
  let b11 = -a22 * a10 + a12 * a20;
  let b21 = a21 * a10 - a11 * a20; // Calculate the determinant

  let det = a00 * b01 + a01 * b11 + a02 * b21;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = b01 * det;
  out[1] = (-a22 * a01 + a02 * a21) * det;
  out[2] = (a12 * a01 - a02 * a11) * det;
  out[3] = b11 * det;
  out[4] = (a22 * a00 - a02 * a20) * det;
  out[5] = (-a12 * a00 + a02 * a10) * det;
  out[6] = b21 * det;
  out[7] = (-a21 * a00 + a01 * a20) * det;
  out[8] = (a11 * a00 - a01 * a10) * det;
  return out;
}
/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */


function determinant(a) {
  let a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  let a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  let a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
}
/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */


function multiply(out, a, b) {
  let a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  let a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  let a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  let b00 = b[0],
      b01 = b[1],
      b02 = b[2];
  let b10 = b[3],
      b11 = b[4],
      b12 = b[5];
  let b20 = b[6],
      b21 = b[7],
      b22 = b[8];
  out[0] = b00 * a00 + b01 * a10 + b02 * a20;
  out[1] = b00 * a01 + b01 * a11 + b02 * a21;
  out[2] = b00 * a02 + b01 * a12 + b02 * a22;
  out[3] = b10 * a00 + b11 * a10 + b12 * a20;
  out[4] = b10 * a01 + b11 * a11 + b12 * a21;
  out[5] = b10 * a02 + b11 * a12 + b12 * a22;
  out[6] = b20 * a00 + b21 * a10 + b22 * a20;
  out[7] = b20 * a01 + b21 * a11 + b22 * a21;
  out[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return out;
}
/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */


function translate(out, a, v) {
  let a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a10 = a[3],
      a11 = a[4],
      a12 = a[5],
      a20 = a[6],
      a21 = a[7],
      a22 = a[8],
      x = v[0],
      y = v[1];
  out[0] = a00;
  out[1] = a01;
  out[2] = a02;
  out[3] = a10;
  out[4] = a11;
  out[5] = a12;
  out[6] = x * a00 + y * a10 + a20;
  out[7] = x * a01 + y * a11 + a21;
  out[8] = x * a02 + y * a12 + a22;
  return out;
}
/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */


function rotate(out, a, rad) {
  let a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a10 = a[3],
      a11 = a[4],
      a12 = a[5],
      a20 = a[6],
      a21 = a[7],
      a22 = a[8],
      s = Math.sin(rad),
      c = Math.cos(rad);
  out[0] = c * a00 + s * a10;
  out[1] = c * a01 + s * a11;
  out[2] = c * a02 + s * a12;
  out[3] = c * a10 - s * a00;
  out[4] = c * a11 - s * a01;
  out[5] = c * a12 - s * a02;
  out[6] = a20;
  out[7] = a21;
  out[8] = a22;
  return out;
}
/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/


function scale(out, a, v) {
  let x = v[0],
      y = v[1];
  out[0] = x * a[0];
  out[1] = x * a[1];
  out[2] = x * a[2];
  out[3] = y * a[3];
  out[4] = y * a[4];
  out[5] = y * a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
/**
 * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {mat4} a Mat4 to derive the normal matrix from
 *
 * @returns {mat3} out
 */


function normalFromMat4(out, a) {
  let a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  let a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  let a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  let a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  return out;
}
/**
 * Generates a 2D projection matrix with the given bounds
 *
 * @param {mat3} out mat3 frustum matrix will be written into
 * @param {number} width Width of your gl context
 * @param {number} height Height of gl context
 * @returns {mat3} out
 */


function projection(out, width, height) {
  out[0] = 2 / width;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = -2 / height;
  out[5] = 0;
  out[6] = -1;
  out[7] = 1;
  out[8] = 1;
  return out;
}
/**
 * Adds two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */


function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  return out;
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */


function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  return out;
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat3} out
 */


function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  return out;
}
},{}],"node_modules/ogl/src/math/Mat3.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mat3 = void 0;

var Mat3Func = _interopRequireWildcard(require("./functions/Mat3Func.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class Mat3 extends Array {
  constructor(m00 = 1, m01 = 0, m02 = 0, m10 = 0, m11 = 1, m12 = 0, m20 = 0, m21 = 0, m22 = 1) {
    super(m00, m01, m02, m10, m11, m12, m20, m21, m22);
    return this;
  }

  set(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
    if (m00.length) return this.copy(m00);
    Mat3Func.set(this, m00, m01, m02, m10, m11, m12, m20, m21, m22);
    return this;
  }

  translate(v, m = this) {
    Mat3Func.translate(this, m, v);
    return this;
  }

  rotate(v, m = this) {
    Mat3Func.rotate(this, m, v);
    return this;
  }

  scale(v, m = this) {
    Mat3Func.scale(this, m, v);
    return this;
  }

  multiply(ma, mb) {
    if (mb) {
      Mat3Func.multiply(this, ma, mb);
    } else {
      Mat3Func.multiply(this, this, ma);
    }

    return this;
  }

  identity() {
    Mat3Func.identity(this);
    return this;
  }

  copy(m) {
    Mat3Func.copy(this, m);
    return this;
  }

  fromMatrix4(m) {
    Mat3Func.fromMat4(this, m);
    return this;
  }

  fromQuaternion(q) {
    Mat3Func.fromQuat(this, q);
    return this;
  }

  fromBasis(vec3a, vec3b, vec3c) {
    this.set(vec3a[0], vec3a[1], vec3a[2], vec3b[0], vec3b[1], vec3b[2], vec3c[0], vec3c[1], vec3c[2]);
    return this;
  }

  inverse(m = this) {
    Mat3Func.invert(this, m);
    return this;
  }

  getNormalMatrix(m) {
    Mat3Func.normalFromMat4(this, m);
    return this;
  }

}

exports.Mat3 = Mat3;
},{"./functions/Mat3Func.js":"node_modules/ogl/src/math/functions/Mat3Func.js"}],"node_modules/ogl/src/core/Mesh.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mesh = void 0;

var _Transform = require("./Transform.js");

var _Mat = require("../math/Mat3.js");

var _Mat2 = require("../math/Mat4.js");

let ID = 0;

class Mesh extends _Transform.Transform {
  constructor(gl, {
    geometry,
    program,
    mode = gl.TRIANGLES,
    frustumCulled = true,
    renderOrder = 0
  } = {}) {
    super();
    if (!gl.canvas) console.error('gl not passed as first argument to Mesh');
    this.gl = gl;
    this.id = ID++;
    this.geometry = geometry;
    this.program = program;
    this.mode = mode; // Used to skip frustum culling

    this.frustumCulled = frustumCulled; // Override sorting to force an order

    this.renderOrder = renderOrder;
    this.modelViewMatrix = new _Mat2.Mat4();
    this.normalMatrix = new _Mat.Mat3();
    this.beforeRenderCallbacks = [];
    this.afterRenderCallbacks = [];
  }

  onBeforeRender(f) {
    this.beforeRenderCallbacks.push(f);
    return this;
  }

  onAfterRender(f) {
    this.afterRenderCallbacks.push(f);
    return this;
  }

  draw({
    camera
  } = {}) {
    this.beforeRenderCallbacks.forEach(f => f && f({
      mesh: this,
      camera
    }));

    if (camera) {
      // Add empty matrix uniforms to program if unset
      if (!this.program.uniforms.modelMatrix) {
        Object.assign(this.program.uniforms, {
          modelMatrix: {
            value: null
          },
          viewMatrix: {
            value: null
          },
          modelViewMatrix: {
            value: null
          },
          normalMatrix: {
            value: null
          },
          projectionMatrix: {
            value: null
          },
          cameraPosition: {
            value: null
          }
        });
      } // Set the matrix uniforms


      this.program.uniforms.projectionMatrix.value = camera.projectionMatrix;
      this.program.uniforms.cameraPosition.value = camera.worldPosition;
      this.program.uniforms.viewMatrix.value = camera.viewMatrix;
      this.modelViewMatrix.multiply(camera.viewMatrix, this.worldMatrix);
      this.normalMatrix.getNormalMatrix(this.modelViewMatrix);
      this.program.uniforms.modelMatrix.value = this.worldMatrix;
      this.program.uniforms.modelViewMatrix.value = this.modelViewMatrix;
      this.program.uniforms.normalMatrix.value = this.normalMatrix;
    } // determine if faces need to be flipped - when mesh scaled negatively


    let flipFaces = this.program.cullFace && this.worldMatrix.determinant() < 0;
    this.program.use({
      flipFaces
    });
    this.geometry.draw({
      mode: this.mode,
      program: this.program
    });
    this.afterRenderCallbacks.forEach(f => f && f({
      mesh: this,
      camera
    }));
  }

}

exports.Mesh = Mesh;
},{"./Transform.js":"node_modules/ogl/src/core/Transform.js","../math/Mat3.js":"node_modules/ogl/src/math/Mat3.js","../math/Mat4.js":"node_modules/ogl/src/math/Mat4.js"}],"node_modules/ogl/src/core/Texture.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Texture = void 0;
// TODO: delete texture
// TODO: use texSubImage2D for updates (video or when loaded)
// TODO: need? encoding = linearEncoding
// TODO: support non-compressed mipmaps uploads
const emptyPixel = new Uint8Array(4);

function isPowerOf2(value) {
  return (value & value - 1) === 0;
}

let ID = 1;

class Texture {
  constructor(gl, {
    image,
    target = gl.TEXTURE_2D,
    type = gl.UNSIGNED_BYTE,
    format = gl.RGBA,
    internalFormat = format,
    wrapS = gl.CLAMP_TO_EDGE,
    wrapT = gl.CLAMP_TO_EDGE,
    generateMipmaps = true,
    minFilter = generateMipmaps ? gl.NEAREST_MIPMAP_LINEAR : gl.LINEAR,
    magFilter = gl.LINEAR,
    premultiplyAlpha = false,
    unpackAlignment = 4,
    flipY = target == gl.TEXTURE_2D ? true : false,
    anisotropy = 0,
    level = 0,
    width,
    // used for RenderTargets or Data Textures
    height = width
  } = {}) {
    this.gl = gl;
    this.id = ID++;
    this.image = image;
    this.target = target;
    this.type = type;
    this.format = format;
    this.internalFormat = internalFormat;
    this.minFilter = minFilter;
    this.magFilter = magFilter;
    this.wrapS = wrapS;
    this.wrapT = wrapT;
    this.generateMipmaps = generateMipmaps;
    this.premultiplyAlpha = premultiplyAlpha;
    this.unpackAlignment = unpackAlignment;
    this.flipY = flipY;
    this.anisotropy = Math.min(anisotropy, this.gl.renderer.parameters.maxAnisotropy);
    this.level = level;
    this.width = width;
    this.height = height;
    this.texture = this.gl.createTexture();
    this.store = {
      image: null
    }; // Alias for state store to avoid redundant calls for global state

    this.glState = this.gl.renderer.state; // State store to avoid redundant calls for per-texture state

    this.state = {};
    this.state.minFilter = this.gl.NEAREST_MIPMAP_LINEAR;
    this.state.magFilter = this.gl.LINEAR;
    this.state.wrapS = this.gl.REPEAT;
    this.state.wrapT = this.gl.REPEAT;
    this.state.anisotropy = 0;
  }

  bind() {
    // Already bound to active texture unit
    if (this.glState.textureUnits[this.glState.activeTextureUnit] === this.id) return;
    this.gl.bindTexture(this.target, this.texture);
    this.glState.textureUnits[this.glState.activeTextureUnit] = this.id;
  }

  update(textureUnit = 0) {
    const needsUpdate = !(this.image === this.store.image && !this.needsUpdate); // Make sure that texture is bound to its texture unit

    if (needsUpdate || this.glState.textureUnits[textureUnit] !== this.id) {
      // set active texture unit to perform texture functions
      this.gl.renderer.activeTexture(textureUnit);
      this.bind();
    }

    if (!needsUpdate) return;
    this.needsUpdate = false;

    if (this.flipY !== this.glState.flipY) {
      this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, this.flipY);
      this.glState.flipY = this.flipY;
    }

    if (this.premultiplyAlpha !== this.glState.premultiplyAlpha) {
      this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
      this.glState.premultiplyAlpha = this.premultiplyAlpha;
    }

    if (this.unpackAlignment !== this.glState.unpackAlignment) {
      this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, this.unpackAlignment);
      this.glState.unpackAlignment = this.unpackAlignment;
    }

    if (this.minFilter !== this.state.minFilter) {
      this.gl.texParameteri(this.target, this.gl.TEXTURE_MIN_FILTER, this.minFilter);
      this.state.minFilter = this.minFilter;
    }

    if (this.magFilter !== this.state.magFilter) {
      this.gl.texParameteri(this.target, this.gl.TEXTURE_MAG_FILTER, this.magFilter);
      this.state.magFilter = this.magFilter;
    }

    if (this.wrapS !== this.state.wrapS) {
      this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_S, this.wrapS);
      this.state.wrapS = this.wrapS;
    }

    if (this.wrapT !== this.state.wrapT) {
      this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_T, this.wrapT);
      this.state.wrapT = this.wrapT;
    }

    if (this.anisotropy && this.anisotropy !== this.state.anisotropy) {
      this.gl.texParameterf(this.target, this.gl.renderer.getExtension('EXT_texture_filter_anisotropic').TEXTURE_MAX_ANISOTROPY_EXT, this.anisotropy);
      this.state.anisotropy = this.anisotropy;
    }

    if (this.image) {
      if (this.image.width) {
        this.width = this.image.width;
        this.height = this.image.height;
      }

      if (this.target === this.gl.TEXTURE_CUBE_MAP) {
        // For cube maps
        for (let i = 0; i < 6; i++) {
          this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.level, this.internalFormat, this.format, this.type, this.image[i]);
        }
      } else if (ArrayBuffer.isView(this.image)) {
        // Data texture
        this.gl.texImage2D(this.target, this.level, this.internalFormat, this.width, this.height, 0, this.format, this.type, this.image);
      } else if (this.image.isCompressedTexture) {
        // Compressed texture
        for (let level = 0; level < this.image.length; level++) {
          this.gl.compressedTexImage2D(this.target, level, this.internalFormat, this.image[level].width, this.image[level].height, 0, this.image[level].data);
        }
      } else {
        // Regular texture
        this.gl.texImage2D(this.target, this.level, this.internalFormat, this.format, this.type, this.image);
      }

      if (this.generateMipmaps) {
        // For WebGL1, if not a power of 2, turn off mips, set wrapping to clamp to edge and minFilter to linear
        if (!this.gl.renderer.isWebgl2 && (!isPowerOf2(this.image.width) || !isPowerOf2(this.image.height))) {
          this.generateMipmaps = false;
          this.wrapS = this.wrapT = this.gl.CLAMP_TO_EDGE;
          this.minFilter = this.gl.LINEAR;
        } else {
          this.gl.generateMipmap(this.target);
        }
      } // Callback for when data is pushed to GPU


      this.onUpdate && this.onUpdate();
    } else {
      if (this.target === this.gl.TEXTURE_CUBE_MAP) {
        // Upload empty pixel for each side while no image to avoid errors while image or video loading
        for (let i = 0; i < 6; i++) {
          this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, emptyPixel);
        }
      } else if (this.width) {
        // image intentionally left null for RenderTarget
        this.gl.texImage2D(this.target, this.level, this.internalFormat, this.width, this.height, 0, this.format, this.type, null);
      } else {
        // Upload empty pixel if no image to avoid errors while image or video loading
        this.gl.texImage2D(this.target, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, emptyPixel);
      }
    }

    this.store.image = this.image;
  }

}

exports.Texture = Texture;
},{}],"node_modules/ogl/src/core/RenderTarget.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RenderTarget = void 0;

var _Texture = require("./Texture.js");

// TODO: multi target rendering
// TODO: test stencil and depth
// TODO: destroy
// TODO: blit on resize?
class RenderTarget {
  constructor(gl, {
    width = gl.canvas.width,
    height = gl.canvas.height,
    target = gl.FRAMEBUFFER,
    color = 1,
    // number of color attachments
    depth = true,
    stencil = false,
    depthTexture = false,
    // note - stencil breaks
    wrapS = gl.CLAMP_TO_EDGE,
    wrapT = gl.CLAMP_TO_EDGE,
    minFilter = gl.LINEAR,
    magFilter = minFilter,
    type = gl.UNSIGNED_BYTE,
    format = gl.RGBA,
    internalFormat = format,
    unpackAlignment,
    premultiplyAlpha
  } = {}) {
    this.gl = gl;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.buffer = this.gl.createFramebuffer();
    this.target = target;
    this.gl.bindFramebuffer(this.target, this.buffer);
    this.textures = [];
    const drawBuffers = []; // create and attach required num of color textures

    for (let i = 0; i < color; i++) {
      this.textures.push(new _Texture.Texture(gl, {
        width,
        height,
        wrapS,
        wrapT,
        minFilter,
        magFilter,
        type,
        format,
        internalFormat,
        unpackAlignment,
        premultiplyAlpha,
        flipY: false,
        generateMipmaps: false
      }));
      this.textures[i].update();
      this.gl.framebufferTexture2D(this.target, this.gl.COLOR_ATTACHMENT0 + i, this.gl.TEXTURE_2D, this.textures[i].texture, 0
      /* level */
      );
      drawBuffers.push(this.gl.COLOR_ATTACHMENT0 + i);
    } // For multi-render targets shader access


    if (drawBuffers.length > 1) this.gl.renderer.drawBuffers(drawBuffers); // alias for majority of use cases

    this.texture = this.textures[0]; // note depth textures break stencil - so can't use together

    if (depthTexture && (this.gl.renderer.isWebgl2 || this.gl.renderer.getExtension('WEBGL_depth_texture'))) {
      this.depthTexture = new _Texture.Texture(gl, {
        width,
        height,
        minFilter: this.gl.NEAREST,
        magFilter: this.gl.NEAREST,
        format: this.gl.DEPTH_COMPONENT,
        internalFormat: gl.renderer.isWebgl2 ? this.gl.DEPTH_COMPONENT16 : this.gl.DEPTH_COMPONENT,
        type: this.gl.UNSIGNED_INT
      });
      this.depthTexture.update();
      this.gl.framebufferTexture2D(this.target, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, this.depthTexture.texture, 0
      /* level */
      );
    } else {
      // Render buffers
      if (depth && !stencil) {
        this.depthBuffer = this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthBuffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);
        this.gl.framebufferRenderbuffer(this.target, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.depthBuffer);
      }

      if (stencil && !depth) {
        this.stencilBuffer = this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.stencilBuffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.STENCIL_INDEX8, width, height);
        this.gl.framebufferRenderbuffer(this.target, this.gl.STENCIL_ATTACHMENT, this.gl.RENDERBUFFER, this.stencilBuffer);
      }

      if (depth && stencil) {
        this.depthStencilBuffer = this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthStencilBuffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_STENCIL, width, height);
        this.gl.framebufferRenderbuffer(this.target, this.gl.DEPTH_STENCIL_ATTACHMENT, this.gl.RENDERBUFFER, this.depthStencilBuffer);
      }
    }

    this.gl.bindFramebuffer(this.target, null);
  }

}

exports.RenderTarget = RenderTarget;
},{"./Texture.js":"node_modules/ogl/src/core/Texture.js"}],"node_modules/ogl/src/math/functions/ColorFunc.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hexToRGB = hexToRGB;
exports.numberToRGB = numberToRGB;
exports.parseColor = parseColor;
const NAMES = {
  black: '#000000',
  white: '#ffffff',
  red: '#ff0000',
  green: '#00ff00',
  blue: '#0000ff',
  fuchsia: '#ff00ff',
  cyan: '#00ffff',
  yellow: '#ffff00',
  orange: '#ff8000'
};

function hexToRGB(hex) {
  if (hex.length === 4) hex = hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!rgb) console.warn(`Unable to convert hex string ${hex} to rgb values`);
  return [parseInt(rgb[1], 16) / 255, parseInt(rgb[2], 16) / 255, parseInt(rgb[3], 16) / 255];
}

function numberToRGB(num) {
  num = parseInt(num);
  return [(num >> 16 & 255) / 255, (num >> 8 & 255) / 255, (num & 255) / 255];
}

function parseColor(color) {
  // Empty
  if (color === undefined) return [0, 0, 0]; // Decimal

  if (arguments.length === 3) return arguments; // Number

  if (!isNaN(color)) return numberToRGB(color); // Hex

  if (color[0] === '#') return hexToRGB(color); // Names

  if (NAMES[color.toLowerCase()]) return hexToRGB(NAMES[color.toLowerCase()]);
  console.warn('Color format not recognised');
  return [0, 0, 0];
}
},{}],"node_modules/ogl/src/math/Color.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Color = void 0;

var ColorFunc = _interopRequireWildcard(require("./functions/ColorFunc.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Color stored as an array of RGB decimal values (between 0 > 1)
// Constructor and set method accept following formats:
// new Color() - Empty (defaults to black)
// new Color([0.2, 0.4, 1.0]) - Decimal Array (or another Color instance)
// new Color(0.7, 0.0, 0.1) - Decimal RGB values
// new Color('#ff0000') - Hex string
// new Color('#ccc') - Short-hand Hex string
// new Color(0x4f27e8) - Number
// new Color('red') - Color name string (short list in ColorFunc.js)
class Color extends Array {
  constructor(color) {
    if (Array.isArray(color)) return super(...color);
    return super(...ColorFunc.parseColor(...arguments));
  }

  get r() {
    return this[0];
  }

  get g() {
    return this[1];
  }

  get b() {
    return this[2];
  }

  set r(v) {
    this[0] = v;
  }

  set g(v) {
    this[1] = v;
  }

  set b(v) {
    this[2] = v;
  }

  set(color) {
    if (Array.isArray(color)) return this.copy(color);
    return this.copy(ColorFunc.parseColor(...arguments));
  }

  copy(v) {
    this[0] = v[0];
    this[1] = v[1];
    this[2] = v[2];
    return this;
  }

}

exports.Color = Color;
},{"./functions/ColorFunc.js":"node_modules/ogl/src/math/functions/ColorFunc.js"}],"node_modules/ogl/src/math/functions/Vec2Func.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copy = copy;
exports.set = set;
exports.add = add;
exports.subtract = subtract;
exports.multiply = multiply;
exports.divide = divide;
exports.scale = scale;
exports.distance = distance;
exports.squaredDistance = squaredDistance;
exports.length = length;
exports.squaredLength = squaredLength;
exports.negate = negate;
exports.inverse = inverse;
exports.normalize = normalize;
exports.dot = dot;
exports.cross = cross;
exports.lerp = lerp;
exports.transformMat2 = transformMat2;
exports.transformMat2d = transformMat2d;
exports.transformMat3 = transformMat3;
exports.transformMat4 = transformMat4;
exports.exactEquals = exactEquals;
const EPSILON = 0.000001;
/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  return out;
}
/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */


function set(out, x, y) {
  out[0] = x;
  out[1] = y;
  return out;
}
/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */


function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */


function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
}
/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */


function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  return out;
}
/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */


function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  return out;
}
/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */


function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  return out;
}
/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */


function distance(a, b) {
  var x = b[0] - a[0],
      y = b[1] - a[1];
  return Math.sqrt(x * x + y * y);
}
/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */


function squaredDistance(a, b) {
  var x = b[0] - a[0],
      y = b[1] - a[1];
  return x * x + y * y;
}
/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */


function length(a) {
  var x = a[0],
      y = a[1];
  return Math.sqrt(x * x + y * y);
}
/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */


function squaredLength(a) {
  var x = a[0],
      y = a[1];
  return x * x + y * y;
}
/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */


function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  return out;
}
/**
 * Returns the inverse of the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to invert
 * @returns {vec2} out
 */


function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  return out;
}
/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */


function normalize(out, a) {
  var x = a[0],
      y = a[1];
  var len = x * x + y * y;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  return out;
}
/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */


function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}
/**
 * Computes the cross product of two vec2's
 * Note that the cross product returns a scalar
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} cross product of a and b
 */


function cross(a, b) {
  return a[0] * b[1] - a[1] * b[0];
}
/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */


function lerp(out, a, b, t) {
  var ax = a[0],
      ay = a[1];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  return out;
}
/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2} m matrix to transform with
 * @returns {vec2} out
 */


function transformMat2(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[2] * y;
  out[1] = m[1] * x + m[3] * y;
  return out;
}
/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2d} m matrix to transform with
 * @returns {vec2} out
 */


function transformMat2d(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[2] * y + m[4];
  out[1] = m[1] * x + m[3] * y + m[5];
  return out;
}
/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */


function transformMat3(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[3] * y + m[6];
  out[1] = m[1] * x + m[4] * y + m[7];
  return out;
}
/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */


function transformMat4(out, a, m) {
  let x = a[0];
  let y = a[1];
  out[0] = m[0] * x + m[4] * y + m[12];
  out[1] = m[1] * x + m[5] * y + m[13];
  return out;
}
/**
 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
 *
 * @param {vec2} a The first vector.
 * @param {vec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */


function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}
},{}],"node_modules/ogl/src/math/Vec2.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vec2 = void 0;

var Vec2Func = _interopRequireWildcard(require("./functions/Vec2Func.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class Vec2 extends Array {
  constructor(x = 0, y = x) {
    super(x, y);
    return this;
  }

  get x() {
    return this[0];
  }

  get y() {
    return this[1];
  }

  set x(v) {
    this[0] = v;
  }

  set y(v) {
    this[1] = v;
  }

  set(x, y = x) {
    if (x.length) return this.copy(x);
    Vec2Func.set(this, x, y);
    return this;
  }

  copy(v) {
    Vec2Func.copy(this, v);
    return this;
  }

  add(va, vb) {
    if (vb) Vec2Func.add(this, va, vb);else Vec2Func.add(this, this, va);
    return this;
  }

  sub(va, vb) {
    if (vb) Vec2Func.subtract(this, va, vb);else Vec2Func.subtract(this, this, va);
    return this;
  }

  multiply(v) {
    if (v.length) Vec2Func.multiply(this, this, v);else Vec2Func.scale(this, this, v);
    return this;
  }

  divide(v) {
    if (v.length) Vec2Func.divide(this, this, v);else Vec2Func.scale(this, this, 1 / v);
    return this;
  }

  inverse(v = this) {
    Vec2Func.inverse(this, v);
    return this;
  } // Can't use 'length' as Array.prototype uses it


  len() {
    return Vec2Func.length(this);
  }

  distance(v) {
    if (v) return Vec2Func.distance(this, v);else return Vec2Func.length(this);
  }

  squaredLen() {
    return this.squaredDistance();
  }

  squaredDistance(v) {
    if (v) return Vec2Func.squaredDistance(this, v);else return Vec2Func.squaredLength(this);
  }

  negate(v = this) {
    Vec2Func.negate(this, v);
    return this;
  }

  cross(va, vb) {
    if (vb) return Vec2Func.cross(va, vb);
    return Vec2Func.cross(this, va);
  }

  scale(v) {
    Vec2Func.scale(this, this, v);
    return this;
  }

  normalize() {
    Vec2Func.normalize(this, this);
    return this;
  }

  dot(v) {
    return Vec2Func.dot(this, v);
  }

  equals(v) {
    return Vec2Func.exactEquals(this, v);
  }

  applyMatrix3(mat3) {
    Vec2Func.transformMat3(this, this, mat3);
    return this;
  }

  applyMatrix4(mat4) {
    Vec2Func.transformMat4(this, this, mat4);
    return this;
  }

  lerp(v, a) {
    Vec2Func.lerp(this, this, v, a);
  }

  clone() {
    return new Vec2(this[0], this[1]);
  }

  fromArray(a, o = 0) {
    this[0] = a[o];
    this[1] = a[o + 1];
    return this;
  }

  toArray(a = [], o = 0) {
    a[o] = this[0];
    a[o + 1] = this[1];
    return a;
  }

}

exports.Vec2 = Vec2;
},{"./functions/Vec2Func.js":"node_modules/ogl/src/math/functions/Vec2Func.js"}],"node_modules/ogl/src/math/Vec4.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vec4 = void 0;

var Vec4Func = _interopRequireWildcard(require("./functions/Vec4Func.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class Vec4 extends Array {
  constructor(x = 0, y = x, z = x, w = x) {
    super(x, y, z, w);
    return this;
  }

  get x() {
    return this[0];
  }

  get y() {
    return this[1];
  }

  get z() {
    return this[2];
  }

  get w() {
    return this[3];
  }

  set x(v) {
    this[0] = v;
  }

  set y(v) {
    this[1] = v;
  }

  set z(v) {
    this[2] = v;
  }

  set w(v) {
    this[3] = v;
  }

  set(x, y, z, w) {
    if (x.length) return this.copy(x);
    Vec4Func.set(this, x, y, z, w);
    return this;
  }

  copy(v) {
    Vec4Func.copy(this, v);
    return this;
  }

  normalize() {
    Vec4Func.normalize(this, this);
    return this;
  }

  fromArray(a, o = 0) {
    this[0] = a[o];
    this[1] = a[o + 1];
    this[2] = a[o + 2];
    this[3] = a[o + 3];
    return this;
  }

  toArray(a = [], o = 0) {
    a[o] = this[0];
    a[o + 1] = this[1];
    a[o + 2] = this[2];
    a[o + 3] = this[3];
    return a;
  }

}

exports.Vec4 = Vec4;
},{"./functions/Vec4Func.js":"node_modules/ogl/src/math/functions/Vec4Func.js"}],"node_modules/ogl/src/extras/Plane.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Plane = void 0;

var _Geometry = require("../core/Geometry.js");

class Plane extends _Geometry.Geometry {
  constructor(gl, {
    width = 1,
    height = 1,
    widthSegments = 1,
    heightSegments = 1,
    attributes = {}
  } = {}) {
    const wSegs = widthSegments;
    const hSegs = heightSegments; // Determine length of arrays

    const num = (wSegs + 1) * (hSegs + 1);
    const numIndices = wSegs * hSegs * 6; // Generate empty arrays once

    const position = new Float32Array(num * 3);
    const normal = new Float32Array(num * 3);
    const uv = new Float32Array(num * 2);
    const index = num > 65536 ? new Uint32Array(numIndices) : new Uint16Array(numIndices);
    Plane.buildPlane(position, normal, uv, index, width, height, 0, wSegs, hSegs);
    Object.assign(attributes, {
      position: {
        size: 3,
        data: position
      },
      normal: {
        size: 3,
        data: normal
      },
      uv: {
        size: 2,
        data: uv
      },
      index: {
        data: index
      }
    });
    super(gl, attributes);
  }

  static buildPlane(position, normal, uv, index, width, height, depth, wSegs, hSegs, u = 0, v = 1, w = 2, uDir = 1, vDir = -1, i = 0, ii = 0) {
    const io = i;
    const segW = width / wSegs;
    const segH = height / hSegs;

    for (let iy = 0; iy <= hSegs; iy++) {
      let y = iy * segH - height / 2;

      for (let ix = 0; ix <= wSegs; ix++, i++) {
        let x = ix * segW - width / 2;
        position[i * 3 + u] = x * uDir;
        position[i * 3 + v] = y * vDir;
        position[i * 3 + w] = depth / 2;
        normal[i * 3 + u] = 0;
        normal[i * 3 + v] = 0;
        normal[i * 3 + w] = depth >= 0 ? 1 : -1;
        uv[i * 2] = ix / wSegs;
        uv[i * 2 + 1] = 1 - iy / hSegs;
        if (iy === hSegs || ix === wSegs) continue;
        let a = io + ix + iy * (wSegs + 1);
        let b = io + ix + (iy + 1) * (wSegs + 1);
        let c = io + ix + (iy + 1) * (wSegs + 1) + 1;
        let d = io + ix + iy * (wSegs + 1) + 1;
        index[ii * 6] = a;
        index[ii * 6 + 1] = b;
        index[ii * 6 + 2] = d;
        index[ii * 6 + 3] = b;
        index[ii * 6 + 4] = c;
        index[ii * 6 + 5] = d;
        ii++;
      }
    }
  }

}

exports.Plane = Plane;
},{"../core/Geometry.js":"node_modules/ogl/src/core/Geometry.js"}],"node_modules/ogl/src/extras/Box.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Box = void 0;

var _Geometry = require("../core/Geometry.js");

var _Plane = require("./Plane.js");

class Box extends _Geometry.Geometry {
  constructor(gl, {
    width = 1,
    height = 1,
    depth = 1,
    widthSegments = 1,
    heightSegments = 1,
    depthSegments = 1,
    attributes = {}
  } = {}) {
    const wSegs = widthSegments;
    const hSegs = heightSegments;
    const dSegs = depthSegments;
    const num = (wSegs + 1) * (hSegs + 1) * 2 + (wSegs + 1) * (dSegs + 1) * 2 + (hSegs + 1) * (dSegs + 1) * 2;
    const numIndices = (wSegs * hSegs * 2 + wSegs * dSegs * 2 + hSegs * dSegs * 2) * 6;
    const position = new Float32Array(num * 3);
    const normal = new Float32Array(num * 3);
    const uv = new Float32Array(num * 2);
    const index = num > 65536 ? new Uint32Array(numIndices) : new Uint16Array(numIndices);
    let i = 0;
    let ii = 0; // left, right

    _Plane.Plane.buildPlane(position, normal, uv, index, depth, height, width, dSegs, hSegs, 2, 1, 0, -1, -1, i, ii);

    _Plane.Plane.buildPlane(position, normal, uv, index, depth, height, -width, dSegs, hSegs, 2, 1, 0, 1, -1, i += (dSegs + 1) * (hSegs + 1), ii += dSegs * hSegs); // top, bottom


    _Plane.Plane.buildPlane(position, normal, uv, index, width, depth, height, dSegs, hSegs, 0, 2, 1, 1, 1, i += (dSegs + 1) * (hSegs + 1), ii += dSegs * hSegs);

    _Plane.Plane.buildPlane(position, normal, uv, index, width, depth, -height, dSegs, hSegs, 0, 2, 1, 1, -1, i += (wSegs + 1) * (dSegs + 1), ii += wSegs * dSegs); // front, back


    _Plane.Plane.buildPlane(position, normal, uv, index, width, height, -depth, wSegs, hSegs, 0, 1, 2, -1, -1, i += (wSegs + 1) * (dSegs + 1), ii += wSegs * dSegs);

    _Plane.Plane.buildPlane(position, normal, uv, index, width, height, depth, wSegs, hSegs, 0, 1, 2, 1, -1, i += (wSegs + 1) * (hSegs + 1), ii += wSegs * hSegs);

    Object.assign(attributes, {
      position: {
        size: 3,
        data: position
      },
      normal: {
        size: 3,
        data: normal
      },
      uv: {
        size: 2,
        data: uv
      },
      index: {
        data: index
      }
    });
    super(gl, attributes);
  }

}

exports.Box = Box;
},{"../core/Geometry.js":"node_modules/ogl/src/core/Geometry.js","./Plane.js":"node_modules/ogl/src/extras/Plane.js"}],"node_modules/ogl/src/extras/Sphere.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sphere = void 0;

var _Geometry = require("../core/Geometry.js");

var _Vec = require("../math/Vec3.js");

class Sphere extends _Geometry.Geometry {
  constructor(gl, {
    radius = 0.5,
    widthSegments = 16,
    heightSegments = Math.ceil(widthSegments * 0.5),
    phiStart = 0,
    phiLength = Math.PI * 2,
    thetaStart = 0,
    thetaLength = Math.PI,
    attributes = {}
  } = {}) {
    const wSegs = widthSegments;
    const hSegs = heightSegments;
    const pStart = phiStart;
    const pLength = phiLength;
    const tStart = thetaStart;
    const tLength = thetaLength;
    const num = (wSegs + 1) * (hSegs + 1);
    const numIndices = wSegs * hSegs * 6;
    const position = new Float32Array(num * 3);
    const normal = new Float32Array(num * 3);
    const uv = new Float32Array(num * 2);
    const index = num > 65536 ? new Uint32Array(numIndices) : new Uint16Array(numIndices);
    let i = 0;
    let iv = 0;
    let ii = 0;
    let te = tStart + tLength;
    const grid = [];
    let n = new _Vec.Vec3();

    for (let iy = 0; iy <= hSegs; iy++) {
      let vRow = [];
      let v = iy / hSegs;

      for (let ix = 0; ix <= wSegs; ix++, i++) {
        let u = ix / wSegs;
        let x = -radius * Math.cos(pStart + u * pLength) * Math.sin(tStart + v * tLength);
        let y = radius * Math.cos(tStart + v * tLength);
        let z = radius * Math.sin(pStart + u * pLength) * Math.sin(tStart + v * tLength);
        position[i * 3] = x;
        position[i * 3 + 1] = y;
        position[i * 3 + 2] = z;
        n.set(x, y, z).normalize();
        normal[i * 3] = n.x;
        normal[i * 3 + 1] = n.y;
        normal[i * 3 + 2] = n.z;
        uv[i * 2] = u;
        uv[i * 2 + 1] = 1 - v;
        vRow.push(iv++);
      }

      grid.push(vRow);
    }

    for (let iy = 0; iy < hSegs; iy++) {
      for (let ix = 0; ix < wSegs; ix++) {
        let a = grid[iy][ix + 1];
        let b = grid[iy][ix];
        let c = grid[iy + 1][ix];
        let d = grid[iy + 1][ix + 1];

        if (iy !== 0 || tStart > 0) {
          index[ii * 3] = a;
          index[ii * 3 + 1] = b;
          index[ii * 3 + 2] = d;
          ii++;
        }

        if (iy !== hSegs - 1 || te < Math.PI) {
          index[ii * 3] = b;
          index[ii * 3 + 1] = c;
          index[ii * 3 + 2] = d;
          ii++;
        }
      }
    }

    Object.assign(attributes, {
      position: {
        size: 3,
        data: position
      },
      normal: {
        size: 3,
        data: normal
      },
      uv: {
        size: 2,
        data: uv
      },
      index: {
        data: index
      }
    });
    super(gl, attributes);
  }

}

exports.Sphere = Sphere;
},{"../core/Geometry.js":"node_modules/ogl/src/core/Geometry.js","../math/Vec3.js":"node_modules/ogl/src/math/Vec3.js"}],"node_modules/ogl/src/extras/Cylinder.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cylinder = void 0;

var _Geometry = require("../core/Geometry.js");

var _Vec = require("../math/Vec3.js");

class Cylinder extends _Geometry.Geometry {
  constructor(gl, {
    radiusTop = 0.5,
    radiusBottom = 0.5,
    height = 1,
    radialSegments = 8,
    heightSegments = 1,
    openEnded = false,
    thetaStart = 0,
    thetaLength = Math.PI * 2,
    attributes = {}
  } = {}) {
    const rSegs = radialSegments;
    const hSegs = heightSegments;
    const tStart = thetaStart;
    const tLength = thetaLength;
    const numCaps = openEnded ? 0 : radiusBottom && radiusTop ? 2 : 1;
    const num = (rSegs + 1) * (hSegs + 1 + numCaps) + numCaps;
    const numIndices = rSegs * hSegs * 6 + numCaps * rSegs * 3;
    const position = new Float32Array(num * 3);
    const normal = new Float32Array(num * 3);
    const uv = new Float32Array(num * 2);
    const index = num > 65536 ? new Uint32Array(numIndices) : new Uint16Array(numIndices);
    let i = 0;
    let ii = 0;
    const indexArray = [];
    addHeight();

    if (!openEnded) {
      if (radiusTop) addCap(true);
      if (radiusBottom) addCap(false);
    }

    function addHeight() {
      let x, y;
      const n = new _Vec.Vec3();
      const slope = (radiusBottom - radiusTop) / height;

      for (y = 0; y <= hSegs; y++) {
        const indexRow = [];
        const v = y / hSegs;
        const r = v * (radiusBottom - radiusTop) + radiusTop;

        for (x = 0; x <= rSegs; x++) {
          const u = x / rSegs;
          const theta = u * tLength + tStart;
          const sinTheta = Math.sin(theta);
          const cosTheta = Math.cos(theta);
          position.set([r * sinTheta, (0.5 - v) * height, r * cosTheta], i * 3);
          n.set(sinTheta, slope, cosTheta).normalize();
          normal.set([n.x, n.y, n.z], i * 3);
          uv.set([u, 1 - v], i * 2);
          indexRow.push(i++);
        }

        indexArray.push(indexRow);
      }

      for (x = 0; x < rSegs; x++) {
        for (y = 0; y < hSegs; y++) {
          const a = indexArray[y][x];
          const b = indexArray[y + 1][x];
          const c = indexArray[y + 1][x + 1];
          const d = indexArray[y][x + 1];
          index.set([a, b, d, b, c, d], ii * 3);
          ii += 2;
        }
      }
    }

    function addCap(isTop) {
      let x;
      const r = isTop === true ? radiusTop : radiusBottom;
      const sign = isTop === true ? 1 : -1;
      const centerIndex = i;
      position.set([0, 0.5 * height * sign, 0], i * 3);
      normal.set([0, sign, 0], i * 3);
      uv.set([0.5, 0.5], i * 2);
      i++;

      for (x = 0; x <= rSegs; x++) {
        const u = x / rSegs;
        const theta = u * tLength + tStart;
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);
        position.set([r * sinTheta, 0.5 * height * sign, r * cosTheta], i * 3);
        normal.set([0, sign, 0], i * 3);
        uv.set([cosTheta * 0.5 + 0.5, sinTheta * 0.5 * sign + 0.5], i * 2);
        i++;
      }

      for (x = 0; x < rSegs; x++) {
        const j = centerIndex + x + 1;

        if (isTop) {
          index.set([j, j + 1, centerIndex], ii * 3);
        } else {
          index.set([j + 1, j, centerIndex], ii * 3);
        }

        ii++;
      }
    }

    Object.assign(attributes, {
      position: {
        size: 3,
        data: position
      },
      normal: {
        size: 3,
        data: normal
      },
      uv: {
        size: 2,
        data: uv
      },
      index: {
        data: index
      }
    });
    super(gl, attributes);
  }

}

exports.Cylinder = Cylinder;
},{"../core/Geometry.js":"node_modules/ogl/src/core/Geometry.js","../math/Vec3.js":"node_modules/ogl/src/math/Vec3.js"}],"node_modules/ogl/src/extras/Triangle.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Triangle = void 0;

var _Geometry = require("../core/Geometry.js");

class Triangle extends _Geometry.Geometry {
  constructor(gl, {
    attributes = {}
  } = {}) {
    Object.assign(attributes, {
      position: {
        size: 2,
        data: new Float32Array([-1, -1, 3, -1, -1, 3])
      },
      uv: {
        size: 2,
        data: new Float32Array([0, 0, 2, 0, 0, 2])
      }
    });
    super(gl, attributes);
  }

}

exports.Triangle = Triangle;
},{"../core/Geometry.js":"node_modules/ogl/src/core/Geometry.js"}],"node_modules/ogl/src/extras/Torus.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Torus = void 0;

var _Geometry = require("../core/Geometry.js");

var _Vec = require("../math/Vec3.js");

// https://github.com/mrdoob/three.js/blob/master/src/geometries/TorusGeometry.js
class Torus extends _Geometry.Geometry {
  constructor(gl, {
    radius = 0.5,
    tube = 0.2,
    radialSegments = 8,
    tubularSegments = 6,
    arc = Math.PI * 2,
    attributes = {}
  } = {}) {
    const num = (radialSegments + 1) * (tubularSegments + 1);
    const numIndices = radialSegments * tubularSegments * 6;
    const vertices = new Float32Array(num * 3);
    const normals = new Float32Array(num * 3);
    const uvs = new Float32Array(num * 2);
    const indices = num > 65536 ? new Uint32Array(numIndices) : new Uint16Array(numIndices);
    const center = new _Vec.Vec3();
    const vertex = new _Vec.Vec3();
    const normal = new _Vec.Vec3(); // generate vertices, normals and uvs

    let idx = 0;

    for (let j = 0; j <= radialSegments; j++) {
      for (let i = 0; i <= tubularSegments; i++, idx++) {
        const u = i / tubularSegments * arc;
        const v = j / radialSegments * Math.PI * 2; // vertex

        vertex.x = (radius + tube * Math.cos(v)) * Math.cos(u);
        vertex.y = (radius + tube * Math.cos(v)) * Math.sin(u);
        vertex.z = tube * Math.sin(v);
        vertices.set([vertex.x, vertex.y, vertex.z], idx * 3); // normal

        center.x = radius * Math.cos(u);
        center.y = radius * Math.sin(u);
        normal.sub(vertex, center).normalize();
        normals.set([normal.x, normal.y, normal.z], idx * 3); // uv

        uvs.set([i / tubularSegments, j / radialSegments], idx * 2);
      }
    } // generate indices


    idx = 0;

    for (let j = 1; j <= radialSegments; j++) {
      for (let i = 1; i <= tubularSegments; i++, idx++) {
        // indices
        const a = (tubularSegments + 1) * j + i - 1;
        const b = (tubularSegments + 1) * (j - 1) + i - 1;
        const c = (tubularSegments + 1) * (j - 1) + i;
        const d = (tubularSegments + 1) * j + i; // faces

        indices.set([a, b, d, b, c, d], idx * 6);
      }
    }

    Object.assign(attributes, {
      position: {
        size: 3,
        data: vertices
      },
      normal: {
        size: 3,
        data: normals
      },
      uv: {
        size: 2,
        data: uvs
      },
      index: {
        data: indices
      }
    });
    super(gl, attributes);
  }

}

exports.Torus = Torus;
},{"../core/Geometry.js":"node_modules/ogl/src/core/Geometry.js","../math/Vec3.js":"node_modules/ogl/src/math/Vec3.js"}],"node_modules/ogl/src/extras/Orbit.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Orbit = Orbit;

var _Vec = require("../math/Vec3.js");

var _Vec2 = require("../math/Vec2.js");

// Based from ThreeJS' OrbitControls class, rewritten using es6 with some additions and subtractions.
// TODO: abstract event handlers so can be fed from other sources
// TODO: make scroll zoom more accurate than just >/< zero
// TODO: be able to pass in new camera position
const STATE = {
  NONE: -1,
  ROTATE: 0,
  DOLLY: 1,
  PAN: 2,
  DOLLY_PAN: 3
};
const tempVec3 = new _Vec.Vec3();
const tempVec2a = new _Vec2.Vec2();
const tempVec2b = new _Vec2.Vec2();

function Orbit(object, {
  element = document,
  enabled = true,
  target = new _Vec.Vec3(),
  ease = 0.25,
  inertia = 0.85,
  enableRotate = true,
  rotateSpeed = 0.1,
  autoRotate = false,
  autoRotateSpeed = 1.0,
  enableZoom = true,
  zoomSpeed = 1,
  enablePan = true,
  panSpeed = 0.1,
  minPolarAngle = 0,
  maxPolarAngle = Math.PI,
  minAzimuthAngle = -Infinity,
  maxAzimuthAngle = Infinity,
  minDistance = 0,
  maxDistance = Infinity
} = {}) {
  this.enabled = enabled;
  this.target = target; // Catch attempts to disable - set to 1 so has no effect

  ease = ease || 1;
  inertia = inertia || 0;
  this.minDistance = minDistance;
  this.maxDistance = maxDistance; // current position in sphericalTarget coordinates

  const sphericalDelta = {
    radius: 1,
    phi: 0,
    theta: 0
  };
  const sphericalTarget = {
    radius: 1,
    phi: 0,
    theta: 0
  };
  const spherical = {
    radius: 1,
    phi: 0,
    theta: 0
  };
  const panDelta = new _Vec.Vec3(); // Grab initial position values

  const offset = new _Vec.Vec3();
  offset.copy(object.position).sub(this.target);
  spherical.radius = sphericalTarget.radius = offset.distance();
  spherical.theta = sphericalTarget.theta = Math.atan2(offset.x, offset.z);
  spherical.phi = sphericalTarget.phi = Math.acos(Math.min(Math.max(offset.y / sphericalTarget.radius, -1), 1));
  this.offset = offset;

  this.update = () => {
    if (autoRotate) {
      handleAutoRotate();
    } // apply delta


    sphericalTarget.radius *= sphericalDelta.radius;
    sphericalTarget.theta += sphericalDelta.theta;
    sphericalTarget.phi += sphericalDelta.phi; // apply boundaries

    sphericalTarget.theta = Math.max(minAzimuthAngle, Math.min(maxAzimuthAngle, sphericalTarget.theta));
    sphericalTarget.phi = Math.max(minPolarAngle, Math.min(maxPolarAngle, sphericalTarget.phi));
    sphericalTarget.radius = Math.max(this.minDistance, Math.min(this.maxDistance, sphericalTarget.radius)); // ease values

    spherical.phi += (sphericalTarget.phi - spherical.phi) * ease;
    spherical.theta += (sphericalTarget.theta - spherical.theta) * ease;
    spherical.radius += (sphericalTarget.radius - spherical.radius) * ease; // apply pan to target. As offset is relative to target, it also shifts

    this.target.add(panDelta); // apply rotation to offset

    let sinPhiRadius = spherical.radius * Math.sin(Math.max(0.000001, spherical.phi));
    offset.x = sinPhiRadius * Math.sin(spherical.theta);
    offset.y = spherical.radius * Math.cos(spherical.phi);
    offset.z = sinPhiRadius * Math.cos(spherical.theta); // Apply updated values to object

    object.position.copy(this.target).add(offset);
    object.lookAt(this.target); // Apply inertia to values

    sphericalDelta.theta *= inertia;
    sphericalDelta.phi *= inertia;
    panDelta.multiply(inertia); // Reset scale every frame to avoid applying scale multiple times

    sphericalDelta.radius = 1;
  }; // Updates internals with new position


  this.forcePosition = () => {
    offset.copy(object.position).sub(this.target);
    spherical.radius = sphericalTarget.radius = offset.distance();
    spherical.theta = sphericalTarget.theta = Math.atan2(offset.x, offset.z);
    spherical.phi = sphericalTarget.phi = Math.acos(Math.min(Math.max(offset.y / sphericalTarget.radius, -1), 1));
    object.lookAt(this.target);
  }; // Everything below here just updates panDelta and sphericalDelta
  // Using those two objects' values, the orbit is calculated


  const rotateStart = new _Vec2.Vec2();
  const panStart = new _Vec2.Vec2();
  const dollyStart = new _Vec2.Vec2();
  let state = STATE.NONE;
  this.mouseButtons = {
    ORBIT: 0,
    ZOOM: 1,
    PAN: 2
  };

  function getZoomScale() {
    return Math.pow(0.95, zoomSpeed);
  }

  function panLeft(distance, m) {
    tempVec3.set(m[0], m[1], m[2]);
    tempVec3.multiply(-distance);
    panDelta.add(tempVec3);
  }

  function panUp(distance, m) {
    tempVec3.set(m[4], m[5], m[6]);
    tempVec3.multiply(distance);
    panDelta.add(tempVec3);
  }

  const pan = (deltaX, deltaY) => {
    let el = element === document ? document.body : element;
    tempVec3.copy(object.position).sub(this.target);
    let targetDistance = tempVec3.distance();
    targetDistance *= Math.tan((object.fov || 45) / 2 * Math.PI / 180.0);
    panLeft(2 * deltaX * targetDistance / el.clientHeight, object.matrix);
    panUp(2 * deltaY * targetDistance / el.clientHeight, object.matrix);
  };

  function dolly(dollyScale) {
    sphericalDelta.radius /= dollyScale;
  }

  function handleAutoRotate() {
    const angle = 2 * Math.PI / 60 / 60 * autoRotateSpeed;
    sphericalDelta.theta -= angle;
  }

  function handleMoveRotate(x, y) {
    tempVec2a.set(x, y);
    tempVec2b.sub(tempVec2a, rotateStart).multiply(rotateSpeed);
    let el = element === document ? document.body : element;
    sphericalDelta.theta -= 2 * Math.PI * tempVec2b.x / el.clientHeight;
    sphericalDelta.phi -= 2 * Math.PI * tempVec2b.y / el.clientHeight;
    rotateStart.copy(tempVec2a);
  }

  function handleMouseMoveDolly(e) {
    tempVec2a.set(e.clientX, e.clientY);
    tempVec2b.sub(tempVec2a, dollyStart);

    if (tempVec2b.y > 0) {
      dolly(getZoomScale());
    } else if (tempVec2b.y < 0) {
      dolly(1 / getZoomScale());
    }

    dollyStart.copy(tempVec2a);
  }

  function handleMovePan(x, y) {
    tempVec2a.set(x, y);
    tempVec2b.sub(tempVec2a, panStart).multiply(panSpeed);
    pan(tempVec2b.x, tempVec2b.y);
    panStart.copy(tempVec2a);
  }

  function handleTouchStartDollyPan(e) {
    if (enableZoom) {
      let dx = e.touches[0].pageX - e.touches[1].pageX;
      let dy = e.touches[0].pageY - e.touches[1].pageY;
      let distance = Math.sqrt(dx * dx + dy * dy);
      dollyStart.set(0, distance);
    }

    if (enablePan) {
      let x = 0.5 * (e.touches[0].pageX + e.touches[1].pageX);
      let y = 0.5 * (e.touches[0].pageY + e.touches[1].pageY);
      panStart.set(x, y);
    }
  }

  function handleTouchMoveDollyPan(e) {
    if (enableZoom) {
      let dx = e.touches[0].pageX - e.touches[1].pageX;
      let dy = e.touches[0].pageY - e.touches[1].pageY;
      let distance = Math.sqrt(dx * dx + dy * dy);
      tempVec2a.set(0, distance);
      tempVec2b.set(0, Math.pow(tempVec2a.y / dollyStart.y, zoomSpeed));
      dolly(tempVec2b.y);
      dollyStart.copy(tempVec2a);
    }

    if (enablePan) {
      let x = 0.5 * (e.touches[0].pageX + e.touches[1].pageX);
      let y = 0.5 * (e.touches[0].pageY + e.touches[1].pageY);
      handleMovePan(x, y);
    }
  }

  const onMouseDown = e => {
    if (!this.enabled) return;

    switch (e.button) {
      case this.mouseButtons.ORBIT:
        if (enableRotate === false) return;
        rotateStart.set(e.clientX, e.clientY);
        state = STATE.ROTATE;
        break;

      case this.mouseButtons.ZOOM:
        if (enableZoom === false) return;
        dollyStart.set(e.clientX, e.clientY);
        state = STATE.DOLLY;
        break;

      case this.mouseButtons.PAN:
        if (enablePan === false) return;
        panStart.set(e.clientX, e.clientY);
        state = STATE.PAN;
        break;
    }

    if (state !== STATE.NONE) {
      window.addEventListener('mousemove', onMouseMove, false);
      window.addEventListener('mouseup', onMouseUp, false);
    }
  };

  const onMouseMove = e => {
    if (!this.enabled) return;

    switch (state) {
      case STATE.ROTATE:
        if (enableRotate === false) return;
        handleMoveRotate(e.clientX, e.clientY);
        break;

      case STATE.DOLLY:
        if (enableZoom === false) return;
        handleMouseMoveDolly(e);
        break;

      case STATE.PAN:
        if (enablePan === false) return;
        handleMovePan(e.clientX, e.clientY);
        break;
    }
  };

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove, false);
    window.removeEventListener('mouseup', onMouseUp, false);
    state = STATE.NONE;
  };

  const onMouseWheel = e => {
    if (!this.enabled || !enableZoom || state !== STATE.NONE && state !== STATE.ROTATE) return;
    e.stopPropagation();
    e.preventDefault();

    if (e.deltaY < 0) {
      dolly(1 / getZoomScale());
    } else if (e.deltaY > 0) {
      dolly(getZoomScale());
    }
  };

  const onTouchStart = e => {
    if (!this.enabled) return;
    e.preventDefault();

    switch (e.touches.length) {
      case 1:
        if (enableRotate === false) return;
        rotateStart.set(e.touches[0].pageX, e.touches[0].pageY);
        state = STATE.ROTATE;
        break;

      case 2:
        if (enableZoom === false && enablePan === false) return;
        handleTouchStartDollyPan(e);
        state = STATE.DOLLY_PAN;
        break;

      default:
        state = STATE.NONE;
    }
  };

  const onTouchMove = e => {
    if (!this.enabled) return;
    e.preventDefault();
    e.stopPropagation();

    switch (e.touches.length) {
      case 1:
        if (enableRotate === false) return;
        handleMoveRotate(e.touches[0].pageX, e.touches[0].pageY);
        break;

      case 2:
        if (enableZoom === false && enablePan === false) return;
        handleTouchMoveDollyPan(e);
        break;

      default:
        state = STATE.NONE;
    }
  };

  const onTouchEnd = () => {
    if (!this.enabled) return;
    state = STATE.NONE;
  };

  const onContextMenu = e => {
    if (!this.enabled) return;
    e.preventDefault();
  };

  function addHandlers() {
    element.addEventListener('contextmenu', onContextMenu, false);
    element.addEventListener('mousedown', onMouseDown, false);
    element.addEventListener('wheel', onMouseWheel, {
      passive: false
    });
    element.addEventListener('touchstart', onTouchStart, {
      passive: false
    });
    element.addEventListener('touchend', onTouchEnd, false);
    element.addEventListener('touchmove', onTouchMove, {
      passive: false
    });
  }

  this.remove = function () {
    element.removeEventListener('contextmenu', onContextMenu);
    element.removeEventListener('mousedown', onMouseDown);
    element.removeEventListener('wheel', onMouseWheel);
    element.removeEventListener('touchstart', onTouchStart);
    element.removeEventListener('touchend', onTouchEnd);
    element.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  addHandlers();
}
},{"../math/Vec3.js":"node_modules/ogl/src/math/Vec3.js","../math/Vec2.js":"node_modules/ogl/src/math/Vec2.js"}],"node_modules/ogl/src/extras/Raycast.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Raycast = void 0;

var _Vec = require("../math/Vec2.js");

var _Vec2 = require("../math/Vec3.js");

var _Mat = require("../math/Mat4.js");

// TODO: barycentric code shouldn't be here, but where?
// TODO: SphereCast?
const tempVec2a = new _Vec.Vec2();
const tempVec2b = new _Vec.Vec2();
const tempVec2c = new _Vec.Vec2();
const tempVec3a = new _Vec2.Vec3();
const tempVec3b = new _Vec2.Vec3();
const tempVec3c = new _Vec2.Vec3();
const tempVec3d = new _Vec2.Vec3();
const tempVec3e = new _Vec2.Vec3();
const tempVec3f = new _Vec2.Vec3();
const tempVec3g = new _Vec2.Vec3();
const tempVec3h = new _Vec2.Vec3();
const tempVec3i = new _Vec2.Vec3();
const tempVec3j = new _Vec2.Vec3();
const tempVec3k = new _Vec2.Vec3();
const tempMat4 = new _Mat.Mat4();

class Raycast {
  constructor() {
    this.origin = new _Vec2.Vec3();
    this.direction = new _Vec2.Vec3();
  } // Set ray from mouse unprojection


  castMouse(camera, mouse = [0, 0]) {
    if (camera.type === 'orthographic') {
      // Set origin
      // Since camera is orthographic, origin is not the camera position
      const {
        left,
        right,
        bottom,
        top,
        zoom
      } = camera;
      const x = left / zoom + (right - left) / zoom * (mouse[0] * 0.5 + 0.5);
      const y = bottom / zoom + (top - bottom) / zoom * (mouse[1] * 0.5 + 0.5);
      this.origin.set(x, y, 0);
      this.origin.applyMatrix4(camera.worldMatrix); // Set direction
      // https://community.khronos.org/t/get-direction-from-transformation-matrix-or-quat/65502/2

      this.direction.x = -camera.worldMatrix[8];
      this.direction.y = -camera.worldMatrix[9];
      this.direction.z = -camera.worldMatrix[10];
    } else {
      // Set origin
      camera.worldMatrix.getTranslation(this.origin); // Set direction

      this.direction.set(mouse[0], mouse[1], 0.5);
      camera.unproject(this.direction);
      this.direction.sub(this.origin).normalize();
    }
  }

  intersectBounds(meshes, {
    maxDistance,
    output = []
  } = {}) {
    if (!Array.isArray(meshes)) meshes = [meshes];
    const invWorldMat4 = tempMat4;
    const origin = tempVec3a;
    const direction = tempVec3b;
    const hits = output;
    hits.length = 0;
    meshes.forEach(mesh => {
      // Create bounds
      if (!mesh.geometry.bounds || mesh.geometry.bounds.radius === Infinity) mesh.geometry.computeBoundingSphere();
      const bounds = mesh.geometry.bounds;
      invWorldMat4.inverse(mesh.worldMatrix); // Get max distance locally

      let localMaxDistance;

      if (maxDistance) {
        direction.copy(this.direction).scaleRotateMatrix4(invWorldMat4);
        localMaxDistance = maxDistance * direction.len();
      } // Take world space ray and make it object space to align with bounding box


      origin.copy(this.origin).applyMatrix4(invWorldMat4);
      direction.copy(this.direction).transformDirection(invWorldMat4); // Break out early if bounds too far away from origin

      if (maxDistance) {
        if (origin.distance(bounds.center) - bounds.radius > localMaxDistance) return;
      }

      let localDistance = 0; // Check origin isn't inside bounds before testing intersection

      if (mesh.geometry.raycast === 'sphere') {
        if (origin.distance(bounds.center) > bounds.radius) {
          localDistance = this.intersectSphere(bounds, origin, direction);
          if (!localDistance) return;
        }
      } else {
        if (origin.x < bounds.min.x || origin.x > bounds.max.x || origin.y < bounds.min.y || origin.y > bounds.max.y || origin.z < bounds.min.z || origin.z > bounds.max.z) {
          localDistance = this.intersectBox(bounds, origin, direction);
          if (!localDistance) return;
        }
      }

      if (maxDistance && localDistance > localMaxDistance) return; // Create object on mesh to avoid generating lots of objects

      if (!mesh.hit) mesh.hit = {
        localPoint: new _Vec2.Vec3(),
        point: new _Vec2.Vec3()
      };
      mesh.hit.localPoint.copy(direction).multiply(localDistance).add(origin);
      mesh.hit.point.copy(mesh.hit.localPoint).applyMatrix4(mesh.worldMatrix);
      mesh.hit.distance = mesh.hit.point.distance(this.origin);
      hits.push(mesh);
    });
    hits.sort((a, b) => a.hit.distance - b.hit.distance);
    return hits;
  }

  intersectMeshes(meshes, {
    cullFace = true,
    maxDistance,
    includeUV = true,
    includeNormal = true,
    output = []
  } = {}) {
    // Test bounds first before testing geometry
    const hits = this.intersectBounds(meshes, {
      maxDistance,
      output
    });
    if (!hits.length) return hits;
    const invWorldMat4 = tempMat4;
    const origin = tempVec3a;
    const direction = tempVec3b;
    const a = tempVec3c;
    const b = tempVec3d;
    const c = tempVec3e;
    const closestFaceNormal = tempVec3f;
    const faceNormal = tempVec3g;
    const barycoord = tempVec3h;
    const uvA = tempVec2a;
    const uvB = tempVec2b;
    const uvC = tempVec2c;

    for (let i = hits.length - 1; i >= 0; i--) {
      const mesh = hits[i];
      invWorldMat4.inverse(mesh.worldMatrix); // Get max distance locally

      let localMaxDistance;

      if (maxDistance) {
        direction.copy(this.direction).scaleRotateMatrix4(invWorldMat4);
        localMaxDistance = maxDistance * direction.len();
      } // Take world space ray and make it object space to align with bounding box


      origin.copy(this.origin).applyMatrix4(invWorldMat4);
      direction.copy(this.direction).transformDirection(invWorldMat4);
      let localDistance = 0;
      let closestA, closestB, closestC;
      const geometry = mesh.geometry;
      const attributes = geometry.attributes;
      const index = attributes.index;
      const start = Math.max(0, geometry.drawRange.start);
      const end = Math.min(index ? index.count : attributes.position.count, geometry.drawRange.start + geometry.drawRange.count);

      for (let j = start; j < end; j += 3) {
        // Position attribute indices for each triangle
        const ai = index ? index.data[j] : j;
        const bi = index ? index.data[j + 1] : j + 1;
        const ci = index ? index.data[j + 2] : j + 2;
        a.fromArray(attributes.position.data, ai * 3);
        b.fromArray(attributes.position.data, bi * 3);
        c.fromArray(attributes.position.data, ci * 3);
        const distance = this.intersectTriangle(a, b, c, cullFace, origin, direction, faceNormal);
        if (!distance) continue; // Too far away

        if (maxDistance && distance > localMaxDistance) continue;

        if (!localDistance || distance < localDistance) {
          localDistance = distance;
          closestA = ai;
          closestB = bi;
          closestC = ci;
          closestFaceNormal.copy(faceNormal);
        }
      }

      if (!localDistance) hits.splice(i, 1); // Update hit values from bounds-test

      mesh.hit.localPoint.copy(direction).multiply(localDistance).add(origin);
      mesh.hit.point.copy(mesh.hit.localPoint).applyMatrix4(mesh.worldMatrix);
      mesh.hit.distance = mesh.hit.point.distance(this.origin); // Add unique hit objects on mesh to avoid generating lots of objects

      if (!mesh.hit.faceNormal) {
        mesh.hit.localFaceNormal = new _Vec2.Vec3();
        mesh.hit.faceNormal = new _Vec2.Vec3();
        mesh.hit.uv = new _Vec.Vec2();
        mesh.hit.localNormal = new _Vec2.Vec3();
        mesh.hit.normal = new _Vec2.Vec3();
      } // Add face normal data which is already computed


      mesh.hit.localFaceNormal.copy(closestFaceNormal);
      mesh.hit.faceNormal.copy(mesh.hit.localFaceNormal).transformDirection(mesh.worldMatrix); // Optional data, opt out to optimise a bit if necessary

      if (includeUV || includeNormal) {
        // Calculate barycoords to find uv values at hit point
        a.fromArray(attributes.position.data, closestA * 3);
        b.fromArray(attributes.position.data, closestB * 3);
        c.fromArray(attributes.position.data, closestC * 3);
        this.getBarycoord(mesh.hit.localPoint, a, b, c, barycoord);
      }

      if (includeUV && attributes.uv) {
        uvA.fromArray(attributes.uv.data, closestA * 2);
        uvB.fromArray(attributes.uv.data, closestB * 2);
        uvC.fromArray(attributes.uv.data, closestC * 2);
        mesh.hit.uv.set(uvA.x * barycoord.x + uvB.x * barycoord.y + uvC.x * barycoord.z, uvA.y * barycoord.x + uvB.y * barycoord.y + uvC.y * barycoord.z);
      }

      if (includeNormal && attributes.normal) {
        a.fromArray(attributes.normal.data, closestA * 3);
        b.fromArray(attributes.normal.data, closestB * 3);
        c.fromArray(attributes.normal.data, closestC * 3);
        mesh.hit.localNormal.set(a.x * barycoord.x + b.x * barycoord.y + c.x * barycoord.z, a.y * barycoord.x + b.y * barycoord.y + c.y * barycoord.z, a.z * barycoord.x + b.z * barycoord.y + c.z * barycoord.z);
        mesh.hit.normal.copy(mesh.hit.localNormal).transformDirection(mesh.worldMatrix);
      }
    }

    hits.sort((a, b) => a.hit.distance - b.hit.distance);
    return hits;
  }

  intersectSphere(sphere, origin = this.origin, direction = this.direction) {
    const ray = tempVec3c;
    ray.sub(sphere.center, origin);
    const tca = ray.dot(direction);
    const d2 = ray.dot(ray) - tca * tca;
    const radius2 = sphere.radius * sphere.radius;
    if (d2 > radius2) return 0;
    const thc = Math.sqrt(radius2 - d2);
    const t0 = tca - thc;
    const t1 = tca + thc;
    if (t0 < 0 && t1 < 0) return 0;
    if (t0 < 0) return t1;
    return t0;
  } // Ray AABB - Ray Axis aligned bounding box testing


  intersectBox(box, origin = this.origin, direction = this.direction) {
    let tmin, tmax, tYmin, tYmax, tZmin, tZmax;
    const invdirx = 1 / direction.x;
    const invdiry = 1 / direction.y;
    const invdirz = 1 / direction.z;
    const min = box.min;
    const max = box.max;
    tmin = ((invdirx >= 0 ? min.x : max.x) - origin.x) * invdirx;
    tmax = ((invdirx >= 0 ? max.x : min.x) - origin.x) * invdirx;
    tYmin = ((invdiry >= 0 ? min.y : max.y) - origin.y) * invdiry;
    tYmax = ((invdiry >= 0 ? max.y : min.y) - origin.y) * invdiry;
    if (tmin > tYmax || tYmin > tmax) return 0;
    if (tYmin > tmin) tmin = tYmin;
    if (tYmax < tmax) tmax = tYmax;
    tZmin = ((invdirz >= 0 ? min.z : max.z) - origin.z) * invdirz;
    tZmax = ((invdirz >= 0 ? max.z : min.z) - origin.z) * invdirz;
    if (tmin > tZmax || tZmin > tmax) return 0;
    if (tZmin > tmin) tmin = tZmin;
    if (tZmax < tmax) tmax = tZmax;
    if (tmax < 0) return 0;
    return tmin >= 0 ? tmin : tmax;
  }

  intersectTriangle(a, b, c, backfaceCulling = true, origin = this.origin, direction = this.direction, normal = tempVec3g) {
    // from https://github.com/mrdoob/three.js/blob/master/src/math/Ray.js
    // which is from http://www.geometrictools.com/GTEngine/Include/Mathematics/GteIntrRay3Triangle3.h
    const edge1 = tempVec3h;
    const edge2 = tempVec3i;
    const diff = tempVec3j;
    edge1.sub(b, a);
    edge2.sub(c, a);
    normal.cross(edge1, edge2);
    let DdN = direction.dot(normal);
    if (!DdN) return 0;
    let sign;

    if (DdN > 0) {
      if (backfaceCulling) return 0;
      sign = 1;
    } else {
      sign = -1;
      DdN = -DdN;
    }

    diff.sub(origin, a);
    let DdQxE2 = sign * direction.dot(edge2.cross(diff, edge2));
    if (DdQxE2 < 0) return 0;
    let DdE1xQ = sign * direction.dot(edge1.cross(diff));
    if (DdE1xQ < 0) return 0;
    if (DdQxE2 + DdE1xQ > DdN) return 0;
    let QdN = -sign * diff.dot(normal);
    if (QdN < 0) return 0;
    return QdN / DdN;
  }

  getBarycoord(point, a, b, c, target = tempVec3h) {
    // From https://github.com/mrdoob/three.js/blob/master/src/math/Triangle.js
    // static/instance method to calculate barycentric coordinates
    // based on: http://www.blackpawn.com/texts/pointinpoly/default.html
    const v0 = tempVec3i;
    const v1 = tempVec3j;
    const v2 = tempVec3k;
    v0.sub(c, a);
    v1.sub(b, a);
    v2.sub(point, a);
    const dot00 = v0.dot(v0);
    const dot01 = v0.dot(v1);
    const dot02 = v0.dot(v2);
    const dot11 = v1.dot(v1);
    const dot12 = v1.dot(v2);
    const denom = dot00 * dot11 - dot01 * dot01;
    if (denom === 0) return target.set(-2, -1, -1);
    const invDenom = 1 / denom;
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
    return target.set(1 - u - v, v, u);
  }

}

exports.Raycast = Raycast;
},{"../math/Vec2.js":"node_modules/ogl/src/math/Vec2.js","../math/Vec3.js":"node_modules/ogl/src/math/Vec3.js","../math/Mat4.js":"node_modules/ogl/src/math/Mat4.js"}],"node_modules/ogl/src/extras/Curve.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Curve = void 0;

var _Vec = require("../math/Vec3.js");

const CATMULLROM = 'catmullrom';
const CUBICBEZIER = 'cubicbezier';
const QUADRATICBEZIER = 'quadraticbezier'; // temp

const _a0 = new _Vec.Vec3(),
      _a1 = new _Vec.Vec3(),
      _a2 = new _Vec.Vec3(),
      _a3 = new _Vec.Vec3();
/**
 * Get the control points of cubic bezier curve.
 * @param {*} i
 * @param {*} a
 * @param {*} b
 */


function getCtrlPoint(points, i, a = 0.168, b = 0.168) {
  if (i < 1) {
    _a0.sub(points[1], points[0]).scale(a).add(points[0]);
  } else {
    _a0.sub(points[i + 1], points[i - 1]).scale(a).add(points[i]);
  }

  if (i > points.length - 3) {
    const last = points.length - 1;

    _a1.sub(points[last - 1], points[last]).scale(b).add(points[last]);
  } else {
    _a1.sub(points[i], points[i + 2]).scale(b).add(points[i + 1]);
  }

  return [_a0.clone(), _a1.clone()];
}

function getQuadraticBezierPoint(t, p0, c0, p1) {
  const k = 1 - t;

  _a0.copy(p0).scale(k ** 2);

  _a1.copy(c0).scale(2 * k * t);

  _a2.copy(p1).scale(t ** 2);

  const ret = new _Vec.Vec3();
  ret.add(_a0, _a1).add(_a2);
  return ret;
}

function getCubicBezierPoint(t, p0, c0, c1, p1) {
  const k = 1 - t;

  _a0.copy(p0).scale(k ** 3);

  _a1.copy(c0).scale(3 * k ** 2 * t);

  _a2.copy(c1).scale(3 * k * t ** 2);

  _a3.copy(p1).scale(t ** 3);

  const ret = new _Vec.Vec3();
  ret.add(_a0, _a1).add(_a2).add(_a3);
  return ret;
}

class Curve {
  constructor({
    points = [new _Vec.Vec3(0, 0, 0), new _Vec.Vec3(0, 1, 0), new _Vec.Vec3(1, 1, 0), new _Vec.Vec3(1, 0, 0)],
    divisions = 12,
    type = CATMULLROM
  } = {}) {
    this.points = points;
    this.divisions = divisions;
    this.type = type;
  }

  _getQuadraticBezierPoints(divisions = this.divisions) {
    const points = [];
    const count = this.points.length;

    if (count < 3) {
      console.warn('Not enough points provided.');
      return [];
    }

    const p0 = this.points[0];
    let c0 = this.points[1],
        p1 = this.points[2];

    for (let i = 0; i <= divisions; i++) {
      const p = getQuadraticBezierPoint(i / divisions, p0, c0, p1);
      points.push(p);
    }

    let offset = 3;

    while (count - offset > 0) {
      p0.copy(p1);
      c0 = p1.scale(2).sub(c0);
      p1 = this.points[offset];

      for (let i = 1; i <= divisions; i++) {
        const p = getQuadraticBezierPoint(i / divisions, p0, c0, p1);
        points.push(p);
      }

      offset++;
    }

    return points;
  }

  _getCubicBezierPoints(divisions = this.divisions) {
    const points = [];
    const count = this.points.length;

    if (count < 4) {
      console.warn('Not enough points provided.');
      return [];
    }

    let p0 = this.points[0],
        c0 = this.points[1],
        c1 = this.points[2],
        p1 = this.points[3];

    for (let i = 0; i <= divisions; i++) {
      const p = getCubicBezierPoint(i / divisions, p0, c0, c1, p1);
      points.push(p);
    }

    let offset = 4;

    while (count - offset > 1) {
      p0.copy(p1);
      c0 = p1.scale(2).sub(c1);
      c1 = this.points[offset];
      p1 = this.points[offset + 1];

      for (let i = 1; i <= divisions; i++) {
        const p = getCubicBezierPoint(i / divisions, p0, c0, c1, p1);
        points.push(p);
      }

      offset += 2;
    }

    return points;
  }

  _getCatmullRomPoints(divisions = this.divisions, a = 0.168, b = 0.168) {
    const points = [];
    const count = this.points.length;

    if (count <= 2) {
      return this.points;
    }

    let p0;
    this.points.forEach((p, i) => {
      if (i === 0) {
        p0 = p;
      } else {
        const [c0, c1] = getCtrlPoint(this.points, i - 1, a, b);
        const c = new Curve({
          points: [p0, c0, c1, p],
          type: CUBICBEZIER
        });
        points.pop();
        points.push(...c.getPoints(divisions));
        p0 = p;
      }
    });
    return points;
  }

  getPoints(divisions = this.divisions, a = 0.168, b = 0.168) {
    const type = this.type;

    if (type === QUADRATICBEZIER) {
      return this._getQuadraticBezierPoints(divisions);
    }

    if (type === CUBICBEZIER) {
      return this._getCubicBezierPoints(divisions);
    }

    if (type === CATMULLROM) {
      return this._getCatmullRomPoints(divisions, a, b);
    }

    return this.points;
  }

}

exports.Curve = Curve;
Curve.CATMULLROM = CATMULLROM;
Curve.CUBICBEZIER = CUBICBEZIER;
Curve.QUADRATICBEZIER = QUADRATICBEZIER;
},{"../math/Vec3.js":"node_modules/ogl/src/math/Vec3.js"}],"node_modules/ogl/src/extras/Post.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Post = void 0;

var _Program = require("../core/Program.js");

var _Mesh = require("../core/Mesh.js");

var _RenderTarget = require("../core/RenderTarget.js");

var _Triangle = require("./Triangle.js");

// TODO: Destroy render targets if size changed and exists
class Post {
  constructor(gl, {
    width,
    height,
    dpr,
    wrapS = gl.CLAMP_TO_EDGE,
    wrapT = gl.CLAMP_TO_EDGE,
    minFilter = gl.LINEAR,
    magFilter = gl.LINEAR,
    geometry = new _Triangle.Triangle(gl),
    targetOnly = null
  } = {}) {
    this.gl = gl;
    this.options = {
      wrapS,
      wrapT,
      minFilter,
      magFilter
    };
    this.passes = [];
    this.geometry = geometry;
    this.uniform = {
      value: null
    };
    this.targetOnly = targetOnly;
    const fbo = this.fbo = {
      read: null,
      write: null,
      swap: () => {
        let temp = fbo.read;
        fbo.read = fbo.write;
        fbo.write = temp;
      }
    };
    this.resize({
      width,
      height,
      dpr
    });
  }

  addPass({
    vertex = defaultVertex,
    fragment = defaultFragment,
    uniforms = {},
    textureUniform = 'tMap',
    enabled = true
  } = {}) {
    uniforms[textureUniform] = {
      value: this.fbo.read.texture
    };
    const program = new _Program.Program(this.gl, {
      vertex,
      fragment,
      uniforms
    });
    const mesh = new _Mesh.Mesh(this.gl, {
      geometry: this.geometry,
      program
    });
    const pass = {
      mesh,
      program,
      uniforms,
      enabled,
      textureUniform
    };
    this.passes.push(pass);
    return pass;
  }

  resize({
    width,
    height,
    dpr
  } = {}) {
    if (dpr) this.dpr = dpr;

    if (width) {
      this.width = width;
      this.height = height || width;
    }

    dpr = this.dpr || this.gl.renderer.dpr;
    width = (this.width || this.gl.renderer.width) * dpr;
    height = (this.height || this.gl.renderer.height) * dpr;
    this.options.width = width;
    this.options.height = height;
    this.fbo.read = new _RenderTarget.RenderTarget(this.gl, this.options);
    this.fbo.write = new _RenderTarget.RenderTarget(this.gl, this.options);
  } // Uses same arguments as renderer.render


  render({
    scene,
    camera,
    target = null,
    update = true,
    sort = true,
    frustumCull = true
  }) {
    const enabledPasses = this.passes.filter(pass => pass.enabled);
    this.gl.renderer.render({
      scene,
      camera,
      target: enabledPasses.length || !target && this.targetOnly ? this.fbo.write : target,
      update,
      sort,
      frustumCull
    });
    this.fbo.swap();
    enabledPasses.forEach((pass, i) => {
      pass.mesh.program.uniforms[pass.textureUniform].value = this.fbo.read.texture;
      this.gl.renderer.render({
        scene: pass.mesh,
        target: i === enabledPasses.length - 1 && (target || !this.targetOnly) ? target : this.fbo.write,
        clear: true
      });
      this.fbo.swap();
    });
    this.uniform.value = this.fbo.read.texture;
  }

}

exports.Post = Post;
const defaultVertex =
/* glsl */
`
    attribute vec2 uv;
    attribute vec2 position;

    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
    }
`;
const defaultFragment =
/* glsl */
`
    precision highp float;

    uniform sampler2D tMap;
    varying vec2 vUv;

    void main() {
        gl_FragColor = texture2D(tMap, vUv);
    }
`;
},{"../core/Program.js":"node_modules/ogl/src/core/Program.js","../core/Mesh.js":"node_modules/ogl/src/core/Mesh.js","../core/RenderTarget.js":"node_modules/ogl/src/core/RenderTarget.js","./Triangle.js":"node_modules/ogl/src/extras/Triangle.js"}],"node_modules/ogl/src/extras/Animation.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Animation = void 0;

var _Vec = require("../math/Vec3.js");

var _Quat = require("../math/Quat.js");

const prevPos = new _Vec.Vec3();
const prevRot = new _Quat.Quat();
const prevScl = new _Vec.Vec3();
const nextPos = new _Vec.Vec3();
const nextRot = new _Quat.Quat();
const nextScl = new _Vec.Vec3();

class Animation {
  constructor({
    objects,
    data
  }) {
    this.objects = objects;
    this.data = data;
    this.elapsed = 0;
    this.weight = 1;
    this.duration = data.frames.length - 1;
  }

  update(totalWeight = 1, isSet) {
    const weight = isSet ? 1 : this.weight / totalWeight;
    const elapsed = this.elapsed % this.duration;
    const floorFrame = Math.floor(elapsed);
    const blend = elapsed - floorFrame;
    const prevKey = this.data.frames[floorFrame];
    const nextKey = this.data.frames[(floorFrame + 1) % this.duration];
    this.objects.forEach((object, i) => {
      prevPos.fromArray(prevKey.position, i * 3);
      prevRot.fromArray(prevKey.quaternion, i * 4);
      prevScl.fromArray(prevKey.scale, i * 3);
      nextPos.fromArray(nextKey.position, i * 3);
      nextRot.fromArray(nextKey.quaternion, i * 4);
      nextScl.fromArray(nextKey.scale, i * 3);
      prevPos.lerp(nextPos, blend);
      prevRot.slerp(nextRot, blend);
      prevScl.lerp(nextScl, blend);
      object.position.lerp(prevPos, weight);
      object.quaternion.slerp(prevRot, weight);
      object.scale.lerp(prevScl, weight);
    });
  }

}

exports.Animation = Animation;
},{"../math/Vec3.js":"node_modules/ogl/src/math/Vec3.js","../math/Quat.js":"node_modules/ogl/src/math/Quat.js"}],"node_modules/ogl/src/extras/Skin.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Skin = void 0;

var _Mesh = require("../core/Mesh.js");

var _Transform = require("../core/Transform.js");

var _Mat = require("../math/Mat4.js");

var _Texture = require("../core/Texture.js");

var _Animation = require("./Animation.js");

const tempMat4 = new _Mat.Mat4();

class Skin extends _Mesh.Mesh {
  constructor(gl, {
    rig,
    geometry,
    program,
    mode = gl.TRIANGLES
  } = {}) {
    super(gl, {
      geometry,
      program,
      mode
    });
    this.createBones(rig);
    this.createBoneTexture();
    this.animations = [];
    Object.assign(this.program.uniforms, {
      boneTexture: {
        value: this.boneTexture
      },
      boneTextureSize: {
        value: this.boneTextureSize
      }
    });
  }

  createBones(rig) {
    // Create root so that can simply update world matrix of whole skeleton
    this.root = new _Transform.Transform(); // Create bones

    this.bones = [];
    if (!rig.bones || !rig.bones.length) return;

    for (let i = 0; i < rig.bones.length; i++) {
      const bone = new _Transform.Transform(); // Set initial values (bind pose)

      bone.position.fromArray(rig.bindPose.position, i * 3);
      bone.quaternion.fromArray(rig.bindPose.quaternion, i * 4);
      bone.scale.fromArray(rig.bindPose.scale, i * 3);
      this.bones.push(bone);
    } // Once created, set the hierarchy


    rig.bones.forEach((data, i) => {
      this.bones[i].name = data.name;
      if (data.parent === -1) return this.bones[i].setParent(this.root);
      this.bones[i].setParent(this.bones[data.parent]);
    }); // Then update to calculate world matrices

    this.root.updateMatrixWorld(true); // Store inverse of bind pose to calculate differences

    this.bones.forEach(bone => {
      bone.bindInverse = new _Mat.Mat4(...bone.worldMatrix).inverse();
    });
  }

  createBoneTexture() {
    if (!this.bones.length) return;
    const size = Math.max(4, Math.pow(2, Math.ceil(Math.log(Math.sqrt(this.bones.length * 4)) / Math.LN2)));
    this.boneMatrices = new Float32Array(size * size * 4);
    this.boneTextureSize = size;
    this.boneTexture = new _Texture.Texture(this.gl, {
      image: this.boneMatrices,
      generateMipmaps: false,
      type: this.gl.FLOAT,
      internalFormat: this.gl.renderer.isWebgl2 ? this.gl.RGBA32F : this.gl.RGBA,
      minFilter: this.gl.NEAREST,
      magFilter: this.gl.NEAREST,
      flipY: false,
      width: size
    });
  }

  addAnimation(data) {
    const animation = new _Animation.Animation({
      objects: this.bones,
      data
    });
    this.animations.push(animation);
    return animation;
  }

  update() {
    // Calculate combined animation weight
    let total = 0;
    this.animations.forEach(animation => total += animation.weight);
    this.animations.forEach((animation, i) => {
      // force first animation to set in order to reset frame
      animation.update(total, i === 0);
    });
  }

  draw({
    camera
  } = {}) {
    // Update world matrices manually, as not part of scene graph
    this.root.updateMatrixWorld(true); // Update bone texture

    this.bones.forEach((bone, i) => {
      // Find difference between current and bind pose
      tempMat4.multiply(bone.worldMatrix, bone.bindInverse);
      this.boneMatrices.set(tempMat4, i * 16);
    });
    if (this.boneTexture) this.boneTexture.needsUpdate = true;
    super.draw({
      camera
    });
  }

}

exports.Skin = Skin;
},{"../core/Mesh.js":"node_modules/ogl/src/core/Mesh.js","../core/Transform.js":"node_modules/ogl/src/core/Transform.js","../math/Mat4.js":"node_modules/ogl/src/math/Mat4.js","../core/Texture.js":"node_modules/ogl/src/core/Texture.js","./Animation.js":"node_modules/ogl/src/extras/Animation.js"}],"node_modules/ogl/src/extras/Text.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Text = Text;

function Text({
  font,
  text,
  width = Infinity,
  align = 'left',
  size = 1,
  letterSpacing = 0,
  lineHeight = 1.4,
  wordSpacing = 0,
  wordBreak = false
}) {
  const _this = this;

  let glyphs, buffers;
  let fontHeight, baseline, scale;
  const newline = /\n/;
  const whitespace = /\s/;
  {
    parseFont();
    createGeometry();
  }

  function parseFont() {
    glyphs = {};
    font.chars.forEach(d => glyphs[d.char] = d);
  }

  function createGeometry() {
    fontHeight = font.common.lineHeight;
    baseline = font.common.base; // Use baseline so that actual text height is as close to 'size' value as possible

    scale = size / baseline; // Strip spaces and newlines to get actual character length for buffers

    let chars = text.replace(/[ \n]/g, '');
    let numChars = chars.length; // Create output buffers

    buffers = {
      position: new Float32Array(numChars * 4 * 3),
      uv: new Float32Array(numChars * 4 * 2),
      id: new Float32Array(numChars * 4),
      index: new Uint16Array(numChars * 6)
    }; // Set values for buffers that don't require calculation

    for (let i = 0; i < numChars; i++) {
      buffers.id[i] = i;
      buffers.index.set([i * 4, i * 4 + 2, i * 4 + 1, i * 4 + 1, i * 4 + 2, i * 4 + 3], i * 6);
    }

    layout();
  }

  function layout() {
    const lines = [];
    let cursor = 0;
    let wordCursor = 0;
    let wordWidth = 0;
    let line = newLine();

    function newLine() {
      const line = {
        width: 0,
        glyphs: []
      };
      lines.push(line);
      wordCursor = cursor;
      wordWidth = 0;
      return line;
    }

    let maxTimes = 100;
    let count = 0;

    while (cursor < text.length && count < maxTimes) {
      count++;
      const char = text[cursor]; // Skip whitespace at start of line

      if (!line.width && whitespace.test(char)) {
        cursor++;
        wordCursor = cursor;
        wordWidth = 0;
        continue;
      } // If newline char, skip to next line


      if (newline.test(char)) {
        cursor++;
        line = newLine();
        continue;
      }

      const glyph = glyphs[char] || glyphs[' ']; // Find any applicable kern pairs

      if (line.glyphs.length) {
        const prevGlyph = line.glyphs[line.glyphs.length - 1][0];
        let kern = getKernPairOffset(glyph.id, prevGlyph.id) * scale;
        line.width += kern;
        wordWidth += kern;
      } // add char to line


      line.glyphs.push([glyph, line.width]); // calculate advance for next glyph

      let advance = 0; // If whitespace, update location of current word for line breaks

      if (whitespace.test(char)) {
        wordCursor = cursor;
        wordWidth = 0; // Add wordspacing

        advance += wordSpacing * size;
      } else {
        // Add letterspacing
        advance += letterSpacing * size;
      }

      advance += glyph.xadvance * scale;
      line.width += advance;
      wordWidth += advance; // If width defined

      if (line.width > width) {
        // If can break words, undo latest glyph if line not empty and create new line
        if (wordBreak && line.glyphs.length > 1) {
          line.width -= advance;
          line.glyphs.pop();
          line = newLine();
          continue; // If not first word, undo current word and cursor and create new line
        } else if (!wordBreak && wordWidth !== line.width) {
          let numGlyphs = cursor - wordCursor + 1;
          line.glyphs.splice(-numGlyphs, numGlyphs);
          cursor = wordCursor;
          line.width -= wordWidth;
          line = newLine();
          continue;
        }
      }

      cursor++;
    } // Remove last line if empty


    if (!line.width) lines.pop();
    populateBuffers(lines);
  }

  function populateBuffers(lines) {
    const texW = font.common.scaleW;
    const texH = font.common.scaleH; // For all fonts tested, a little offset was needed to be right on the baseline, hence 0.07.

    let y = 0.07 * size;
    let j = 0;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      let line = lines[lineIndex];

      for (let i = 0; i < line.glyphs.length; i++) {
        const glyph = line.glyphs[i][0];
        let x = line.glyphs[i][1];

        if (align === 'center') {
          x -= line.width * 0.5;
        } else if (align === 'right') {
          x -= line.width;
        } // If space, don't add to geometry


        if (whitespace.test(glyph.char)) continue; // Apply char sprite offsets

        x += glyph.xoffset * scale;
        y -= glyph.yoffset * scale; // each letter is a quad. axis bottom left

        let w = glyph.width * scale;
        let h = glyph.height * scale;
        buffers.position.set([x, y - h, 0, x, y, 0, x + w, y - h, 0, x + w, y, 0], j * 4 * 3);
        let u = glyph.x / texW;
        let uw = glyph.width / texW;
        let v = 1.0 - glyph.y / texH;
        let vh = glyph.height / texH;
        buffers.uv.set([u, v - vh, u, v, u + uw, v - vh, u + uw, v], j * 4 * 2); // Reset cursor to baseline

        y += glyph.yoffset * scale;
        j++;
      }

      y -= size * lineHeight;
    }

    _this.buffers = buffers;
    _this.numLines = lines.length;
    _this.height = _this.numLines * size * lineHeight;
  }

  function getKernPairOffset(id1, id2) {
    for (let i = 0; i < font.kernings.length; i++) {
      let k = font.kernings[i];
      if (k.first < id1) continue;
      if (k.second < id2) continue;
      if (k.first > id1) return 0;
      if (k.first === id1 && k.second > id2) return 0;
      return k.amount;
    }

    return 0;
  } // Update buffers to layout with new layout


  this.resize = function (options) {
    ({
      width
    } = options);
    layout();
  }; // Completely change text (like creating new Text)


  this.update = function (options) {
    ({
      text
    } = options);
    createGeometry();
  };
}
},{}],"node_modules/ogl/src/extras/NormalProgram.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NormalProgram = NormalProgram;

var _Program = require("../core/Program.js");

const vertex =
/* glsl */
`
    precision highp float;
    precision highp int;

    attribute vec3 position;
    attribute vec3 normal;

    uniform mat3 normalMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    varying vec3 vNormal;

    void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
const fragment =
/* glsl */
`
    precision highp float;
    precision highp int;

    varying vec3 vNormal;

    void main() {
        gl_FragColor.rgb = normalize(vNormal);
        gl_FragColor.a = 1.0;
    }
`;

function NormalProgram(gl) {
  return new _Program.Program(gl, {
    vertex: vertex,
    fragment: fragment,
    cullFace: null
  });
}
},{"../core/Program.js":"node_modules/ogl/src/core/Program.js"}],"node_modules/ogl/src/extras/Flowmap.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Flowmap = void 0;

var _RenderTarget = require("../core/RenderTarget.js");

var _Program = require("../core/Program.js");

var _Mesh = require("../core/Mesh.js");

var _Vec = require("../math/Vec2.js");

var _Triangle = require("./Triangle.js");

class Flowmap {
  constructor(gl, {
    size = 128,
    // default size of the render targets
    falloff = 0.3,
    // size of the stamp, percentage of the size
    alpha = 1,
    // opacity of the stamp
    dissipation = 0.98,
    // affects the speed that the stamp fades. Closer to 1 is slower
    type // Pass in gl.FLOAT to force it, defaults to gl.HALF_FLOAT

  } = {}) {
    const _this = this;

    this.gl = gl; // output uniform containing render target textures

    this.uniform = {
      value: null
    };
    this.mask = {
      read: null,
      write: null,
      // Helper function to ping pong the render targets and update the uniform
      swap: () => {
        let temp = _this.mask.read;
        _this.mask.read = _this.mask.write;
        _this.mask.write = temp;
        _this.uniform.value = _this.mask.read.texture;
      }
    };
    {
      createFBOs();
      this.aspect = 1;
      this.mouse = new _Vec.Vec2();
      this.velocity = new _Vec.Vec2();
      this.mesh = initProgram();
    }

    function createFBOs() {
      // Requested type not supported, fall back to half float
      if (!type) type = gl.HALF_FLOAT || gl.renderer.extensions['OES_texture_half_float'].HALF_FLOAT_OES;

      let minFilter = (() => {
        if (gl.renderer.isWebgl2) return gl.LINEAR;
        if (gl.renderer.extensions[`OES_texture_${type === gl.FLOAT ? '' : 'half_'}float_linear`]) return gl.LINEAR;
        return gl.NEAREST;
      })();

      const options = {
        width: size,
        height: size,
        type,
        format: gl.RGBA,
        internalFormat: gl.renderer.isWebgl2 ? type === gl.FLOAT ? gl.RGBA32F : gl.RGBA16F : gl.RGBA,
        minFilter,
        depth: false
      };
      _this.mask.read = new _RenderTarget.RenderTarget(gl, options);
      _this.mask.write = new _RenderTarget.RenderTarget(gl, options);

      _this.mask.swap();
    }

    function initProgram() {
      return new _Mesh.Mesh(gl, {
        // Triangle that includes -1 to 1 range for 'position', and 0 to 1 range for 'uv'.
        geometry: new _Triangle.Triangle(gl),
        program: new _Program.Program(gl, {
          vertex,
          fragment,
          uniforms: {
            tMap: _this.uniform,
            uFalloff: {
              value: falloff * 0.5
            },
            uAlpha: {
              value: alpha
            },
            uDissipation: {
              value: dissipation
            },
            // User needs to update these
            uAspect: {
              value: 1
            },
            uMouse: {
              value: _this.mouse
            },
            uVelocity: {
              value: _this.velocity
            }
          },
          depthTest: false
        })
      });
    }
  }

  update() {
    this.mesh.program.uniforms.uAspect.value = this.aspect;
    this.gl.renderer.render({
      scene: this.mesh,
      target: this.mask.write,
      clear: false
    });
    this.mask.swap();
  }

}

exports.Flowmap = Flowmap;
const vertex =
/* glsl */
`
    attribute vec2 uv;
    attribute vec2 position;

    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
    }
`;
const fragment =
/* glsl */
`
    precision highp float;

    uniform sampler2D tMap;

    uniform float uFalloff;
    uniform float uAlpha;
    uniform float uDissipation;
    
    uniform float uAspect;
    uniform vec2 uMouse;
    uniform vec2 uVelocity;

    varying vec2 vUv;

    void main() {
        vec4 color = texture2D(tMap, vUv) * uDissipation;

        vec2 cursor = vUv - uMouse;
        cursor.x *= uAspect;

        vec3 stamp = vec3(uVelocity * vec2(1, -1), 1.0 - pow(1.0 - min(1.0, length(uVelocity)), 3.0));
        float falloff = smoothstep(uFalloff, 0.0, length(cursor)) * uAlpha;

        color.rgb = mix(color.rgb, stamp, vec3(falloff));

        gl_FragColor = color;
    }
`;
},{"../core/RenderTarget.js":"node_modules/ogl/src/core/RenderTarget.js","../core/Program.js":"node_modules/ogl/src/core/Program.js","../core/Mesh.js":"node_modules/ogl/src/core/Mesh.js","../math/Vec2.js":"node_modules/ogl/src/math/Vec2.js","./Triangle.js":"node_modules/ogl/src/extras/Triangle.js"}],"node_modules/ogl/src/extras/GPGPU.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GPGPU = void 0;

var _Program = require("../core/Program.js");

var _Mesh = require("../core/Mesh.js");

var _Texture = require("../core/Texture.js");

var _RenderTarget = require("../core/RenderTarget.js");

var _Triangle = require("./Triangle.js");

class GPGPU {
  constructor(gl, {
    // Always pass in array of vec4s (RGBA values within texture)
    data = new Float32Array(16),
    geometry = new _Triangle.Triangle(gl),
    type // Pass in gl.FLOAT to force it, defaults to gl.HALF_FLOAT

  }) {
    this.gl = gl;
    const initialData = data;
    this.passes = [];
    this.geometry = geometry;
    this.dataLength = initialData.length / 4; // Windows and iOS only like power of 2 textures
    // Find smallest PO2 that fits data

    this.size = Math.pow(2, Math.ceil(Math.log(Math.ceil(Math.sqrt(this.dataLength))) / Math.LN2)); // Create coords for output texture

    this.coords = new Float32Array(this.dataLength * 2);

    for (let i = 0; i < this.dataLength; i++) {
      const x = i % this.size / this.size; // to add 0.5 to be center pixel ?

      const y = Math.floor(i / this.size) / this.size;
      this.coords.set([x, y], i * 2);
    } // Use original data if already correct length of PO2 texture, else copy to new array of correct length


    const floatArray = (() => {
      if (initialData.length === this.size * this.size * 4) {
        return initialData;
      } else {
        const a = new Float32Array(this.size * this.size * 4);
        a.set(initialData);
        return a;
      }
    })(); // Create output texture uniform using input float texture with initial data


    this.uniform = {
      value: new _Texture.Texture(gl, {
        image: floatArray,
        target: gl.TEXTURE_2D,
        type: gl.FLOAT,
        format: gl.RGBA,
        internalFormat: gl.renderer.isWebgl2 ? gl.RGBA32F : gl.RGBA,
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE,
        generateMipmaps: false,
        minFilter: gl.NEAREST,
        magFilter: gl.NEAREST,
        width: this.size,
        flipY: false
      })
    }; // Create FBOs

    const options = {
      width: this.size,
      height: this.size,
      type: type || gl.HALF_FLOAT || gl.renderer.extensions['OES_texture_half_float'].HALF_FLOAT_OES,
      format: gl.RGBA,
      internalFormat: gl.renderer.isWebgl2 ? type === gl.FLOAT ? gl.RGBA32F : gl.RGBA16F : gl.RGBA,
      minFilter: gl.NEAREST,
      depth: false,
      unpackAlignment: 1
    };
    this.fbo = {
      read: new _RenderTarget.RenderTarget(gl, options),
      write: new _RenderTarget.RenderTarget(gl, options),
      swap: () => {
        let temp = this.fbo.read;
        this.fbo.read = this.fbo.write;
        this.fbo.write = temp;
        this.uniform.value = this.fbo.read.texture;
      }
    };
  }

  addPass({
    vertex = defaultVertex,
    fragment = defaultFragment,
    uniforms = {},
    textureUniform = 'tMap',
    enabled = true
  } = {}) {
    uniforms[textureUniform] = this.uniform;
    const program = new _Program.Program(this.gl, {
      vertex,
      fragment,
      uniforms
    });
    const mesh = new _Mesh.Mesh(this.gl, {
      geometry: this.geometry,
      program
    });
    const pass = {
      mesh,
      program,
      uniforms,
      enabled,
      textureUniform
    };
    this.passes.push(pass);
    return pass;
  }

  render() {
    const enabledPasses = this.passes.filter(pass => pass.enabled);
    enabledPasses.forEach((pass, i) => {
      this.gl.renderer.render({
        scene: pass.mesh,
        target: this.fbo.write,
        clear: false
      });
      this.fbo.swap();
    });
  }

}

exports.GPGPU = GPGPU;
const defaultVertex =
/* glsl */
`
    attribute vec2 uv;
    attribute vec2 position;

    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
    }
`;
const defaultFragment =
/* glsl */
`
    precision highp float;

    uniform sampler2D tMap;
    varying vec2 vUv;

    void main() {
        gl_FragColor = texture2D(tMap, vUv);
    }
`;
},{"../core/Program.js":"node_modules/ogl/src/core/Program.js","../core/Mesh.js":"node_modules/ogl/src/core/Mesh.js","../core/Texture.js":"node_modules/ogl/src/core/Texture.js","../core/RenderTarget.js":"node_modules/ogl/src/core/RenderTarget.js","./Triangle.js":"node_modules/ogl/src/extras/Triangle.js"}],"node_modules/ogl/src/extras/Polyline.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Polyline = void 0;

var _Geometry = require("../core/Geometry.js");

var _Program = require("../core/Program.js");

var _Mesh = require("../core/Mesh.js");

var _Vec = require("../math/Vec2.js");

var _Vec2 = require("../math/Vec3.js");

var _Color = require("../math/Color.js");

const tmp = new _Vec2.Vec3();

class Polyline {
  constructor(gl, {
    points,
    // Array of Vec3s
    vertex = defaultVertex,
    fragment = defaultFragment,
    uniforms = {},
    attributes = {} // For passing in custom attribs

  }) {
    this.gl = gl;
    this.points = points;
    this.count = points.length; // Create buffers

    this.position = new Float32Array(this.count * 3 * 2);
    this.prev = new Float32Array(this.count * 3 * 2);
    this.next = new Float32Array(this.count * 3 * 2);
    const side = new Float32Array(this.count * 1 * 2);
    const uv = new Float32Array(this.count * 2 * 2);
    const index = new Uint16Array((this.count - 1) * 3 * 2); // Set static buffers

    for (let i = 0; i < this.count; i++) {
      side.set([-1, 1], i * 2);
      const v = i / (this.count - 1);
      uv.set([0, v, 1, v], i * 4);
      if (i === this.count - 1) continue;
      const ind = i * 2;
      index.set([ind + 0, ind + 1, ind + 2], (ind + 0) * 3);
      index.set([ind + 2, ind + 1, ind + 3], (ind + 1) * 3);
    }

    const geometry = this.geometry = new _Geometry.Geometry(gl, Object.assign(attributes, {
      position: {
        size: 3,
        data: this.position
      },
      prev: {
        size: 3,
        data: this.prev
      },
      next: {
        size: 3,
        data: this.next
      },
      side: {
        size: 1,
        data: side
      },
      uv: {
        size: 2,
        data: uv
      },
      index: {
        size: 1,
        data: index
      }
    })); // Populate dynamic buffers

    this.updateGeometry();
    if (!uniforms.uResolution) this.resolution = uniforms.uResolution = {
      value: new _Vec.Vec2()
    };
    if (!uniforms.uDPR) this.dpr = uniforms.uDPR = {
      value: 1
    };
    if (!uniforms.uThickness) this.thickness = uniforms.uThickness = {
      value: 1
    };
    if (!uniforms.uColor) this.color = uniforms.uColor = {
      value: new _Color.Color('#000')
    };
    if (!uniforms.uMiter) this.miter = uniforms.uMiter = {
      value: 1
    }; // Set size uniforms' values

    this.resize();
    const program = this.program = new _Program.Program(gl, {
      vertex,
      fragment,
      uniforms
    });
    this.mesh = new _Mesh.Mesh(gl, {
      geometry,
      program
    });
  }

  updateGeometry() {
    this.points.forEach((p, i) => {
      p.toArray(this.position, i * 3 * 2);
      p.toArray(this.position, i * 3 * 2 + 3);

      if (!i) {
        // If first point, calculate prev using the distance to 2nd point
        tmp.copy(p).sub(this.points[i + 1]).add(p);
        tmp.toArray(this.prev, i * 3 * 2);
        tmp.toArray(this.prev, i * 3 * 2 + 3);
      } else {
        p.toArray(this.next, (i - 1) * 3 * 2);
        p.toArray(this.next, (i - 1) * 3 * 2 + 3);
      }

      if (i === this.points.length - 1) {
        // If last point, calculate next using distance to 2nd last point
        tmp.copy(p).sub(this.points[i - 1]).add(p);
        tmp.toArray(this.next, i * 3 * 2);
        tmp.toArray(this.next, i * 3 * 2 + 3);
      } else {
        p.toArray(this.prev, (i + 1) * 3 * 2);
        p.toArray(this.prev, (i + 1) * 3 * 2 + 3);
      }
    });
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.prev.needsUpdate = true;
    this.geometry.attributes.next.needsUpdate = true;
  } // Only need to call if not handling resolution uniforms manually


  resize() {
    // Update automatic uniforms if not overridden
    if (this.resolution) this.resolution.value.set(this.gl.canvas.width, this.gl.canvas.height);
    if (this.dpr) this.dpr.value = this.gl.renderer.dpr;
  }

}

exports.Polyline = Polyline;
const defaultVertex =
/* glsl */
`
    precision highp float;

    attribute vec3 position;
    attribute vec3 next;
    attribute vec3 prev;
    attribute vec2 uv;
    attribute float side;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform vec2 uResolution;
    uniform float uDPR;
    uniform float uThickness;
    uniform float uMiter;

    varying vec2 vUv;

    vec4 getPosition() {
        mat4 mvp = projectionMatrix * modelViewMatrix;
        vec4 current = mvp * vec4(position, 1);
        vec4 nextPos = mvp * vec4(next, 1);
        vec4 prevPos = mvp * vec4(prev, 1);

        vec2 aspect = vec2(uResolution.x / uResolution.y, 1);    
        vec2 currentScreen = current.xy / current.w * aspect;
        vec2 nextScreen = nextPos.xy / nextPos.w * aspect;
        vec2 prevScreen = prevPos.xy / prevPos.w * aspect;
    
        vec2 dir1 = normalize(currentScreen - prevScreen);
        vec2 dir2 = normalize(nextScreen - currentScreen);
        vec2 dir = normalize(dir1 + dir2);
    
        vec2 normal = vec2(-dir.y, dir.x);
        normal /= mix(1.0, max(0.3, dot(normal, vec2(-dir1.y, dir1.x))), uMiter);
        normal /= aspect;

        float pixelWidthRatio = 1.0 / (uResolution.y / uDPR);
        float pixelWidth = current.w * pixelWidthRatio;
        normal *= pixelWidth * uThickness;
        current.xy -= normal * side;
    
        return current;
    }

    void main() {
        vUv = uv;
        gl_Position = getPosition();
    }
`;
const defaultFragment =
/* glsl */
`
    precision highp float;

    uniform vec3 uColor;
    
    varying vec2 vUv;

    void main() {
        gl_FragColor.rgb = uColor;
        gl_FragColor.a = 1.0;
    }
`;
},{"../core/Geometry.js":"node_modules/ogl/src/core/Geometry.js","../core/Program.js":"node_modules/ogl/src/core/Program.js","../core/Mesh.js":"node_modules/ogl/src/core/Mesh.js","../math/Vec2.js":"node_modules/ogl/src/math/Vec2.js","../math/Vec3.js":"node_modules/ogl/src/math/Vec3.js","../math/Color.js":"node_modules/ogl/src/math/Color.js"}],"node_modules/ogl/src/extras/Shadow.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Shadow = void 0;

var _Camera = require("../core/Camera.js");

var _Program = require("../core/Program.js");

var _RenderTarget = require("../core/RenderTarget.js");

class Shadow {
  constructor(gl, {
    light = new _Camera.Camera(gl),
    width = 1024,
    height = width
  }) {
    this.gl = gl;
    this.light = light;
    this.target = new _RenderTarget.RenderTarget(gl, {
      width,
      height
    });
    this.depthProgram = new _Program.Program(gl, {
      vertex: defaultVertex,
      fragment: defaultFragment,
      cullFace: null
    });
    this.castMeshes = [];
  }

  add({
    mesh,
    receive = true,
    cast = true,
    vertex = defaultVertex,
    fragment = defaultFragment,
    uniformProjection = 'shadowProjectionMatrix',
    uniformView = 'shadowViewMatrix',
    uniformTexture = 'tShadow'
  }) {
    // Add uniforms to existing program
    if (receive && !mesh.program.uniforms[uniformProjection]) {
      mesh.program.uniforms[uniformProjection] = {
        value: this.light.projectionMatrix
      };
      mesh.program.uniforms[uniformView] = {
        value: this.light.viewMatrix
      };
      mesh.program.uniforms[uniformTexture] = {
        value: this.target.texture
      };
    }

    if (!cast) return;
    this.castMeshes.push(mesh); // Store program for when switching between depth override

    mesh.colorProgram = mesh.program; // Check if depth program already attached

    if (mesh.depthProgram) return; // Use global depth override if nothing custom passed in

    if (vertex === defaultVertex && fragment === defaultFragment) {
      mesh.depthProgram = this.depthProgram;
      return;
    } // Create custom override program


    mesh.depthProgram = new _Program.Program(this.gl, {
      vertex,
      fragment,
      cullFace: null
    });
  }

  render({
    scene
  }) {
    // For depth render, replace program with depth override.
    // Hide meshes not casting shadows.
    scene.traverse(node => {
      if (!node.draw) return;

      if (!!~this.castMeshes.indexOf(node)) {
        node.program = node.depthProgram;
      } else {
        node.isForceVisibility = node.visible;
        node.visible = false;
      }
    }); // Render the depth shadow map using the light as the camera

    this.gl.renderer.render({
      scene,
      camera: this.light,
      target: this.target
    }); // Then switch the program back to the normal one

    scene.traverse(node => {
      if (!node.draw) return;

      if (!!~this.castMeshes.indexOf(node)) {
        node.program = node.colorProgram;
      } else {
        node.visible = node.isForceVisibility;
      }
    });
  }

}

exports.Shadow = Shadow;
const defaultVertex =
/* glsl */
`
    attribute vec3 position;
    attribute vec2 uv;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
const defaultFragment =
/* glsl */
`
    precision highp float;

    vec4 packRGBA (float v) {
        vec4 pack = fract(vec4(1.0, 255.0, 65025.0, 16581375.0) * v);
        pack -= pack.yzww * vec2(1.0 / 255.0, 0.0).xxxy;
        return pack;
    }

    void main() {
        gl_FragColor = packRGBA(gl_FragCoord.z);
    }
`;
},{"../core/Camera.js":"node_modules/ogl/src/core/Camera.js","../core/Program.js":"node_modules/ogl/src/core/Program.js","../core/RenderTarget.js":"node_modules/ogl/src/core/RenderTarget.js"}],"node_modules/ogl/src/extras/KTXTexture.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KTXTexture = void 0;

var _Texture = require("../core/Texture.js");

// TODO: Support cubemaps
// Generate textures using https://github.com/TimvanScherpenzeel/texture-compressor
class KTXTexture extends _Texture.Texture {
  constructor(gl, {
    buffer,
    wrapS = gl.CLAMP_TO_EDGE,
    wrapT = gl.CLAMP_TO_EDGE,
    anisotropy = 0,
    minFilter,
    magFilter
  } = {}) {
    super(gl, {
      generateMipmaps: false,
      wrapS,
      wrapT,
      anisotropy,
      minFilter,
      magFilter
    });
    if (buffer) return this.parseBuffer(buffer);
  }

  parseBuffer(buffer) {
    const ktx = new KhronosTextureContainer(buffer);
    ktx.mipmaps.isCompressedTexture = true; // Update texture

    this.image = ktx.mipmaps;
    this.internalFormat = ktx.glInternalFormat;

    if (ktx.numberOfMipmapLevels > 1) {
      if (this.minFilter === this.gl.LINEAR) this.minFilter = this.gl.NEAREST_MIPMAP_LINEAR;
    } else {
      if (this.minFilter === this.gl.NEAREST_MIPMAP_LINEAR) this.minFilter = this.gl.LINEAR;
    } // TODO: support cube maps
    // ktx.numberOfFaces

  }

}

exports.KTXTexture = KTXTexture;

function KhronosTextureContainer(buffer) {
  const idCheck = [0xab, 0x4b, 0x54, 0x58, 0x20, 0x31, 0x31, 0xbb, 0x0d, 0x0a, 0x1a, 0x0a];
  const id = new Uint8Array(buffer, 0, 12);

  for (let i = 0; i < id.length; i++) if (id[i] !== idCheck[i]) return console.error('File missing KTX identifier'); // TODO: Is this always 4? Tested: [android, macos]


  const size = Uint32Array.BYTES_PER_ELEMENT;
  const head = new DataView(buffer, 12, 13 * size);
  const littleEndian = head.getUint32(0, true) === 0x04030201;
  const glType = head.getUint32(1 * size, littleEndian);
  if (glType !== 0) return console.warn('only compressed formats currently supported');
  this.glInternalFormat = head.getUint32(4 * size, littleEndian);
  let width = head.getUint32(6 * size, littleEndian);
  let height = head.getUint32(7 * size, littleEndian);
  this.numberOfFaces = head.getUint32(10 * size, littleEndian);
  this.numberOfMipmapLevels = Math.max(1, head.getUint32(11 * size, littleEndian));
  const bytesOfKeyValueData = head.getUint32(12 * size, littleEndian);
  this.mipmaps = [];
  let offset = 12 + 13 * 4 + bytesOfKeyValueData;

  for (let level = 0; level < this.numberOfMipmapLevels; level++) {
    const levelSize = new Int32Array(buffer, offset, 1)[0]; // size per face, since not supporting array cubemaps

    offset += 4; // levelSize field

    for (let face = 0; face < this.numberOfFaces; face++) {
      const data = new Uint8Array(buffer, offset, levelSize);
      this.mipmaps.push({
        data,
        width,
        height
      });
      offset += levelSize;
      offset += 3 - (levelSize + 3) % 4; // add padding for odd sized image
    }

    width = width >> 1;
    height = height >> 1;
  }
}
},{"../core/Texture.js":"node_modules/ogl/src/core/Texture.js"}],"node_modules/ogl/src/extras/TextureLoader.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextureLoader = void 0;

var _Texture = require("../core/Texture.js");

var _KTXTexture = require("./KTXTexture.js");

// For compressed textures, generate using https://github.com/TimvanScherpenzeel/texture-compressor
let cache = {};
const supportedExtensions = [];

class TextureLoader {
  static load(gl, {
    src,
    // string or object of extension:src key-values
    // {
    //     pvrtc: '...ktx',
    //     s3tc: '...ktx',
    //     etc: '...ktx',
    //     etc1: '...ktx',
    //     astc: '...ktx',
    //     webp: '...webp',
    //     jpg: '...jpg',
    //     png: '...png',
    // }
    // Only props relevant to KTXTexture
    wrapS = gl.CLAMP_TO_EDGE,
    wrapT = gl.CLAMP_TO_EDGE,
    anisotropy = 0,
    // For regular images
    format = gl.RGBA,
    internalFormat = format,
    generateMipmaps = true,
    minFilter = generateMipmaps ? gl.NEAREST_MIPMAP_LINEAR : gl.LINEAR,
    magFilter = gl.LINEAR,
    premultiplyAlpha = false,
    unpackAlignment = 4,
    flipY = true
  } = {}) {
    const support = this.getSupportedExtensions(gl);
    let ext = 'none'; // If src is string, determine which format from the extension

    if (typeof src === 'string') {
      ext = src.split('.').pop().split('?')[0].toLowerCase();
    } // If src is object, use supported extensions and provided list to choose best option
    // Get first supported match, so put in order of preference


    if (typeof src === 'object') {
      for (const prop in src) {
        if (support.includes(prop.toLowerCase())) {
          ext = prop.toLowerCase();
          src = src[prop];
          break;
        }
      }
    } // Stringify props


    const cacheID = src + wrapS + wrapT + anisotropy + format + internalFormat + generateMipmaps + minFilter + magFilter + premultiplyAlpha + unpackAlignment + flipY + gl.renderer.id; // Check cache for existing texture

    if (cache[cacheID]) return cache[cacheID];
    let texture;

    switch (ext) {
      case 'ktx':
      case 'pvrtc':
      case 's3tc':
      case 'etc':
      case 'etc1':
      case 'astc':
        // Load compressed texture using KTX format
        texture = new _KTXTexture.KTXTexture(gl, {
          src,
          wrapS,
          wrapT,
          anisotropy,
          minFilter,
          magFilter
        });
        texture.loaded = this.loadKTX(src, texture);
        break;

      case 'webp':
      case 'jpg':
      case 'jpeg':
      case 'png':
        texture = new _Texture.Texture(gl, {
          wrapS,
          wrapT,
          anisotropy,
          format,
          internalFormat,
          generateMipmaps,
          minFilter,
          magFilter,
          premultiplyAlpha,
          unpackAlignment,
          flipY
        });
        texture.loaded = this.loadImage(gl, src, texture);
        break;

      default:
        console.warn('No supported format supplied');
        texture = new _Texture.Texture(gl);
    }

    texture.ext = ext;
    cache[cacheID] = texture;
    return texture;
  }

  static getSupportedExtensions(gl) {
    if (supportedExtensions.length) return supportedExtensions;
    const extensions = {
      pvrtc: gl.renderer.getExtension('WEBGL_compressed_texture_pvrtc') || gl.renderer.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc'),
      s3tc: gl.renderer.getExtension('WEBGL_compressed_texture_s3tc') || gl.renderer.getExtension('MOZ_WEBGL_compressed_texture_s3tc') || gl.renderer.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc'),
      etc: gl.renderer.getExtension('WEBGL_compressed_texture_etc'),
      etc1: gl.renderer.getExtension('WEBGL_compressed_texture_etc1'),
      astc: gl.renderer.getExtension('WEBGL_compressed_texture_astc')
    };

    for (const ext in extensions) if (extensions[ext]) supportedExtensions.push(ext); // Check for WebP support


    if (detectWebP) supportedExtensions.push('webp'); // Formats supported by all

    supportedExtensions.push('png', 'jpg');
    return supportedExtensions;
  }

  static loadKTX(src, texture) {
    return fetch(src).then(res => res.arrayBuffer()).then(buffer => texture.parseBuffer(buffer));
  }

  static loadImage(gl, src, texture) {
    return decodeImage(src).then(imgBmp => {
      // Catch non POT textures and update params to avoid errors
      if (!powerOfTwo(imgBmp.width) || !powerOfTwo(imgBmp.height)) {
        if (texture.generateMipmaps) texture.generateMipmaps = false;
        if (texture.minFilter === gl.NEAREST_MIPMAP_LINEAR) texture.minFilter = gl.LINEAR;
        if (texture.wrapS === gl.REPEAT) texture.wrapS = texture.wrapT = gl.CLAMP_TO_EDGE;
      }

      texture.image = imgBmp; // For createImageBitmap, close once uploaded

      texture.onUpdate = () => {
        if (imgBmp.close) imgBmp.close();
        texture.onUpdate = null;
      };

      return imgBmp;
    });
  }

  static clearCache() {
    cache = {};
  }

}

exports.TextureLoader = TextureLoader;

function detectWebP() {
  return document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0;
}

function powerOfTwo(value) {
  return Math.log2(value) % 1 === 0;
}

function decodeImage(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = '';
    img.src = src; // Only chrome's implementation of createImageBitmap is fully supported

    const isChrome = navigator.userAgent.toLowerCase().includes('chrome');

    if (!!window.createImageBitmap && isChrome) {
      img.onload = () => {
        createImageBitmap(img, {
          imageOrientation: 'flipY',
          premultiplyAlpha: 'none'
        }).then(imgBmp => {
          resolve(imgBmp);
        });
      };
    } else {
      img.onload = () => resolve(img);
    }
  });
}
},{"../core/Texture.js":"node_modules/ogl/src/core/Texture.js","./KTXTexture.js":"node_modules/ogl/src/extras/KTXTexture.js"}],"node_modules/ogl/src/extras/GLTFAnimation.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GLTFAnimation = void 0;

var _Vec = require("../math/Vec3.js");

var _Quat = require("../math/Quat.js");

const tmpVec3A = new _Vec.Vec3();
const tmpVec3B = new _Vec.Vec3();
const tmpVec3C = new _Vec.Vec3();
const tmpVec3D = new _Vec.Vec3();
const tmpQuatA = new _Quat.Quat();
const tmpQuatB = new _Quat.Quat();
const tmpQuatC = new _Quat.Quat();
const tmpQuatD = new _Quat.Quat();

class GLTFAnimation {
  constructor(data, weight = 1) {
    this.data = data;
    this.elapsed = 0;
    this.weight = weight; // Set to false to not apply modulo to elapsed against duration

    this.loop = true; // Find starting time as exports from blender (perhaps others too) don't always start from 0

    this.startTime = data.reduce((a, {
      times
    }) => Math.min(a, times[0]), Infinity); // Get largest final time in all channels to calculate duration

    this.endTime = data.reduce((a, {
      times
    }) => Math.max(a, times[times.length - 1]), 0);
    this.duration = this.endTime - this.startTime;
  }

  update(totalWeight = 1, isSet) {
    const weight = isSet ? 1 : this.weight / totalWeight;
    const elapsed = (this.loop ? this.elapsed % this.duration : Math.min(this.elapsed, this.duration - 0.001)) + this.startTime;
    this.data.forEach(({
      node,
      transform,
      interpolation,
      times,
      values
    }) => {
      // Get index of two time values elapsed is between
      const prevIndex = Math.max(1, times.findIndex(t => t > elapsed)) - 1;
      const nextIndex = prevIndex + 1; // Get linear blend/alpha between the two

      let alpha = (elapsed - times[prevIndex]) / (times[nextIndex] - times[prevIndex]);
      if (interpolation === 'STEP') alpha = 0;
      let prevVal = tmpVec3A;
      let prevTan = tmpVec3B;
      let nextTan = tmpVec3C;
      let nextVal = tmpVec3D;
      let size = 3;

      if (transform === 'quaternion') {
        prevVal = tmpQuatA;
        prevTan = tmpQuatB;
        nextTan = tmpQuatC;
        nextVal = tmpQuatD;
        size = 4;
      }

      if (interpolation === 'CUBICSPLINE') {
        // Get the prev and next values from the indices
        prevVal.fromArray(values, prevIndex * size * 3 + size * 1);
        prevTan.fromArray(values, prevIndex * size * 3 + size * 2);
        nextTan.fromArray(values, nextIndex * size * 3 + size * 0);
        nextVal.fromArray(values, nextIndex * size * 3 + size * 1); // interpolate for final value

        prevVal = this.cubicSplineInterpolate(alpha, prevVal, prevTan, nextTan, nextVal);
        if (size === 4) prevVal.normalize();
      } else {
        // Get the prev and next values from the indices
        prevVal.fromArray(values, prevIndex * size);
        nextVal.fromArray(values, nextIndex * size); // interpolate for final value

        if (size === 4) prevVal.slerp(nextVal, alpha);else prevVal.lerp(nextVal, alpha);
      } // interpolate between multiple possible animations


      if (size === 4) node[transform].slerp(prevVal, weight);else node[transform].lerp(prevVal, weight);
    });
  }

  cubicSplineInterpolate(t, prevVal, prevTan, nextTan, nextVal) {
    const t2 = t * t;
    const t3 = t2 * t;
    const s2 = 3 * t2 - 2 * t3;
    const s3 = t3 - t2;
    const s0 = 1 - s2;
    const s1 = s3 - t2 + t;

    for (let i = 0; i < prevVal.length; i++) {
      prevVal[i] = s0 * prevVal[i] + s1 * (1 - t) * prevTan[i] + s2 * nextVal[i] + s3 * t * nextTan[i];
    }

    return prevVal;
  }

}

exports.GLTFAnimation = GLTFAnimation;
},{"../math/Vec3.js":"node_modules/ogl/src/math/Vec3.js","../math/Quat.js":"node_modules/ogl/src/math/Quat.js"}],"node_modules/ogl/src/extras/GLTFSkin.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GLTFSkin = void 0;

var _Mesh = require("../core/Mesh.js");

var _Mat = require("../math/Mat4.js");

var _Texture = require("../core/Texture.js");

const tempMat4 = new _Mat.Mat4();
const identity = new _Mat.Mat4();

class GLTFSkin extends _Mesh.Mesh {
  constructor(gl, {
    skeleton,
    geometry,
    program,
    mode = gl.TRIANGLES
  } = {}) {
    super(gl, {
      geometry,
      program,
      mode
    });
    this.skeleton = skeleton;
    this.program = program;
    this.createBoneTexture();
    this.animations = [];
  }

  createBoneTexture() {
    if (!this.skeleton.joints.length) return;
    const size = Math.max(4, Math.pow(2, Math.ceil(Math.log(Math.sqrt(this.skeleton.joints.length * 4)) / Math.LN2)));
    this.boneMatrices = new Float32Array(size * size * 4);
    this.boneTextureSize = size;
    this.boneTexture = new _Texture.Texture(this.gl, {
      image: this.boneMatrices,
      generateMipmaps: false,
      type: this.gl.FLOAT,
      internalFormat: this.gl.renderer.isWebgl2 ? this.gl.RGBA32F : this.gl.RGBA,
      minFilter: this.gl.NEAREST,
      magFilter: this.gl.NEAREST,
      flipY: false,
      width: size
    });
  } // addAnimation(data) {
  //     const animation = new Animation({ objects: this.bones, data });
  //     this.animations.push(animation);
  //     return animation;
  // }
  // updateAnimations() {
  //     // Calculate combined animation weight
  //     let total = 0;
  //     this.animations.forEach((animation) => (total += animation.weight));
  //     this.animations.forEach((animation, i) => {
  //         // force first animation to set in order to reset frame
  //         animation.update(total, i === 0);
  //     });
  // }


  updateUniforms() {
    // Update bone texture
    this.skeleton.joints.forEach((bone, i) => {
      // Find difference between current and bind pose
      tempMat4.multiply(bone.worldMatrix, bone.bindInverse);
      this.boneMatrices.set(tempMat4, i * 16);
    });
    if (this.boneTexture) this.boneTexture.needsUpdate = true;
  }

  draw({
    camera
  } = {}) {
    if (!this.program.uniforms.boneTexture) {
      Object.assign(this.program.uniforms, {
        boneTexture: {
          value: this.boneTexture
        },
        boneTextureSize: {
          value: this.boneTextureSize
        }
      });
    }

    this.updateUniforms(); // Switch the world matrix with identity to ignore any transforms
    // on the mesh itself - only use skeleton's transforms

    const _worldMatrix = this.worldMatrix;
    this.worldMatrix = identity;
    super.draw({
      camera
    }); // Switch back to leave identity untouched

    this.worldMatrix = _worldMatrix;
  }

}

exports.GLTFSkin = GLTFSkin;
},{"../core/Mesh.js":"node_modules/ogl/src/core/Mesh.js","../math/Mat4.js":"node_modules/ogl/src/math/Mat4.js","../core/Texture.js":"node_modules/ogl/src/core/Texture.js"}],"node_modules/ogl/src/extras/GLTFLoader.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GLTFLoader = void 0;

var _Geometry = require("../core/Geometry.js");

var _Transform = require("../core/Transform.js");

var _Texture = require("../core/Texture.js");

var _Mesh = require("../core/Mesh.js");

var _GLTFAnimation = require("./GLTFAnimation.js");

var _GLTFSkin = require("./GLTFSkin.js");

var _Mat = require("../math/Mat4.js");

var _NormalProgram = require("./NormalProgram.js");

// Supports
// [x] Geometry
// [ ] Sparse support
// [x] Nodes and Hierarchy
// [x] Instancing
// [ ] Morph Targets
// [x] Skins
// [ ] Materials
// [x] Textures
// [x] Animation
// [ ] Cameras
// [ ] Extensions
// [x] GLB support
// TODO: Sparse accessor packing? For morph targets basically
// TODO: init accessor missing bufferView with 0s
// TODO: morph target animations
// TODO: what to do if multiple instances are in different groups? Only uses local matrices
// TODO: what if instancing isn't wanted? Eg collision maps
// TODO: ie11 fallback for TextDecoder?
const TYPE_ARRAY = {
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array,
  'image/jpeg': Uint8Array,
  'image/png': Uint8Array
};
const TYPE_SIZE = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
};
const ATTRIBUTES = {
  POSITION: 'position',
  NORMAL: 'normal',
  TANGENT: 'tangent',
  TEXCOORD_0: 'uv',
  TEXCOORD_1: 'uv2',
  COLOR_0: 'color',
  WEIGHTS_0: 'skinWeight',
  JOINTS_0: 'skinIndex'
};
const TRANSFORMS = {
  translation: 'position',
  rotation: 'quaternion',
  scale: 'scale'
};

class GLTFLoader {
  static async load(gl, src) {
    const dir = src.split('/').slice(0, -1).join('/') + '/'; // load main description json

    const desc = await this.parseDesc(src);
    return await this.parse(gl, desc, dir);
  }

  static async parse(gl, desc, dir) {
    if (desc.asset === undefined || desc.asset.version[0] < 2) console.warn('Only GLTF >=2.0 supported. Attempting to parse.'); // Load buffers async

    const buffers = await this.loadBuffers(desc, dir); // Unbind current VAO so that new buffers don't get added to active mesh

    gl.renderer.bindVertexArray(null); // Create gl buffers from bufferViews

    const bufferViews = this.parseBufferViews(gl, desc, buffers); // Create images from either bufferViews or separate image files

    const images = this.parseImages(gl, desc, dir, bufferViews);
    const textures = this.parseTextures(gl, desc, images); // Just pass through material data for now

    const materials = this.parseMaterials(gl, desc, textures); // Fetch the inverse bind matrices for skeleton joints

    const skins = this.parseSkins(gl, desc, bufferViews); // Create geometries for each mesh primitive

    const meshes = this.parseMeshes(gl, desc, bufferViews, materials, skins); // Create transforms, meshes and hierarchy

    const nodes = this.parseNodes(gl, desc, meshes, skins); // Place nodes in skeletons

    this.populateSkins(skins, nodes); // Create animation handlers

    const animations = this.parseAnimations(gl, desc, nodes, bufferViews); // Get top level nodes for each scene

    const scenes = this.parseScenes(desc, nodes);
    const scene = scenes[desc.scene]; // Remove null nodes (instanced transforms)

    for (let i = nodes.length; i >= 0; i--) if (!nodes[i]) nodes.splice(i, 1);

    return {
      json: desc,
      buffers,
      bufferViews,
      images,
      textures,
      materials,
      meshes,
      nodes,
      animations,
      scenes,
      scene
    };
  }

  static async parseDesc(src) {
    if (!src.match(/\.glb$/)) {
      return await fetch(src).then(res => res.json());
    } else {
      return await fetch(src).then(res => res.arrayBuffer()).then(glb => this.unpackGLB(glb));
    }
  } // From https://github.com/donmccurdy/glTF-Transform/blob/e4108cc/packages/core/src/io/io.ts#L32


  static unpackGLB(glb) {
    // Decode and verify GLB header.
    const header = new Uint32Array(glb, 0, 3);

    if (header[0] !== 0x46546c67) {
      throw new Error('Invalid glTF asset.');
    } else if (header[1] !== 2) {
      throw new Error(`Unsupported glTF binary version, "${header[1]}".`);
    } // Decode and verify chunk headers.


    const jsonChunkHeader = new Uint32Array(glb, 12, 2);
    const jsonByteOffset = 20;
    const jsonByteLength = jsonChunkHeader[0];

    if (jsonChunkHeader[1] !== 0x4e4f534a) {
      throw new Error('Unexpected GLB layout.');
    } // Decode JSON.


    const jsonText = new TextDecoder().decode(glb.slice(jsonByteOffset, jsonByteOffset + jsonByteLength));
    const json = JSON.parse(jsonText); // JSON only

    if (jsonByteOffset + jsonByteLength === glb.byteLength) return json;
    const binaryChunkHeader = new Uint32Array(glb, jsonByteOffset + jsonByteLength, 2);

    if (binaryChunkHeader[1] !== 0x004e4942) {
      throw new Error('Unexpected GLB layout.');
    } // Decode content.


    const binaryByteOffset = jsonByteOffset + jsonByteLength + 8;
    const binaryByteLength = binaryChunkHeader[0];
    const binary = glb.slice(binaryByteOffset, binaryByteOffset + binaryByteLength); // Attach binary to buffer

    json.buffers[0].binary = binary;
    return json;
  } // Threejs GLTF Loader https://github.com/mrdoob/three.js/blob/master/examples/js/loaders/GLTFLoader.js#L1085


  static resolveURI(uri, dir) {
    // Invalid URI
    if (typeof uri !== 'string' || uri === '') return ''; // Host Relative URI

    if (/^https?:\/\//i.test(dir) && /^\//.test(uri)) {
      dir = dir.replace(/(^https?:\/\/[^\/]+).*/i, '$1');
    } // Absolute URI http://, https://, //


    if (/^(https?:)?\/\//i.test(uri)) return uri; // Data URI

    if (/^data:.*,.*$/i.test(uri)) return uri; // Blob URI

    if (/^blob:.*$/i.test(uri)) return uri; // Relative URI

    return dir + uri;
  }

  static async loadBuffers(desc, dir) {
    if (!desc.buffers) return null;
    return await Promise.all(desc.buffers.map(buffer => {
      // For GLB, binary buffer ready to go
      if (buffer.binary) return buffer.binary;
      const uri = this.resolveURI(buffer.uri, dir);
      return fetch(uri).then(res => res.arrayBuffer());
    }));
  }

  static parseBufferViews(gl, desc, buffers) {
    if (!desc.bufferViews) return null; // Clone to leave description pure

    const bufferViews = desc.bufferViews.map(o => Object.assign({}, o));
    desc.meshes && desc.meshes.forEach(({
      primitives
    }) => {
      primitives.forEach(({
        attributes,
        indices
      }) => {
        // Flag bufferView as an attribute, so it knows to create a gl buffer
        for (let attr in attributes) bufferViews[desc.accessors[attributes[attr]].bufferView].isAttribute = true;

        if (indices === undefined) return;
        bufferViews[desc.accessors[indices].bufferView].isAttribute = true; // Make sure indices bufferView have a target property for gl buffer binding

        bufferViews[desc.accessors[indices].bufferView].target = gl.ELEMENT_ARRAY_BUFFER;
      });
    }); // Get componentType of each bufferView from the accessors

    desc.accessors.forEach(({
      bufferView: i,
      componentType
    }) => {
      bufferViews[i].componentType = componentType;
    }); // Get mimetype of bufferView from images

    desc.images && desc.images.forEach(({
      uri,
      bufferView: i,
      mimeType
    }) => {
      if (i === undefined) return;
      bufferViews[i].mimeType = mimeType;
    }); // Push each bufferView to the GPU as a separate buffer

    bufferViews.forEach(({
      buffer: bufferIndex,
      // required
      byteOffset = 0,
      // optional
      byteLength,
      // required
      byteStride,
      // optional
      target = gl.ARRAY_BUFFER,
      // optional, added above for elements
      name,
      // optional
      extensions,
      // optional
      extras,
      // optional
      componentType,
      // optional, added from accessor above
      mimeType,
      // optional, added from images above
      isAttribute
    }, i) => {
      const TypeArray = TYPE_ARRAY[componentType || mimeType];
      const elementBytes = TypeArray.BYTES_PER_ELEMENT;
      const data = new TypeArray(buffers[bufferIndex], byteOffset, byteLength / elementBytes);
      bufferViews[i].data = data;
      bufferViews[i].originalBuffer = buffers[bufferIndex];
      if (!isAttribute) return; // Create gl buffers for the bufferView, pushing it to the GPU

      const buffer = gl.createBuffer();
      gl.bindBuffer(target, buffer);
      gl.renderer.state.boundBuffer = buffer;
      gl.bufferData(target, data, gl.STATIC_DRAW);
      bufferViews[i].buffer = buffer;
    });
    return bufferViews;
  }

  static parseImages(gl, desc, dir, bufferViews) {
    if (!desc.images) return null;
    return desc.images.map(({
      uri,
      bufferView: bufferViewIndex,
      mimeType,
      name
    }) => {
      const image = new Image();
      image.name = name;

      if (uri) {
        image.src = this.resolveURI(uri, dir);
      } else if (bufferViewIndex !== undefined) {
        const {
          data
        } = bufferViews[bufferViewIndex];
        const blob = new Blob([data], {
          type: mimeType
        });
        image.src = URL.createObjectURL(blob);
      }

      image.ready = new Promise(res => {
        image.onload = () => res();
      });
      return image;
    });
  }

  static parseTextures(gl, desc, images) {
    if (!desc.textures) return null;
    return desc.textures.map(({
      sampler: samplerIndex,
      source: sourceIndex,
      name,
      extensions,
      extras
    }) => {
      const options = {
        flipY: false,
        wrapS: gl.REPEAT,
        // Repeat by default, opposed to OGL's clamp by default
        wrapT: gl.REPEAT
      };
      const sampler = samplerIndex !== undefined ? desc.samplers[samplerIndex] : null;

      if (sampler) {
        ['magFilter', 'minFilter', 'wrapS', 'wrapT'].forEach(prop => {
          if (sampler[prop]) options[prop] = sampler[prop];
        });
      }

      const texture = new _Texture.Texture(gl, options);
      texture.name = name;
      const image = images[sourceIndex];
      image.ready.then(() => texture.image = image);
      return texture;
    });
  }

  static parseMaterials(gl, desc, textures) {
    if (!desc.materials) return null;
    return desc.materials.map(({
      name,
      extensions,
      extras,
      pbrMetallicRoughness = {},
      normalTexture,
      occlusionTexture,
      emissiveTexture,
      emissiveFactor = [0, 0, 0],
      alphaMode = 'OPAQUE',
      alphaCutoff = 0.5,
      doubleSided = false
    }) => {
      const {
        baseColorFactor = [1, 1, 1, 1],
        baseColorTexture,
        metallicFactor = 1,
        roughnessFactor = 1,
        metallicRoughnessTexture //   extensions,
        //   extras,

      } = pbrMetallicRoughness;

      if (baseColorTexture) {
        baseColorTexture.texture = textures[baseColorTexture.index]; // texCoord
      }

      if (normalTexture) {
        normalTexture.texture = textures[normalTexture.index]; // scale: 1
        // texCoord
      }

      if (metallicRoughnessTexture) {
        metallicRoughnessTexture.texture = textures[metallicRoughnessTexture.index]; // texCoord
      }

      if (occlusionTexture) {
        occlusionTexture.texture = textures[occlusionTexture.index]; // strength 1
        // texCoord
      }

      if (emissiveTexture) {
        emissiveTexture.texture = textures[emissiveTexture.index]; // texCoord
      }

      return {
        name,
        baseColorFactor,
        baseColorTexture,
        metallicFactor,
        roughnessFactor,
        metallicRoughnessTexture,
        normalTexture,
        occlusionTexture,
        emissiveTexture,
        emissiveFactor,
        alphaMode,
        alphaCutoff,
        doubleSided
      };
    });
  }

  static parseSkins(gl, desc, bufferViews) {
    if (!desc.skins) return null;
    return desc.skins.map(({
      inverseBindMatrices,
      // optional
      skeleton,
      // optional
      joints // required
      // name,
      // extensions,
      // extras,

    }) => {
      return {
        inverseBindMatrices: this.parseAccessor(inverseBindMatrices, desc, bufferViews),
        skeleton,
        joints
      };
    });
  }

  static parseMeshes(gl, desc, bufferViews, materials, skins) {
    if (!desc.meshes) return null;
    return desc.meshes.map(({
      primitives,
      // required
      weights,
      // optional
      name,
      // optional
      extensions,
      // optional
      extras // optional

    }, meshIndex) => {
      // TODO: weights stuff ?
      // Parse through nodes to see how many instances there are
      // and if there is a skin attached
      let numInstances = 0;
      let skinIndex = false;
      desc.nodes && desc.nodes.forEach(({
        mesh,
        skin
      }) => {
        if (mesh === meshIndex) {
          numInstances++;
          if (skin !== undefined) skinIndex = skin;
        }
      });
      primitives = this.parsePrimitives(gl, primitives, desc, bufferViews, materials, numInstances).map(({
        geometry,
        program,
        mode
      }) => {
        // Create either skinned mesh or regular mesh
        const mesh = typeof skinIndex === 'number' ? new _GLTFSkin.GLTFSkin(gl, {
          skeleton: skins[skinIndex],
          geometry,
          program,
          mode
        }) : new _Mesh.Mesh(gl, {
          geometry,
          program,
          mode
        });
        mesh.name = name;

        if (mesh.geometry.isInstanced) {
          // Tag mesh so that nodes can add their transforms to the instance attribute
          mesh.numInstances = numInstances; // Avoid incorrect culling for instances

          mesh.frustumCulled = false;
        }

        return mesh;
      });
      return {
        primitives,
        weights,
        name
      };
    });
  }

  static parsePrimitives(gl, primitives, desc, bufferViews, materials, numInstances) {
    return primitives.map(({
      attributes,
      // required
      indices,
      // optional
      material: materialIndex,
      // optional
      mode = 4,
      // optional
      targets,
      // optional
      extensions,
      // optional
      extras // optional

    }) => {
      const geometry = new _Geometry.Geometry(gl); // Add each attribute found in primitive

      for (let attr in attributes) {
        geometry.addAttribute(ATTRIBUTES[attr], this.parseAccessor(attributes[attr], desc, bufferViews));
      } // Add index attribute if found


      if (indices !== undefined) {
        geometry.addAttribute('index', this.parseAccessor(indices, desc, bufferViews));
      } // Add instanced transform attribute if multiple instances


      if (numInstances > 1) {
        geometry.addAttribute('instanceMatrix', {
          instanced: 1,
          size: 16,
          data: new Float32Array(numInstances * 16)
        });
      } // TODO: materials


      const program = new _NormalProgram.NormalProgram(gl);

      if (materialIndex !== undefined) {
        program.gltfMaterial = materials[materialIndex];
      }

      return {
        geometry,
        program,
        mode
      };
    });
  }

  static parseAccessor(index, desc, bufferViews) {
    // TODO: init missing bufferView with 0s
    // TODO: support sparse
    const {
      bufferView: bufferViewIndex,
      // optional
      byteOffset = 0,
      // optional
      componentType,
      // required
      normalized = false,
      // optional
      count,
      // required
      type,
      // required
      min,
      // optional
      max,
      // optional
      sparse // optional
      // name, // optional
      // extensions, // optional
      // extras, // optional

    } = desc.accessors[index];
    const {
      data,
      // attached in parseBufferViews
      originalBuffer,
      // attached in parseBufferViews
      buffer,
      // replaced to be the actual GL buffer
      byteOffset: bufferByteOffset = 0,
      // byteLength, // applied in parseBufferViews
      byteStride = 0,
      target // name,
      // extensions,
      // extras,

    } = bufferViews[bufferViewIndex];
    const size = TYPE_SIZE[type]; // Parse data from joined buffers

    const TypeArray = TYPE_ARRAY[componentType];
    const elementBytes = data.BYTES_PER_ELEMENT;
    const componentOffset = byteOffset / elementBytes;
    const componentStride = byteStride / elementBytes;
    const isInterleaved = !!byteStride && componentStride !== size; // TODO: interleaved

    const newData = isInterleaved ? data : new TypeArray(originalBuffer, byteOffset + bufferByteOffset, count * size); // Return attribute data

    return {
      data: newData,
      size,
      type: componentType,
      normalized,
      buffer,
      stride: byteStride,
      offset: byteOffset,
      count,
      min,
      max
    };
  }

  static parseNodes(gl, desc, meshes, skins) {
    if (!desc.nodes) return null;
    const nodes = desc.nodes.map(({
      camera,
      // optional
      children,
      // optional
      skin: skinIndex,
      // optional
      matrix,
      // optional
      mesh: meshIndex,
      // optional
      rotation,
      // optional
      scale,
      // optional
      translation,
      // optional
      weights,
      // optional
      name,
      // optional
      extensions,
      // optional
      extras // optional

    }) => {
      const node = new _Transform.Transform();
      if (name) node.name = name; // Apply transformations

      if (matrix) {
        node.matrix.copy(matrix);
        node.decompose();
      } else {
        if (rotation) node.quaternion.copy(rotation);
        if (scale) node.scale.copy(scale);
        if (translation) node.position.copy(translation);
        node.updateMatrix();
      } // Flags for avoiding duplicate transforms and removing unused instance nodes


      let isInstanced = false;
      let isFirstInstance = true; // add mesh if included

      if (meshIndex !== undefined) {
        meshes[meshIndex].primitives.forEach(mesh => {
          if (mesh.geometry.isInstanced) {
            isInstanced = true;

            if (!mesh.instanceCount) {
              mesh.instanceCount = 0;
            } else {
              isFirstInstance = false;
            }

            node.matrix.toArray(mesh.geometry.attributes.instanceMatrix.data, mesh.instanceCount * 16);
            mesh.instanceCount++;

            if (mesh.instanceCount === mesh.numInstances) {
              // Remove properties once all instances added
              delete mesh.numInstances;
              delete mesh.instanceCount; // Flag attribute as dirty

              mesh.geometry.attributes.instanceMatrix.needsUpdate = true;
            }
          } // For instances, only the first node will actually have the mesh


          if (isInstanced) {
            if (isFirstInstance) mesh.setParent(node);
          } else {
            mesh.setParent(node);
          }
        });
      } // Reset node if instanced to not duplicate transforms


      if (isInstanced) {
        // Remove unused nodes just providing an instance transform
        if (!isFirstInstance) return null; // Avoid duplicate transform for node containing the instanced mesh

        node.matrix.identity();
        node.decompose();
      }

      return node;
    });
    desc.nodes.forEach(({
      children = []
    }, i) => {
      // Set hierarchy now all nodes created
      children.forEach(childIndex => {
        if (!nodes[childIndex]) return;
        nodes[childIndex].setParent(nodes[i]);
      });
    });
    return nodes;
  }

  static populateSkins(skins, nodes) {
    if (!skins) return;
    skins.forEach(skin => {
      skin.joints = skin.joints.map((i, index) => {
        const joint = nodes[i];
        joint.bindInverse = new _Mat.Mat4(...skin.inverseBindMatrices.data.slice(index * 16, (index + 1) * 16));
        return joint;
      });
      if (skin.skeleton) skin.skeleton = nodes[skin.skeleton];
    });
  }

  static parseAnimations(gl, desc, nodes, bufferViews) {
    if (!desc.animations) return null;
    return desc.animations.map(({
      channels,
      // required
      samplers,
      // required
      name // optional
      // extensions, // optional
      // extras,  // optional

    }) => {
      const data = channels.map(({
        sampler: samplerIndex,
        // required
        target // required
        // extensions, // optional
        // extras, // optional

      }) => {
        const {
          input: inputIndex,
          // required
          interpolation = 'LINEAR',
          output: outputIndex // required
          // extensions, // optional
          // extras, // optional

        } = samplers[samplerIndex];
        const {
          node: nodeIndex,
          // optional - TODO: when is it not included?
          path // required
          // extensions, // optional
          // extras, // optional

        } = target;
        const node = nodes[nodeIndex];
        const transform = TRANSFORMS[path];
        const times = this.parseAccessor(inputIndex, desc, bufferViews).data;
        const values = this.parseAccessor(outputIndex, desc, bufferViews).data;
        return {
          node,
          transform,
          interpolation,
          times,
          values
        };
      });
      return {
        name,
        animation: new _GLTFAnimation.GLTFAnimation(data)
      };
    });
  }

  static parseScenes(desc, nodes) {
    if (!desc.scenes) return null;
    return desc.scenes.map(({
      nodes: nodesIndices = [],
      name,
      // optional
      extensions,
      extras
    }) => {
      return nodesIndices.reduce((map, i) => {
        // Don't add null nodes (instanced transforms)
        if (nodes[i]) map.push(nodes[i]);
        return map;
      }, []);
    });
  }

}

exports.GLTFLoader = GLTFLoader;
},{"../core/Geometry.js":"node_modules/ogl/src/core/Geometry.js","../core/Transform.js":"node_modules/ogl/src/core/Transform.js","../core/Texture.js":"node_modules/ogl/src/core/Texture.js","../core/Mesh.js":"node_modules/ogl/src/core/Mesh.js","./GLTFAnimation.js":"node_modules/ogl/src/extras/GLTFAnimation.js","./GLTFSkin.js":"node_modules/ogl/src/extras/GLTFSkin.js","../math/Mat4.js":"node_modules/ogl/src/math/Mat4.js","./NormalProgram.js":"node_modules/ogl/src/extras/NormalProgram.js"}],"node_modules/ogl/src/index.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Geometry", {
  enumerable: true,
  get: function () {
    return _Geometry.Geometry;
  }
});
Object.defineProperty(exports, "Program", {
  enumerable: true,
  get: function () {
    return _Program.Program;
  }
});
Object.defineProperty(exports, "Renderer", {
  enumerable: true,
  get: function () {
    return _Renderer.Renderer;
  }
});
Object.defineProperty(exports, "Camera", {
  enumerable: true,
  get: function () {
    return _Camera.Camera;
  }
});
Object.defineProperty(exports, "Transform", {
  enumerable: true,
  get: function () {
    return _Transform.Transform;
  }
});
Object.defineProperty(exports, "Mesh", {
  enumerable: true,
  get: function () {
    return _Mesh.Mesh;
  }
});
Object.defineProperty(exports, "Texture", {
  enumerable: true,
  get: function () {
    return _Texture.Texture;
  }
});
Object.defineProperty(exports, "RenderTarget", {
  enumerable: true,
  get: function () {
    return _RenderTarget.RenderTarget;
  }
});
Object.defineProperty(exports, "Color", {
  enumerable: true,
  get: function () {
    return _Color.Color;
  }
});
Object.defineProperty(exports, "Euler", {
  enumerable: true,
  get: function () {
    return _Euler.Euler;
  }
});
Object.defineProperty(exports, "Mat3", {
  enumerable: true,
  get: function () {
    return _Mat.Mat3;
  }
});
Object.defineProperty(exports, "Mat4", {
  enumerable: true,
  get: function () {
    return _Mat2.Mat4;
  }
});
Object.defineProperty(exports, "Quat", {
  enumerable: true,
  get: function () {
    return _Quat.Quat;
  }
});
Object.defineProperty(exports, "Vec2", {
  enumerable: true,
  get: function () {
    return _Vec.Vec2;
  }
});
Object.defineProperty(exports, "Vec3", {
  enumerable: true,
  get: function () {
    return _Vec2.Vec3;
  }
});
Object.defineProperty(exports, "Vec4", {
  enumerable: true,
  get: function () {
    return _Vec3.Vec4;
  }
});
Object.defineProperty(exports, "Plane", {
  enumerable: true,
  get: function () {
    return _Plane.Plane;
  }
});
Object.defineProperty(exports, "Box", {
  enumerable: true,
  get: function () {
    return _Box.Box;
  }
});
Object.defineProperty(exports, "Sphere", {
  enumerable: true,
  get: function () {
    return _Sphere.Sphere;
  }
});
Object.defineProperty(exports, "Cylinder", {
  enumerable: true,
  get: function () {
    return _Cylinder.Cylinder;
  }
});
Object.defineProperty(exports, "Triangle", {
  enumerable: true,
  get: function () {
    return _Triangle.Triangle;
  }
});
Object.defineProperty(exports, "Torus", {
  enumerable: true,
  get: function () {
    return _Torus.Torus;
  }
});
Object.defineProperty(exports, "Orbit", {
  enumerable: true,
  get: function () {
    return _Orbit.Orbit;
  }
});
Object.defineProperty(exports, "Raycast", {
  enumerable: true,
  get: function () {
    return _Raycast.Raycast;
  }
});
Object.defineProperty(exports, "Curve", {
  enumerable: true,
  get: function () {
    return _Curve.Curve;
  }
});
Object.defineProperty(exports, "Post", {
  enumerable: true,
  get: function () {
    return _Post.Post;
  }
});
Object.defineProperty(exports, "Skin", {
  enumerable: true,
  get: function () {
    return _Skin.Skin;
  }
});
Object.defineProperty(exports, "Animation", {
  enumerable: true,
  get: function () {
    return _Animation.Animation;
  }
});
Object.defineProperty(exports, "Text", {
  enumerable: true,
  get: function () {
    return _Text.Text;
  }
});
Object.defineProperty(exports, "NormalProgram", {
  enumerable: true,
  get: function () {
    return _NormalProgram.NormalProgram;
  }
});
Object.defineProperty(exports, "Flowmap", {
  enumerable: true,
  get: function () {
    return _Flowmap.Flowmap;
  }
});
Object.defineProperty(exports, "GPGPU", {
  enumerable: true,
  get: function () {
    return _GPGPU.GPGPU;
  }
});
Object.defineProperty(exports, "Polyline", {
  enumerable: true,
  get: function () {
    return _Polyline.Polyline;
  }
});
Object.defineProperty(exports, "Shadow", {
  enumerable: true,
  get: function () {
    return _Shadow.Shadow;
  }
});
Object.defineProperty(exports, "KTXTexture", {
  enumerable: true,
  get: function () {
    return _KTXTexture.KTXTexture;
  }
});
Object.defineProperty(exports, "TextureLoader", {
  enumerable: true,
  get: function () {
    return _TextureLoader.TextureLoader;
  }
});
Object.defineProperty(exports, "GLTFLoader", {
  enumerable: true,
  get: function () {
    return _GLTFLoader.GLTFLoader;
  }
});
Object.defineProperty(exports, "GLTFSkin", {
  enumerable: true,
  get: function () {
    return _GLTFSkin.GLTFSkin;
  }
});

var _Geometry = require("./core/Geometry.js");

var _Program = require("./core/Program.js");

var _Renderer = require("./core/Renderer.js");

var _Camera = require("./core/Camera.js");

var _Transform = require("./core/Transform.js");

var _Mesh = require("./core/Mesh.js");

var _Texture = require("./core/Texture.js");

var _RenderTarget = require("./core/RenderTarget.js");

var _Color = require("./math/Color.js");

var _Euler = require("./math/Euler.js");

var _Mat = require("./math/Mat3.js");

var _Mat2 = require("./math/Mat4.js");

var _Quat = require("./math/Quat.js");

var _Vec = require("./math/Vec2.js");

var _Vec2 = require("./math/Vec3.js");

var _Vec3 = require("./math/Vec4.js");

var _Plane = require("./extras/Plane.js");

var _Box = require("./extras/Box.js");

var _Sphere = require("./extras/Sphere.js");

var _Cylinder = require("./extras/Cylinder.js");

var _Triangle = require("./extras/Triangle.js");

var _Torus = require("./extras/Torus.js");

var _Orbit = require("./extras/Orbit.js");

var _Raycast = require("./extras/Raycast.js");

var _Curve = require("./extras/Curve.js");

var _Post = require("./extras/Post.js");

var _Skin = require("./extras/Skin.js");

var _Animation = require("./extras/Animation.js");

var _Text = require("./extras/Text.js");

var _NormalProgram = require("./extras/NormalProgram.js");

var _Flowmap = require("./extras/Flowmap.js");

var _GPGPU = require("./extras/GPGPU.js");

var _Polyline = require("./extras/Polyline.js");

var _Shadow = require("./extras/Shadow.js");

var _KTXTexture = require("./extras/KTXTexture.js");

var _TextureLoader = require("./extras/TextureLoader.js");

var _GLTFLoader = require("./extras/GLTFLoader.js");

var _GLTFSkin = require("./extras/GLTFSkin.js");
},{"./core/Geometry.js":"node_modules/ogl/src/core/Geometry.js","./core/Program.js":"node_modules/ogl/src/core/Program.js","./core/Renderer.js":"node_modules/ogl/src/core/Renderer.js","./core/Camera.js":"node_modules/ogl/src/core/Camera.js","./core/Transform.js":"node_modules/ogl/src/core/Transform.js","./core/Mesh.js":"node_modules/ogl/src/core/Mesh.js","./core/Texture.js":"node_modules/ogl/src/core/Texture.js","./core/RenderTarget.js":"node_modules/ogl/src/core/RenderTarget.js","./math/Color.js":"node_modules/ogl/src/math/Color.js","./math/Euler.js":"node_modules/ogl/src/math/Euler.js","./math/Mat3.js":"node_modules/ogl/src/math/Mat3.js","./math/Mat4.js":"node_modules/ogl/src/math/Mat4.js","./math/Quat.js":"node_modules/ogl/src/math/Quat.js","./math/Vec2.js":"node_modules/ogl/src/math/Vec2.js","./math/Vec3.js":"node_modules/ogl/src/math/Vec3.js","./math/Vec4.js":"node_modules/ogl/src/math/Vec4.js","./extras/Plane.js":"node_modules/ogl/src/extras/Plane.js","./extras/Box.js":"node_modules/ogl/src/extras/Box.js","./extras/Sphere.js":"node_modules/ogl/src/extras/Sphere.js","./extras/Cylinder.js":"node_modules/ogl/src/extras/Cylinder.js","./extras/Triangle.js":"node_modules/ogl/src/extras/Triangle.js","./extras/Torus.js":"node_modules/ogl/src/extras/Torus.js","./extras/Orbit.js":"node_modules/ogl/src/extras/Orbit.js","./extras/Raycast.js":"node_modules/ogl/src/extras/Raycast.js","./extras/Curve.js":"node_modules/ogl/src/extras/Curve.js","./extras/Post.js":"node_modules/ogl/src/extras/Post.js","./extras/Skin.js":"node_modules/ogl/src/extras/Skin.js","./extras/Animation.js":"node_modules/ogl/src/extras/Animation.js","./extras/Text.js":"node_modules/ogl/src/extras/Text.js","./extras/NormalProgram.js":"node_modules/ogl/src/extras/NormalProgram.js","./extras/Flowmap.js":"node_modules/ogl/src/extras/Flowmap.js","./extras/GPGPU.js":"node_modules/ogl/src/extras/GPGPU.js","./extras/Polyline.js":"node_modules/ogl/src/extras/Polyline.js","./extras/Shadow.js":"node_modules/ogl/src/extras/Shadow.js","./extras/KTXTexture.js":"node_modules/ogl/src/extras/KTXTexture.js","./extras/TextureLoader.js":"node_modules/ogl/src/extras/TextureLoader.js","./extras/GLTFLoader.js":"node_modules/ogl/src/extras/GLTFLoader.js","./extras/GLTFSkin.js":"node_modules/ogl/src/extras/GLTFSkin.js"}],"js/webgl.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _raf = _interopRequireDefault(require("./raf"));

var _viewport = _interopRequireDefault(require("./viewport"));

var _ogl = require("ogl");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// image : https://unsplash.com/photos/mN6Bfk3hHRg
// dribble : https://dribbble.com/shots/15301232-Branding-Inspiration-Platform
let gl;

class GL {
  constructor() {
    this.renderer = new _ogl.Renderer({
      dpr: 2,
      alpha: true
    });
    this.gl = this.renderer.gl;
    document.body.appendChild(this.gl.canvas);
    this.camera = new _ogl.Camera(this.gl, {
      fov: 45
    });
    this.camera.position.z = 5;
    this.scene = new _ogl.Transform();
    this.onWindowResize();

    _viewport.default.events.on("resize", this.onWindowResize.bind(this));

    _raf.default.add("webgl", this.update.bind(this), 0);
  }

  onWindowResize() {
    this.renderer.setSize(_viewport.default.width, _viewport.default.height);
    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height
    });
    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewportRenderer = {
      height,
      width
    };
  }

  update() {
    this.renderer.render({
      scene: this.scene,
      camera: this.camera
    });
  }

  destroy() {}

}

const WebGL = () => {
  return gl || (gl = new GL());
};

var _default = WebGL;
exports.default = _default;
},{"./raf":"js/raf.js","./viewport":"js/viewport.js","ogl":"node_modules/ogl/src/index.mjs"}],"node_modules/gsap/gsap-core.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._getCache = exports._getSetter = exports._missingPlugin = exports._round = exports._roundModifier = exports._config = exports._ticker = exports._plugins = exports._checkPlugin = exports._replaceRandom = exports._colorStringFilter = exports._sortPropTweensByPriority = exports._forEachName = exports._removeLinkedListItem = exports._setDefaults = exports._relExp = exports._renderComplexString = exports._isUndefined = exports._isString = exports._numWithUnitExp = exports._numExp = exports._getProperty = exports.shuffle = exports.interpolate = exports.unitize = exports.pipe = exports.mapRange = exports.toArray = exports.splitColor = exports.clamp = exports.getUnit = exports.normalize = exports.snap = exports.random = exports.distribute = exports.wrapYoyo = exports.wrap = exports.Circ = exports.Expo = exports.Sine = exports.Bounce = exports.SteppedEase = exports.Back = exports.Elastic = exports.Strong = exports.Quint = exports.Quart = exports.Cubic = exports.Quad = exports.Linear = exports.Power4 = exports.Power3 = exports.Power2 = exports.Power1 = exports.Power0 = exports.default = exports.gsap = exports.PropTween = exports.TweenLite = exports.TweenMax = exports.Tween = exports.TimelineLite = exports.TimelineMax = exports.Timeline = exports.Animation = exports.GSCache = void 0;

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}
/*!
 * GSAP 3.6.0
 * https://greensock.com
 *
 * @license Copyright 2008-2021, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/

/* eslint-disable */


var _config = {
  autoSleep: 120,
  force3D: "auto",
  nullTargetWarn: 1,
  units: {
    lineHeight: ""
  }
},
    _defaults = {
  duration: .5,
  overwrite: false,
  delay: 0
},
    _suppressOverwrites,
    _bigNum = 1e8,
    _tinyNum = 1 / _bigNum,
    _2PI = Math.PI * 2,
    _HALF_PI = _2PI / 4,
    _gsID = 0,
    _sqrt = Math.sqrt,
    _cos = Math.cos,
    _sin = Math.sin,
    _isString = function _isString(value) {
  return typeof value === "string";
},
    _isFunction = function _isFunction(value) {
  return typeof value === "function";
},
    _isNumber = function _isNumber(value) {
  return typeof value === "number";
},
    _isUndefined = function _isUndefined(value) {
  return typeof value === "undefined";
},
    _isObject = function _isObject(value) {
  return typeof value === "object";
},
    _isNotFalse = function _isNotFalse(value) {
  return value !== false;
},
    _windowExists = function _windowExists() {
  return typeof window !== "undefined";
},
    _isFuncOrString = function _isFuncOrString(value) {
  return _isFunction(value) || _isString(value);
},
    _isTypedArray = typeof ArrayBuffer === "function" && ArrayBuffer.isView || function () {},
    // note: IE10 has ArrayBuffer, but NOT ArrayBuffer.isView().
_isArray = Array.isArray,
    _strictNumExp = /(?:-?\.?\d|\.)+/gi,
    //only numbers (including negatives and decimals) but NOT relative values.
_numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,
    //finds any numbers, including ones that start with += or -=, negative numbers, and ones in scientific notation like 1e-8.
_numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g,
    _complexStringNumExp = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,
    //duplicate so that while we're looping through matches from exec(), it doesn't contaminate the lastIndex of _numExp which we use to search for colors too.
_relExp = /[+-]=-?[.\d]+/,
    _delimitedValueExp = /[#\-+.]*\b[a-z\d-=+%.]+/gi,
    _unitExp = /[\d.+\-=]+(?:e[-+]\d*)*/i,
    _globalTimeline,
    _win,
    _coreInitted,
    _doc,
    _globals = {},
    _installScope = {},
    _coreReady,
    _install = function _install(scope) {
  return (_installScope = _merge(scope, _globals)) && gsap;
},
    _missingPlugin = function _missingPlugin(property, value) {
  return console.warn("Invalid property", property, "set to", value, "Missing plugin? gsap.registerPlugin()");
},
    _warn = function _warn(message, suppress) {
  return !suppress && console.warn(message);
},
    _addGlobal = function _addGlobal(name, obj) {
  return name && (_globals[name] = obj) && _installScope && (_installScope[name] = obj) || _globals;
},
    _emptyFunc = function _emptyFunc() {
  return 0;
},
    _reservedProps = {},
    _lazyTweens = [],
    _lazyLookup = {},
    _lastRenderedFrame,
    _plugins = {},
    _effects = {},
    _nextGCFrame = 30,
    _harnessPlugins = [],
    _callbackNames = "",
    _harness = function _harness(targets) {
  var target = targets[0],
      harnessPlugin,
      i;
  _isObject(target) || _isFunction(target) || (targets = [targets]);

  if (!(harnessPlugin = (target._gsap || {}).harness)) {
    // find the first target with a harness. We assume targets passed into an animation will be of similar type, meaning the same kind of harness can be used for them all (performance optimization)
    i = _harnessPlugins.length;

    while (i-- && !_harnessPlugins[i].targetTest(target)) {}

    harnessPlugin = _harnessPlugins[i];
  }

  i = targets.length;

  while (i--) {
    targets[i] && (targets[i]._gsap || (targets[i]._gsap = new GSCache(targets[i], harnessPlugin))) || targets.splice(i, 1);
  }

  return targets;
},
    _getCache = function _getCache(target) {
  return target._gsap || _harness(toArray(target))[0]._gsap;
},
    _getProperty = function _getProperty(target, property, v) {
  return (v = target[property]) && _isFunction(v) ? target[property]() : _isUndefined(v) && target.getAttribute && target.getAttribute(property) || v;
},
    _forEachName = function _forEachName(names, func) {
  return (names = names.split(",")).forEach(func) || names;
},
    //split a comma-delimited list of names into an array, then run a forEach() function and return the split array (this is just a way to consolidate/shorten some code).
_round = function _round(value) {
  return Math.round(value * 100000) / 100000 || 0;
},
    _arrayContainsAny = function _arrayContainsAny(toSearch, toFind) {
  //searches one array to find matches for any of the items in the toFind array. As soon as one is found, it returns true. It does NOT return all the matches; it's simply a boolean search.
  var l = toFind.length,
      i = 0;

  for (; toSearch.indexOf(toFind[i]) < 0 && ++i < l;) {}

  return i < l;
},
    _parseVars = function _parseVars(params, type, parent) {
  //reads the arguments passed to one of the key methods and figures out if the user is defining things with the OLD/legacy syntax where the duration is the 2nd parameter, and then it adjusts things accordingly and spits back the corrected vars object (with the duration added if necessary, as well as runBackwards or startAt or immediateRender). type 0 = to()/staggerTo(), 1 = from()/staggerFrom(), 2 = fromTo()/staggerFromTo()
  var isLegacy = _isNumber(params[1]),
      varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1),
      vars = params[varsIndex],
      irVars;

  isLegacy && (vars.duration = params[1]);
  vars.parent = parent;

  if (type) {
    irVars = vars;

    while (parent && !("immediateRender" in irVars)) {
      // inheritance hasn't happened yet, but someone may have set a default in an ancestor timeline. We could do vars.immediateRender = _isNotFalse(_inheritDefaults(vars).immediateRender) but that'd exact a slight performance penalty because _inheritDefaults() also runs in the Tween constructor. We're paying a small kb price here to gain speed.
      irVars = parent.vars.defaults || {};
      parent = _isNotFalse(parent.vars.inherit) && parent.parent;
    }

    vars.immediateRender = _isNotFalse(irVars.immediateRender);
    type < 2 ? vars.runBackwards = 1 : vars.startAt = params[varsIndex - 1]; // "from" vars
  }

  return vars;
},
    _lazyRender = function _lazyRender() {
  var l = _lazyTweens.length,
      a = _lazyTweens.slice(0),
      i,
      tween;

  _lazyLookup = {};
  _lazyTweens.length = 0;

  for (i = 0; i < l; i++) {
    tween = a[i];
    tween && tween._lazy && (tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0);
  }
},
    _lazySafeRender = function _lazySafeRender(animation, time, suppressEvents, force) {
  _lazyTweens.length && _lazyRender();
  animation.render(time, suppressEvents, force);
  _lazyTweens.length && _lazyRender(); //in case rendering caused any tweens to lazy-init, we should render them because typically when someone calls seek() or time() or progress(), they expect an immediate render.
},
    _numericIfPossible = function _numericIfPossible(value) {
  var n = parseFloat(value);
  return (n || n === 0) && (value + "").match(_delimitedValueExp).length < 2 ? n : _isString(value) ? value.trim() : value;
},
    _passThrough = function _passThrough(p) {
  return p;
},
    _setDefaults = function _setDefaults(obj, defaults) {
  for (var p in defaults) {
    p in obj || (obj[p] = defaults[p]);
  }

  return obj;
},
    _setKeyframeDefaults = function _setKeyframeDefaults(obj, defaults) {
  for (var p in defaults) {
    p in obj || p === "duration" || p === "ease" || (obj[p] = defaults[p]);
  }
},
    _merge = function _merge(base, toMerge) {
  for (var p in toMerge) {
    base[p] = toMerge[p];
  }

  return base;
},
    _mergeDeep = function _mergeDeep(base, toMerge) {
  for (var p in toMerge) {
    p !== "__proto__" && p !== "constructor" && p !== "prototype" && (base[p] = _isObject(toMerge[p]) ? _mergeDeep(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p]);
  }

  return base;
},
    _copyExcluding = function _copyExcluding(obj, excluding) {
  var copy = {},
      p;

  for (p in obj) {
    p in excluding || (copy[p] = obj[p]);
  }

  return copy;
},
    _inheritDefaults = function _inheritDefaults(vars) {
  var parent = vars.parent || _globalTimeline,
      func = vars.keyframes ? _setKeyframeDefaults : _setDefaults;

  if (_isNotFalse(vars.inherit)) {
    while (parent) {
      func(vars, parent.vars.defaults);
      parent = parent.parent || parent._dp;
    }
  }

  return vars;
},
    _arraysMatch = function _arraysMatch(a1, a2) {
  var i = a1.length,
      match = i === a2.length;

  while (match && i-- && a1[i] === a2[i]) {}

  return i < 0;
},
    _addLinkedListItem = function _addLinkedListItem(parent, child, firstProp, lastProp, sortBy) {
  if (firstProp === void 0) {
    firstProp = "_first";
  }

  if (lastProp === void 0) {
    lastProp = "_last";
  }

  var prev = parent[lastProp],
      t;

  if (sortBy) {
    t = child[sortBy];

    while (prev && prev[sortBy] > t) {
      prev = prev._prev;
    }
  }

  if (prev) {
    child._next = prev._next;
    prev._next = child;
  } else {
    child._next = parent[firstProp];
    parent[firstProp] = child;
  }

  if (child._next) {
    child._next._prev = child;
  } else {
    parent[lastProp] = child;
  }

  child._prev = prev;
  child.parent = child._dp = parent;
  return child;
},
    _removeLinkedListItem = function _removeLinkedListItem(parent, child, firstProp, lastProp) {
  if (firstProp === void 0) {
    firstProp = "_first";
  }

  if (lastProp === void 0) {
    lastProp = "_last";
  }

  var prev = child._prev,
      next = child._next;

  if (prev) {
    prev._next = next;
  } else if (parent[firstProp] === child) {
    parent[firstProp] = next;
  }

  if (next) {
    next._prev = prev;
  } else if (parent[lastProp] === child) {
    parent[lastProp] = prev;
  }

  child._next = child._prev = child.parent = null; // don't delete the _dp just so we can revert if necessary. But parent should be null to indicate the item isn't in a linked list.
},
    _removeFromParent = function _removeFromParent(child, onlyIfParentHasAutoRemove) {
  child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren) && child.parent.remove(child);
  child._act = 0;
},
    _uncache = function _uncache(animation, child) {
  if (animation && (!child || child._end > animation._dur || child._start < 0)) {
    // performance optimization: if a child animation is passed in we should only uncache if that child EXTENDS the animation (its end time is beyond the end)
    var a = animation;

    while (a) {
      a._dirty = 1;
      a = a.parent;
    }
  }

  return animation;
},
    _recacheAncestors = function _recacheAncestors(animation) {
  var parent = animation.parent;

  while (parent && parent.parent) {
    //sometimes we must force a re-sort of all children and update the duration/totalDuration of all ancestor timelines immediately in case, for example, in the middle of a render loop, one tween alters another tween's timeScale which shoves its startTime before 0, forcing the parent timeline to shift around and shiftChildren() which could affect that next tween's render (startTime). Doesn't matter for the root timeline though.
    parent._dirty = 1;
    parent.totalDuration();
    parent = parent.parent;
  }

  return animation;
},
    _hasNoPausedAncestors = function _hasNoPausedAncestors(animation) {
  return !animation || animation._ts && _hasNoPausedAncestors(animation.parent);
},
    _elapsedCycleDuration = function _elapsedCycleDuration(animation) {
  return animation._repeat ? _animationCycle(animation._tTime, animation = animation.duration() + animation._rDelay) * animation : 0;
},
    // feed in the totalTime and cycleDuration and it'll return the cycle (iteration minus 1) and if the playhead is exactly at the very END, it will NOT bump up to the next cycle.
_animationCycle = function _animationCycle(tTime, cycleDuration) {
  var whole = Math.floor(tTime /= cycleDuration);
  return tTime && whole === tTime ? whole - 1 : whole;
},
    _parentToChildTotalTime = function _parentToChildTotalTime(parentTime, child) {
  return (parentTime - child._start) * child._ts + (child._ts >= 0 ? 0 : child._dirty ? child.totalDuration() : child._tDur);
},
    _setEnd = function _setEnd(animation) {
  return animation._end = _round(animation._start + (animation._tDur / Math.abs(animation._ts || animation._rts || _tinyNum) || 0));
},
    _alignPlayhead = function _alignPlayhead(animation, totalTime) {
  // adjusts the animation's _start and _end according to the provided totalTime (only if the parent's smoothChildTiming is true and the animation isn't paused). It doesn't do any rendering or forcing things back into parent timelines, etc. - that's what totalTime() is for.
  var parent = animation._dp;

  if (parent && parent.smoothChildTiming && animation._ts) {
    animation._start = _round(parent._time - (animation._ts > 0 ? totalTime / animation._ts : ((animation._dirty ? animation.totalDuration() : animation._tDur) - totalTime) / -animation._ts));

    _setEnd(animation);

    parent._dirty || _uncache(parent, animation); //for performance improvement. If the parent's cache is already dirty, it already took care of marking the ancestors as dirty too, so skip the function call here.
  }

  return animation;
},

/*
_totalTimeToTime = (clampedTotalTime, duration, repeat, repeatDelay, yoyo) => {
	let cycleDuration = duration + repeatDelay,
		time = _round(clampedTotalTime % cycleDuration);
	if (time > duration) {
		time = duration;
	}
	return (yoyo && (~~(clampedTotalTime / cycleDuration) & 1)) ? duration - time : time;
},
*/
_postAddChecks = function _postAddChecks(timeline, child) {
  var t;

  if (child._time || child._initted && !child._dur) {
    //in case, for example, the _start is moved on a tween that has already rendered. Imagine it's at its end state, then the startTime is moved WAY later (after the end of this timeline), it should render at its beginning.
    t = _parentToChildTotalTime(timeline.rawTime(), child);

    if (!child._dur || _clamp(0, child.totalDuration(), t) - child._tTime > _tinyNum) {
      child.render(t, true);
    }
  } //if the timeline has already ended but the inserted tween/timeline extends the duration, we should enable this timeline again so that it renders properly. We should also align the playhead with the parent timeline's when appropriate.


  if (_uncache(timeline, child)._dp && timeline._initted && timeline._time >= timeline._dur && timeline._ts) {
    //in case any of the ancestors had completed but should now be enabled...
    if (timeline._dur < timeline.duration()) {
      t = timeline;

      while (t._dp) {
        t.rawTime() >= 0 && t.totalTime(t._tTime); //moves the timeline (shifts its startTime) if necessary, and also enables it. If it's currently zero, though, it may not be scheduled to render until later so there's no need to force it to align with the current playhead position. Only move to catch up with the playhead.

        t = t._dp;
      }
    }

    timeline._zTime = -_tinyNum; // helps ensure that the next render() will be forced (crossingStart = true in render()), even if the duration hasn't changed (we're adding a child which would need to get rendered). Definitely an edge case. Note: we MUST do this AFTER the loop above where the totalTime() might trigger a render() because this _addToTimeline() method gets called from the Animation constructor, BEFORE tweens even record their targets, etc. so we wouldn't want things to get triggered in the wrong order.
  }
},
    _addToTimeline = function _addToTimeline(timeline, child, position, skipChecks) {
  child.parent && _removeFromParent(child);
  child._start = _round(position + child._delay);
  child._end = _round(child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0));

  _addLinkedListItem(timeline, child, "_first", "_last", timeline._sort ? "_start" : 0);

  timeline._recent = child;
  skipChecks || _postAddChecks(timeline, child);
  return timeline;
},
    _scrollTrigger = function _scrollTrigger(animation, trigger) {
  return (_globals.ScrollTrigger || _missingPlugin("scrollTrigger", trigger)) && _globals.ScrollTrigger.create(trigger, animation);
},
    _attemptInitTween = function _attemptInitTween(tween, totalTime, force, suppressEvents) {
  _initTween(tween, totalTime);

  if (!tween._initted) {
    return 1;
  }

  if (!force && tween._pt && (tween._dur && tween.vars.lazy !== false || !tween._dur && tween.vars.lazy) && _lastRenderedFrame !== _ticker.frame) {
    _lazyTweens.push(tween);

    tween._lazy = [totalTime, suppressEvents];
    return 1;
  }
},
    _parentPlayheadIsBeforeStart = function _parentPlayheadIsBeforeStart(_ref) {
  var parent = _ref.parent;
  return parent && parent._ts && parent._initted && !parent._lock && (parent.rawTime() < 0 || _parentPlayheadIsBeforeStart(parent));
},
    // check parent's _lock because when a timeline repeats/yoyos and does its artificial wrapping, we shouldn't force the ratio back to 0
_renderZeroDurationTween = function _renderZeroDurationTween(tween, totalTime, suppressEvents, force) {
  var prevRatio = tween.ratio,
      ratio = totalTime < 0 || !totalTime && (!tween._start && _parentPlayheadIsBeforeStart(tween) || (tween._ts < 0 || tween._dp._ts < 0) && tween.data !== "isFromStart" && tween.data !== "isStart") ? 0 : 1,
      // if the tween or its parent is reversed and the totalTime is 0, we should go to a ratio of 0.
  repeatDelay = tween._rDelay,
      tTime = 0,
      pt,
      iteration,
      prevIteration;

  if (repeatDelay && tween._repeat) {
    // in case there's a zero-duration tween that has a repeat with a repeatDelay
    tTime = _clamp(0, tween._tDur, totalTime);
    iteration = _animationCycle(tTime, repeatDelay);
    prevIteration = _animationCycle(tween._tTime, repeatDelay);
    tween._yoyo && iteration & 1 && (ratio = 1 - ratio);

    if (iteration !== prevIteration) {
      prevRatio = 1 - ratio;
      tween.vars.repeatRefresh && tween._initted && tween.invalidate();
    }
  }

  if (ratio !== prevRatio || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
    if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents)) {
      // if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
      return;
    }

    prevIteration = tween._zTime;
    tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0); // when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect.

    suppressEvents || (suppressEvents = totalTime && !prevIteration); // if it was rendered previously at exactly 0 (_zTime) and now the playhead is moving away, DON'T fire callbacks otherwise they'll seem like duplicates.

    tween.ratio = ratio;
    tween._from && (ratio = 1 - ratio);
    tween._time = 0;
    tween._tTime = tTime;
    suppressEvents || _callback(tween, "onStart");
    pt = tween._pt;

    while (pt) {
      pt.r(ratio, pt.d);
      pt = pt._next;
    }

    tween._startAt && totalTime < 0 && tween._startAt.render(totalTime, true, true);
    tween._onUpdate && !suppressEvents && _callback(tween, "onUpdate");
    tTime && tween._repeat && !suppressEvents && tween.parent && _callback(tween, "onRepeat");

    if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
      ratio && _removeFromParent(tween, 1);

      if (!suppressEvents) {
        _callback(tween, ratio ? "onComplete" : "onReverseComplete", true);

        tween._prom && tween._prom();
      }
    }
  } else if (!tween._zTime) {
    tween._zTime = totalTime;
  }
},
    _findNextPauseTween = function _findNextPauseTween(animation, prevTime, time) {
  var child;

  if (time > prevTime) {
    child = animation._first;

    while (child && child._start <= time) {
      if (!child._dur && child.data === "isPause" && child._start > prevTime) {
        return child;
      }

      child = child._next;
    }
  } else {
    child = animation._last;

    while (child && child._start >= time) {
      if (!child._dur && child.data === "isPause" && child._start < prevTime) {
        return child;
      }

      child = child._prev;
    }
  }
},
    _setDuration = function _setDuration(animation, duration, skipUncache, leavePlayhead) {
  var repeat = animation._repeat,
      dur = _round(duration) || 0,
      totalProgress = animation._tTime / animation._tDur;
  totalProgress && !leavePlayhead && (animation._time *= dur / animation._dur);
  animation._dur = dur;
  animation._tDur = !repeat ? dur : repeat < 0 ? 1e10 : _round(dur * (repeat + 1) + animation._rDelay * repeat);
  totalProgress && !leavePlayhead ? _alignPlayhead(animation, animation._tTime = animation._tDur * totalProgress) : animation.parent && _setEnd(animation);
  skipUncache || _uncache(animation.parent, animation);
  return animation;
},
    _onUpdateTotalDuration = function _onUpdateTotalDuration(animation) {
  return animation instanceof Timeline ? _uncache(animation) : _setDuration(animation, animation._dur);
},
    _zeroPosition = {
  _start: 0,
  endTime: _emptyFunc
},
    _parsePosition = function _parsePosition(animation, position) {
  var labels = animation.labels,
      recent = animation._recent || _zeroPosition,
      clippedDuration = animation.duration() >= _bigNum ? recent.endTime(false) : animation._dur,
      //in case there's a child that infinitely repeats, users almost never intend for the insertion point of a new child to be based on a SUPER long value like that so we clip it and assume the most recently-added child's endTime should be used instead.
  i,
      offset;

  if (_isString(position) && (isNaN(position) || position in labels)) {
    //if the string is a number like "1", check to see if there's a label with that name, otherwise interpret it as a number (absolute value).
    i = position.charAt(0);

    if (i === "<" || i === ">") {
      return (i === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0);
    }

    i = position.indexOf("=");

    if (i < 0) {
      position in labels || (labels[position] = clippedDuration);
      return labels[position];
    }

    offset = +(position.charAt(i - 1) + position.substr(i + 1));
    return i > 1 ? _parsePosition(animation, position.substr(0, i - 1)) + offset : clippedDuration + offset;
  }

  return position == null ? clippedDuration : +position;
},
    _conditionalReturn = function _conditionalReturn(value, func) {
  return value || value === 0 ? func(value) : func;
},
    _clamp = function _clamp(min, max, value) {
  return value < min ? min : value > max ? max : value;
},
    getUnit = function getUnit(value) {
  if (typeof value !== "string") {
    return "";
  }

  var v = _unitExp.exec(value);

  return v ? value.substr(v.index + v[0].length) : "";
},
    // note: protect against padded numbers as strings, like "100.100". That shouldn't return "00" as the unit. If it's numeric, return no unit.
clamp = function clamp(min, max, value) {
  return _conditionalReturn(value, function (v) {
    return _clamp(min, max, v);
  });
},
    _slice = [].slice,
    _isArrayLike = function _isArrayLike(value, nonEmpty) {
  return value && _isObject(value) && "length" in value && (!nonEmpty && !value.length || value.length - 1 in value && _isObject(value[0])) && !value.nodeType && value !== _win;
},
    _flatten = function _flatten(ar, leaveStrings, accumulator) {
  if (accumulator === void 0) {
    accumulator = [];
  }

  return ar.forEach(function (value) {
    var _accumulator;

    return _isString(value) && !leaveStrings || _isArrayLike(value, 1) ? (_accumulator = accumulator).push.apply(_accumulator, toArray(value)) : accumulator.push(value);
  }) || accumulator;
},
    //takes any value and returns an array. If it's a string (and leaveStrings isn't true), it'll use document.querySelectorAll() and convert that to an array. It'll also accept iterables like jQuery objects.
toArray = function toArray(value, leaveStrings) {
  return _isString(value) && !leaveStrings && (_coreInitted || !_wake()) ? _slice.call(_doc.querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : [];
},
    shuffle = function shuffle(a) {
  return a.sort(function () {
    return .5 - Math.random();
  });
},
    // alternative that's a bit faster and more reliably diverse but bigger:   for (let j, v, i = a.length; i; j = Math.floor(Math.random() * i), v = a[--i], a[i] = a[j], a[j] = v); return a;
//for distributing values across an array. Can accept a number, a function or (most commonly) a function which can contain the following properties: {base, amount, from, ease, grid, axis, length, each}. Returns a function that expects the following parameters: index, target, array. Recognizes the following
distribute = function distribute(v) {
  if (_isFunction(v)) {
    return v;
  }

  var vars = _isObject(v) ? v : {
    each: v
  },
      //n:1 is just to indicate v was a number; we leverage that later to set v according to the length we get. If a number is passed in, we treat it like the old stagger value where 0.1, for example, would mean that things would be distributed with 0.1 between each element in the array rather than a total "amount" that's chunked out among them all.
  ease = _parseEase(vars.ease),
      from = vars.from || 0,
      base = parseFloat(vars.base) || 0,
      cache = {},
      isDecimal = from > 0 && from < 1,
      ratios = isNaN(from) || isDecimal,
      axis = vars.axis,
      ratioX = from,
      ratioY = from;

  if (_isString(from)) {
    ratioX = ratioY = {
      center: .5,
      edges: .5,
      end: 1
    }[from] || 0;
  } else if (!isDecimal && ratios) {
    ratioX = from[0];
    ratioY = from[1];
  }

  return function (i, target, a) {
    var l = (a || vars).length,
        distances = cache[l],
        originX,
        originY,
        x,
        y,
        d,
        j,
        max,
        min,
        wrapAt;

    if (!distances) {
      wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum])[1];

      if (!wrapAt) {
        max = -_bigNum;

        while (max < (max = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l) {}

        wrapAt--;
      }

      distances = cache[l] = [];
      originX = ratios ? Math.min(wrapAt, l) * ratioX - .5 : from % wrapAt;
      originY = ratios ? l * ratioY / wrapAt - .5 : from / wrapAt | 0;
      max = 0;
      min = _bigNum;

      for (j = 0; j < l; j++) {
        x = j % wrapAt - originX;
        y = originY - (j / wrapAt | 0);
        distances[j] = d = !axis ? _sqrt(x * x + y * y) : Math.abs(axis === "y" ? y : x);
        d > max && (max = d);
        d < min && (min = d);
      }

      from === "random" && shuffle(distances);
      distances.max = max - min;
      distances.min = min;
      distances.v = l = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === "y" ? l / wrapAt : wrapAt) || 0) * (from === "edges" ? -1 : 1);
      distances.b = l < 0 ? base - l : base;
      distances.u = getUnit(vars.amount || vars.each) || 0; //unit

      ease = ease && l < 0 ? _invertEase(ease) : ease;
    }

    l = (distances[i] - distances.min) / distances.max || 0;
    return _round(distances.b + (ease ? ease(l) : l) * distances.v) + distances.u; //round in order to work around floating point errors
  };
},
    _roundModifier = function _roundModifier(v) {
  //pass in 0.1 get a function that'll round to the nearest tenth, or 5 to round to the closest 5, or 0.001 to the closest 1000th, etc.
  var p = v < 1 ? Math.pow(10, (v + "").length - 2) : 1; //to avoid floating point math errors (like 24 * 0.1 == 2.4000000000000004), we chop off at a specific number of decimal places (much faster than toFixed()

  return function (raw) {
    var n = Math.round(parseFloat(raw) / v) * v * p;
    return (n - n % 1) / p + (_isNumber(raw) ? 0 : getUnit(raw)); // n - n % 1 replaces Math.floor() in order to handle negative values properly. For example, Math.floor(-150.00000000000003) is 151!
  };
},
    snap = function snap(snapTo, value) {
  var isArray = _isArray(snapTo),
      radius,
      is2D;

  if (!isArray && _isObject(snapTo)) {
    radius = isArray = snapTo.radius || _bigNum;

    if (snapTo.values) {
      snapTo = toArray(snapTo.values);

      if (is2D = !_isNumber(snapTo[0])) {
        radius *= radius; //performance optimization so we don't have to Math.sqrt() in the loop.
      }
    } else {
      snapTo = _roundModifier(snapTo.increment);
    }
  }

  return _conditionalReturn(value, !isArray ? _roundModifier(snapTo) : _isFunction(snapTo) ? function (raw) {
    is2D = snapTo(raw);
    return Math.abs(is2D - raw) <= radius ? is2D : raw;
  } : function (raw) {
    var x = parseFloat(is2D ? raw.x : raw),
        y = parseFloat(is2D ? raw.y : 0),
        min = _bigNum,
        closest = 0,
        i = snapTo.length,
        dx,
        dy;

    while (i--) {
      if (is2D) {
        dx = snapTo[i].x - x;
        dy = snapTo[i].y - y;
        dx = dx * dx + dy * dy;
      } else {
        dx = Math.abs(snapTo[i] - x);
      }

      if (dx < min) {
        min = dx;
        closest = i;
      }
    }

    closest = !radius || min <= radius ? snapTo[closest] : raw;
    return is2D || closest === raw || _isNumber(raw) ? closest : closest + getUnit(raw);
  });
},
    random = function random(min, max, roundingIncrement, returnFunction) {
  return _conditionalReturn(_isArray(min) ? !max : roundingIncrement === true ? !!(roundingIncrement = 0) : !returnFunction, function () {
    return _isArray(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? Math.pow(10, (roundingIncrement + "").length - 2) : 1) && Math.floor(Math.round((min - roundingIncrement / 2 + Math.random() * (max - min + roundingIncrement * .99)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction;
  });
},
    pipe = function pipe() {
  for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) {
    functions[_key] = arguments[_key];
  }

  return function (value) {
    return functions.reduce(function (v, f) {
      return f(v);
    }, value);
  };
},
    unitize = function unitize(func, unit) {
  return function (value) {
    return func(parseFloat(value)) + (unit || getUnit(value));
  };
},
    normalize = function normalize(min, max, value) {
  return mapRange(min, max, 0, 1, value);
},
    _wrapArray = function _wrapArray(a, wrapper, value) {
  return _conditionalReturn(value, function (index) {
    return a[~~wrapper(index)];
  });
},
    wrap = function wrap(min, max, value) {
  // NOTE: wrap() CANNOT be an arrow function! A very odd compiling bug causes problems (unrelated to GSAP).
  var range = max - min;
  return _isArray(min) ? _wrapArray(min, wrap(0, min.length), max) : _conditionalReturn(value, function (value) {
    return (range + (value - min) % range) % range + min;
  });
},
    wrapYoyo = function wrapYoyo(min, max, value) {
  var range = max - min,
      total = range * 2;
  return _isArray(min) ? _wrapArray(min, wrapYoyo(0, min.length - 1), max) : _conditionalReturn(value, function (value) {
    value = (total + (value - min) % total) % total || 0;
    return min + (value > range ? total - value : value);
  });
},
    _replaceRandom = function _replaceRandom(value) {
  //replaces all occurrences of random(...) in a string with the calculated random value. can be a range like random(-100, 100, 5) or an array like random([0, 100, 500])
  var prev = 0,
      s = "",
      i,
      nums,
      end,
      isArray;

  while (~(i = value.indexOf("random(", prev))) {
    end = value.indexOf(")", i);
    isArray = value.charAt(i + 7) === "[";
    nums = value.substr(i + 7, end - i - 7).match(isArray ? _delimitedValueExp : _strictNumExp);
    s += value.substr(prev, i - prev) + random(isArray ? nums : +nums[0], isArray ? 0 : +nums[1], +nums[2] || 1e-5);
    prev = end + 1;
  }

  return s + value.substr(prev, value.length - prev);
},
    mapRange = function mapRange(inMin, inMax, outMin, outMax, value) {
  var inRange = inMax - inMin,
      outRange = outMax - outMin;
  return _conditionalReturn(value, function (value) {
    return outMin + ((value - inMin) / inRange * outRange || 0);
  });
},
    interpolate = function interpolate(start, end, progress, mutate) {
  var func = isNaN(start + end) ? 0 : function (p) {
    return (1 - p) * start + p * end;
  };

  if (!func) {
    var isString = _isString(start),
        master = {},
        p,
        i,
        interpolators,
        l,
        il;

    progress === true && (mutate = 1) && (progress = null);

    if (isString) {
      start = {
        p: start
      };
      end = {
        p: end
      };
    } else if (_isArray(start) && !_isArray(end)) {
      interpolators = [];
      l = start.length;
      il = l - 2;

      for (i = 1; i < l; i++) {
        interpolators.push(interpolate(start[i - 1], start[i])); //build the interpolators up front as a performance optimization so that when the function is called many times, it can just reuse them.
      }

      l--;

      func = function func(p) {
        p *= l;
        var i = Math.min(il, ~~p);
        return interpolators[i](p - i);
      };

      progress = end;
    } else if (!mutate) {
      start = _merge(_isArray(start) ? [] : {}, start);
    }

    if (!interpolators) {
      for (p in end) {
        _addPropTween.call(master, start, p, "get", end[p]);
      }

      func = function func(p) {
        return _renderPropTweens(p, master) || (isString ? start.p : start);
      };
    }
  }

  return _conditionalReturn(progress, func);
},
    _getLabelInDirection = function _getLabelInDirection(timeline, fromTime, backward) {
  //used for nextLabel() and previousLabel()
  var labels = timeline.labels,
      min = _bigNum,
      p,
      distance,
      label;

  for (p in labels) {
    distance = labels[p] - fromTime;

    if (distance < 0 === !!backward && distance && min > (distance = Math.abs(distance))) {
      label = p;
      min = distance;
    }
  }

  return label;
},
    _callback = function _callback(animation, type, executeLazyFirst) {
  var v = animation.vars,
      callback = v[type],
      params,
      scope;

  if (!callback) {
    return;
  }

  params = v[type + "Params"];
  scope = v.callbackScope || animation;
  executeLazyFirst && _lazyTweens.length && _lazyRender(); //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onUpdate on a timeline that reports/checks tweened values.

  return params ? callback.apply(scope, params) : callback.call(scope);
},
    _interrupt = function _interrupt(animation) {
  _removeFromParent(animation);

  animation.progress() < 1 && _callback(animation, "onInterrupt");
  return animation;
},
    _quickTween,
    _createPlugin = function _createPlugin(config) {
  config = !config.name && config["default"] || config; //UMD packaging wraps things oddly, so for example MotionPathHelper becomes {MotionPathHelper:MotionPathHelper, default:MotionPathHelper}.

  var name = config.name,
      isFunc = _isFunction(config),
      Plugin = name && !isFunc && config.init ? function () {
    this._props = [];
  } : config,
      //in case someone passes in an object that's not a plugin, like CustomEase
  instanceDefaults = {
    init: _emptyFunc,
    render: _renderPropTweens,
    add: _addPropTween,
    kill: _killPropTweensOf,
    modifier: _addPluginModifier,
    rawVars: 0
  },
      statics = {
    targetTest: 0,
    get: 0,
    getSetter: _getSetter,
    aliases: {},
    register: 0
  };

  _wake();

  if (config !== Plugin) {
    if (_plugins[name]) {
      return;
    }

    _setDefaults(Plugin, _setDefaults(_copyExcluding(config, instanceDefaults), statics)); //static methods


    _merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config, statics))); //instance methods


    _plugins[Plugin.prop = name] = Plugin;

    if (config.targetTest) {
      _harnessPlugins.push(Plugin);

      _reservedProps[name] = 1;
    }

    name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin"; //for the global name. "motionPath" should become MotionPathPlugin
  }

  _addGlobal(name, Plugin);

  config.register && config.register(gsap, Plugin, PropTween);
},

/*
 * --------------------------------------------------------------------------------------
 * COLORS
 * --------------------------------------------------------------------------------------
 */
_255 = 255,
    _colorLookup = {
  aqua: [0, _255, _255],
  lime: [0, _255, 0],
  silver: [192, 192, 192],
  black: [0, 0, 0],
  maroon: [128, 0, 0],
  teal: [0, 128, 128],
  blue: [0, 0, _255],
  navy: [0, 0, 128],
  white: [_255, _255, _255],
  olive: [128, 128, 0],
  yellow: [_255, _255, 0],
  orange: [_255, 165, 0],
  gray: [128, 128, 128],
  purple: [128, 0, 128],
  green: [0, 128, 0],
  red: [_255, 0, 0],
  pink: [_255, 192, 203],
  cyan: [0, _255, _255],
  transparent: [_255, _255, _255, 0]
},
    _hue = function _hue(h, m1, m2) {
  h = h < 0 ? h + 1 : h > 1 ? h - 1 : h;
  return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < .5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255 + .5 | 0;
},
    splitColor = function splitColor(v, toHSL, forceAlpha) {
  var a = !v ? _colorLookup.black : _isNumber(v) ? [v >> 16, v >> 8 & _255, v & _255] : 0,
      r,
      g,
      b,
      h,
      s,
      l,
      max,
      min,
      d,
      wasHSL;

  if (!a) {
    if (v.substr(-1) === ",") {
      //sometimes a trailing comma is included and we should chop it off (typically from a comma-delimited list of values like a textShadow:"2px 2px 2px blue, 5px 5px 5px rgb(255,0,0)" - in this example "blue," has a trailing comma. We could strip it out inside parseComplex() but we'd need to do it to the beginning and ending values plus it wouldn't provide protection from other potential scenarios like if the user passes in a similar value.
      v = v.substr(0, v.length - 1);
    }

    if (_colorLookup[v]) {
      a = _colorLookup[v];
    } else if (v.charAt(0) === "#") {
      if (v.length < 6) {
        //for shorthand like #9F0 or #9F0F (could have alpha)
        r = v.charAt(1);
        g = v.charAt(2);
        b = v.charAt(3);
        v = "#" + r + r + g + g + b + b + (v.length === 5 ? v.charAt(4) + v.charAt(4) : "");
      }

      if (v.length === 9) {
        // hex with alpha, like #fd5e53ff
        a = parseInt(v.substr(1, 6), 16);
        return [a >> 16, a >> 8 & _255, a & _255, parseInt(v.substr(7), 16) / 255];
      }

      v = parseInt(v.substr(1), 16);
      a = [v >> 16, v >> 8 & _255, v & _255];
    } else if (v.substr(0, 3) === "hsl") {
      a = wasHSL = v.match(_strictNumExp);

      if (!toHSL) {
        h = +a[0] % 360 / 360;
        s = +a[1] / 100;
        l = +a[2] / 100;
        g = l <= .5 ? l * (s + 1) : l + s - l * s;
        r = l * 2 - g;
        a.length > 3 && (a[3] *= 1); //cast as number

        a[0] = _hue(h + 1 / 3, r, g);
        a[1] = _hue(h, r, g);
        a[2] = _hue(h - 1 / 3, r, g);
      } else if (~v.indexOf("=")) {
        //if relative values are found, just return the raw strings with the relative prefixes in place.
        a = v.match(_numExp);
        forceAlpha && a.length < 4 && (a[3] = 1);
        return a;
      }
    } else {
      a = v.match(_strictNumExp) || _colorLookup.transparent;
    }

    a = a.map(Number);
  }

  if (toHSL && !wasHSL) {
    r = a[0] / _255;
    g = a[1] / _255;
    b = a[2] / _255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h *= 60;
    }

    a[0] = ~~(h + .5);
    a[1] = ~~(s * 100 + .5);
    a[2] = ~~(l * 100 + .5);
  }

  forceAlpha && a.length < 4 && (a[3] = 1);
  return a;
},
    _colorOrderData = function _colorOrderData(v) {
  // strips out the colors from the string, finds all the numeric slots (with units) and returns an array of those. The Array also has a "c" property which is an Array of the index values where the colors belong. This is to help work around issues where there's a mis-matched order of color/numeric data like drop-shadow(#f00 0px 1px 2px) and drop-shadow(0x 1px 2px #f00). This is basically a helper function used in _formatColors()
  var values = [],
      c = [],
      i = -1;
  v.split(_colorExp).forEach(function (v) {
    var a = v.match(_numWithUnitExp) || [];
    values.push.apply(values, a);
    c.push(i += a.length + 1);
  });
  values.c = c;
  return values;
},
    _formatColors = function _formatColors(s, toHSL, orderMatchData) {
  var result = "",
      colors = (s + result).match(_colorExp),
      type = toHSL ? "hsla(" : "rgba(",
      i = 0,
      c,
      shell,
      d,
      l;

  if (!colors) {
    return s;
  }

  colors = colors.map(function (color) {
    return (color = splitColor(color, toHSL, 1)) && type + (toHSL ? color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : color.join(",")) + ")";
  });

  if (orderMatchData) {
    d = _colorOrderData(s);
    c = orderMatchData.c;

    if (c.join(result) !== d.c.join(result)) {
      shell = s.replace(_colorExp, "1").split(_numWithUnitExp);
      l = shell.length - 1;

      for (; i < l; i++) {
        result += shell[i] + (~c.indexOf(i) ? colors.shift() || type + "0,0,0,0)" : (d.length ? d : colors.length ? colors : orderMatchData).shift());
      }
    }
  }

  if (!shell) {
    shell = s.split(_colorExp);
    l = shell.length - 1;

    for (; i < l; i++) {
      result += shell[i] + colors[i];
    }
  }

  return result + shell[l];
},
    _colorExp = function () {
  var s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",
      //we'll dynamically build this Regular Expression to conserve file size. After building it, it will be able to find rgb(), rgba(), # (hexadecimal), and named color values like red, blue, purple, etc.,
  p;

  for (p in _colorLookup) {
    s += "|" + p + "\\b";
  }

  return new RegExp(s + ")", "gi");
}(),
    _hslExp = /hsl[a]?\(/,
    _colorStringFilter = function _colorStringFilter(a) {
  var combined = a.join(" "),
      toHSL;
  _colorExp.lastIndex = 0;

  if (_colorExp.test(combined)) {
    toHSL = _hslExp.test(combined);
    a[1] = _formatColors(a[1], toHSL);
    a[0] = _formatColors(a[0], toHSL, _colorOrderData(a[1])); // make sure the order of numbers/colors match with the END value.

    return true;
  }
},

/*
 * --------------------------------------------------------------------------------------
 * TICKER
 * --------------------------------------------------------------------------------------
 */
_tickerActive,
    _ticker = function () {
  var _getTime = Date.now,
      _lagThreshold = 500,
      _adjustedLag = 33,
      _startTime = _getTime(),
      _lastUpdate = _startTime,
      _gap = 1000 / 240,
      _nextTime = _gap,
      _listeners = [],
      _id,
      _req,
      _raf,
      _self,
      _delta,
      _i,
      _tick = function _tick(v) {
    var elapsed = _getTime() - _lastUpdate,
        manual = v === true,
        overlap,
        dispatch,
        time,
        frame;

    elapsed > _lagThreshold && (_startTime += elapsed - _adjustedLag);
    _lastUpdate += elapsed;
    time = _lastUpdate - _startTime;
    overlap = time - _nextTime;

    if (overlap > 0 || manual) {
      frame = ++_self.frame;
      _delta = time - _self.time * 1000;
      _self.time = time = time / 1000;
      _nextTime += overlap + (overlap >= _gap ? 4 : _gap - overlap);
      dispatch = 1;
    }

    manual || (_id = _req(_tick)); //make sure the request is made before we dispatch the "tick" event so that timing is maintained. Otherwise, if processing the "tick" requires a bunch of time (like 15ms) and we're using a setTimeout() that's based on 16.7ms, it'd technically take 31.7ms between frames otherwise.

    if (dispatch) {
      for (_i = 0; _i < _listeners.length; _i++) {
        // use _i and check _listeners.length instead of a variable because a listener could get removed during the loop, and if that happens to an element less than the current index, it'd throw things off in the loop.
        _listeners[_i](time, _delta, frame, v);
      }
    }
  };

  _self = {
    time: 0,
    frame: 0,
    tick: function tick() {
      _tick(true);
    },
    deltaRatio: function deltaRatio(fps) {
      return _delta / (1000 / (fps || 60));
    },
    wake: function wake() {
      if (_coreReady) {
        if (!_coreInitted && _windowExists()) {
          _win = _coreInitted = window;
          _doc = _win.document || {};
          _globals.gsap = gsap;
          (_win.gsapVersions || (_win.gsapVersions = [])).push(gsap.version);

          _install(_installScope || _win.GreenSockGlobals || !_win.gsap && _win || {});

          _raf = _win.requestAnimationFrame;
        }

        _id && _self.sleep();

        _req = _raf || function (f) {
          return setTimeout(f, _nextTime - _self.time * 1000 + 1 | 0);
        };

        _tickerActive = 1;

        _tick(2);
      }
    },
    sleep: function sleep() {
      (_raf ? _win.cancelAnimationFrame : clearTimeout)(_id);
      _tickerActive = 0;
      _req = _emptyFunc;
    },
    lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
      _lagThreshold = threshold || 1 / _tinyNum; //zero should be interpreted as basically unlimited

      _adjustedLag = Math.min(adjustedLag, _lagThreshold, 0);
    },
    fps: function fps(_fps) {
      _gap = 1000 / (_fps || 240);
      _nextTime = _self.time * 1000 + _gap;
    },
    add: function add(callback) {
      _listeners.indexOf(callback) < 0 && _listeners.push(callback);

      _wake();
    },
    remove: function remove(callback) {
      var i;
      ~(i = _listeners.indexOf(callback)) && _listeners.splice(i, 1) && _i >= i && _i--;
    },
    _listeners: _listeners
  };
  return _self;
}(),
    _wake = function _wake() {
  return !_tickerActive && _ticker.wake();
},
    //also ensures the core classes are initialized.

/*
* -------------------------------------------------
* EASING
* -------------------------------------------------
*/
_easeMap = {},
    _customEaseExp = /^[\d.\-M][\d.\-,\s]/,
    _quotesExp = /["']/g,
    _parseObjectInString = function _parseObjectInString(value) {
  //takes a string like "{wiggles:10, type:anticipate})" and turns it into a real object. Notice it ends in ")" and includes the {} wrappers. This is because we only use this function for parsing ease configs and prioritized optimization rather than reusability.
  var obj = {},
      split = value.substr(1, value.length - 3).split(":"),
      key = split[0],
      i = 1,
      l = split.length,
      index,
      val,
      parsedVal;

  for (; i < l; i++) {
    val = split[i];
    index = i !== l - 1 ? val.lastIndexOf(",") : val.length;
    parsedVal = val.substr(0, index);
    obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
    key = val.substr(index + 1).trim();
  }

  return obj;
},
    _valueInParentheses = function _valueInParentheses(value) {
  var open = value.indexOf("(") + 1,
      close = value.indexOf(")"),
      nested = value.indexOf("(", open);
  return value.substring(open, ~nested && nested < close ? value.indexOf(")", close + 1) : close);
},
    _configEaseFromString = function _configEaseFromString(name) {
  //name can be a string like "elastic.out(1,0.5)", and pass in _easeMap as obj and it'll parse it out and call the actual function like _easeMap.Elastic.easeOut.config(1,0.5). It will also parse custom ease strings as long as CustomEase is loaded and registered (internally as _easeMap._CE).
  var split = (name + "").split("("),
      ease = _easeMap[split[0]];
  return ease && split.length > 1 && ease.config ? ease.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _valueInParentheses(name).split(",").map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE("", name) : ease;
},
    _invertEase = function _invertEase(ease) {
  return function (p) {
    return 1 - ease(1 - p);
  };
},
    // allow yoyoEase to be set in children and have those affected when the parent/ancestor timeline yoyos.
_propagateYoyoEase = function _propagateYoyoEase(timeline, isYoyo) {
  var child = timeline._first,
      ease;

  while (child) {
    if (child instanceof Timeline) {
      _propagateYoyoEase(child, isYoyo);
    } else if (child.vars.yoyoEase && (!child._yoyo || !child._repeat) && child._yoyo !== isYoyo) {
      if (child.timeline) {
        _propagateYoyoEase(child.timeline, isYoyo);
      } else {
        ease = child._ease;
        child._ease = child._yEase;
        child._yEase = ease;
        child._yoyo = isYoyo;
      }
    }

    child = child._next;
  }
},
    _parseEase = function _parseEase(ease, defaultEase) {
  return !ease ? defaultEase : (_isFunction(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase;
},
    _insertEase = function _insertEase(names, easeIn, easeOut, easeInOut) {
  if (easeOut === void 0) {
    easeOut = function easeOut(p) {
      return 1 - easeIn(1 - p);
    };
  }

  if (easeInOut === void 0) {
    easeInOut = function easeInOut(p) {
      return p < .5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2;
    };
  }

  var ease = {
    easeIn: easeIn,
    easeOut: easeOut,
    easeInOut: easeInOut
  },
      lowercaseName;

  _forEachName(names, function (name) {
    _easeMap[name] = _globals[name] = ease;
    _easeMap[lowercaseName = name.toLowerCase()] = easeOut;

    for (var p in ease) {
      _easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease[p];
    }
  });

  return ease;
},
    _easeInOutFromOut = function _easeInOutFromOut(easeOut) {
  return function (p) {
    return p < .5 ? (1 - easeOut(1 - p * 2)) / 2 : .5 + easeOut((p - .5) * 2) / 2;
  };
},
    _configElastic = function _configElastic(type, amplitude, period) {
  var p1 = amplitude >= 1 ? amplitude : 1,
      //note: if amplitude is < 1, we simply adjust the period for a more natural feel. Otherwise the math doesn't work right and the curve starts at 1.
  p2 = (period || (type ? .3 : .45)) / (amplitude < 1 ? amplitude : 1),
      p3 = p2 / _2PI * (Math.asin(1 / p1) || 0),
      easeOut = function easeOut(p) {
    return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1;
  },
      ease = type === "out" ? easeOut : type === "in" ? function (p) {
    return 1 - easeOut(1 - p);
  } : _easeInOutFromOut(easeOut);

  p2 = _2PI / p2; //precalculate to optimize

  ease.config = function (amplitude, period) {
    return _configElastic(type, amplitude, period);
  };

  return ease;
},
    _configBack = function _configBack(type, overshoot) {
  if (overshoot === void 0) {
    overshoot = 1.70158;
  }

  var easeOut = function easeOut(p) {
    return p ? --p * p * ((overshoot + 1) * p + overshoot) + 1 : 0;
  },
      ease = type === "out" ? easeOut : type === "in" ? function (p) {
    return 1 - easeOut(1 - p);
  } : _easeInOutFromOut(easeOut);

  ease.config = function (overshoot) {
    return _configBack(type, overshoot);
  };

  return ease;
}; // a cheaper (kb and cpu) but more mild way to get a parameterized weighted ease by feeding in a value between -1 (easeIn) and 1 (easeOut) where 0 is linear.
// _weightedEase = ratio => {
// 	let y = 0.5 + ratio / 2;
// 	return p => (2 * (1 - p) * p * y + p * p);
// },
// a stronger (but more expensive kb/cpu) parameterized weighted ease that lets you feed in a value between -1 (easeIn) and 1 (easeOut) where 0 is linear.
// _weightedEaseStrong = ratio => {
// 	ratio = .5 + ratio / 2;
// 	let o = 1 / 3 * (ratio < .5 ? ratio : 1 - ratio),
// 		b = ratio - o,
// 		c = ratio + o;
// 	return p => p === 1 ? p : 3 * b * (1 - p) * (1 - p) * p + 3 * c * (1 - p) * p * p + p * p * p;
// };


exports._ticker = _ticker;
exports._colorStringFilter = _colorStringFilter;
exports.splitColor = splitColor;
exports.interpolate = interpolate;
exports.mapRange = mapRange;
exports._replaceRandom = _replaceRandom;
exports.wrapYoyo = wrapYoyo;
exports.wrap = wrap;
exports.normalize = normalize;
exports.unitize = unitize;
exports.pipe = pipe;
exports.random = random;
exports.snap = snap;
exports._roundModifier = _roundModifier;
exports.distribute = distribute;
exports.shuffle = shuffle;
exports.toArray = toArray;
exports.clamp = clamp;
exports.getUnit = getUnit;
exports._removeLinkedListItem = _removeLinkedListItem;
exports._setDefaults = _setDefaults;
exports._round = _round;
exports._forEachName = _forEachName;
exports._getProperty = _getProperty;
exports._getCache = _getCache;
exports._plugins = _plugins;
exports._missingPlugin = _missingPlugin;
exports._relExp = _relExp;
exports._numWithUnitExp = _numWithUnitExp;
exports._numExp = _numExp;
exports._isUndefined = _isUndefined;
exports._isString = _isString;
exports._config = _config;

_forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function (name, i) {
  var power = i < 5 ? i + 1 : i;

  _insertEase(name + ",Power" + (power - 1), i ? function (p) {
    return Math.pow(p, power);
  } : function (p) {
    return p;
  }, function (p) {
    return 1 - Math.pow(1 - p, power);
  }, function (p) {
    return p < .5 ? Math.pow(p * 2, power) / 2 : 1 - Math.pow((1 - p) * 2, power) / 2;
  });
});

_easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;

_insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());

(function (n, c) {
  var n1 = 1 / c,
      n2 = 2 * n1,
      n3 = 2.5 * n1,
      easeOut = function easeOut(p) {
    return p < n1 ? n * p * p : p < n2 ? n * Math.pow(p - 1.5 / c, 2) + .75 : p < n3 ? n * (p -= 2.25 / c) * p + .9375 : n * Math.pow(p - 2.625 / c, 2) + .984375;
  };

  _insertEase("Bounce", function (p) {
    return 1 - easeOut(1 - p);
  }, easeOut);
})(7.5625, 2.75);

_insertEase("Expo", function (p) {
  return p ? Math.pow(2, 10 * (p - 1)) : 0;
});

_insertEase("Circ", function (p) {
  return -(_sqrt(1 - p * p) - 1);
});

_insertEase("Sine", function (p) {
  return p === 1 ? 1 : -_cos(p * _HALF_PI) + 1;
});

_insertEase("Back", _configBack("in"), _configBack("out"), _configBack());

_easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = {
  config: function config(steps, immediateStart) {
    if (steps === void 0) {
      steps = 1;
    }

    var p1 = 1 / steps,
        p2 = steps + (immediateStart ? 0 : 1),
        p3 = immediateStart ? 1 : 0,
        max = 1 - _tinyNum;
    return function (p) {
      return ((p2 * _clamp(0, max, p) | 0) + p3) * p1;
    };
  }
};
_defaults.ease = _easeMap["quad.out"];

_forEachName("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function (name) {
  return _callbackNames += name + "," + name + "Params,";
});
/*
 * --------------------------------------------------------------------------------------
 * CACHE
 * --------------------------------------------------------------------------------------
 */


var GSCache = function GSCache(target, harness) {
  this.id = _gsID++;
  target._gsap = this;
  this.target = target;
  this.harness = harness;
  this.get = harness ? harness.get : _getProperty;
  this.set = harness ? harness.getSetter : _getSetter;
};
/*
 * --------------------------------------------------------------------------------------
 * ANIMATION
 * --------------------------------------------------------------------------------------
 */


exports.GSCache = GSCache;

var Animation = /*#__PURE__*/function () {
  function Animation(vars, time) {
    var parent = vars.parent || _globalTimeline;
    this.vars = vars;
    this._delay = +vars.delay || 0;

    if (this._repeat = vars.repeat === Infinity ? -2 : vars.repeat || 0) {
      // TODO: repeat: Infinity on a timeline's children must flag that timeline internally and affect its totalDuration, otherwise it'll stop in the negative direction when reaching the start.
      this._rDelay = vars.repeatDelay || 0;
      this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
    }

    this._ts = 1;

    _setDuration(this, +vars.duration, 1, 1);

    this.data = vars.data;
    _tickerActive || _ticker.wake();
    parent && _addToTimeline(parent, this, time || time === 0 ? time : parent._time, 1);
    vars.reversed && this.reverse();
    vars.paused && this.paused(true);
  }

  var _proto = Animation.prototype;

  _proto.delay = function delay(value) {
    if (value || value === 0) {
      this.parent && this.parent.smoothChildTiming && this.startTime(this._start + value - this._delay);
      this._delay = value;
      return this;
    }

    return this._delay;
  };

  _proto.duration = function duration(value) {
    return arguments.length ? this.totalDuration(this._repeat > 0 ? value + (value + this._rDelay) * this._repeat : value) : this.totalDuration() && this._dur;
  };

  _proto.totalDuration = function totalDuration(value) {
    if (!arguments.length) {
      return this._tDur;
    }

    this._dirty = 0;
    return _setDuration(this, this._repeat < 0 ? value : (value - this._repeat * this._rDelay) / (this._repeat + 1));
  };

  _proto.totalTime = function totalTime(_totalTime, suppressEvents) {
    _wake();

    if (!arguments.length) {
      return this._tTime;
    }

    var parent = this._dp;

    if (parent && parent.smoothChildTiming && this._ts) {
      _alignPlayhead(this, _totalTime);

      !parent._dp || parent.parent || _postAddChecks(parent, this); // edge case: if this is a child of a timeline that already completed, for example, we must re-activate the parent.
      //in case any of the ancestor timelines had completed but should now be enabled, we should reset their totalTime() which will also ensure that they're lined up properly and enabled. Skip for animations that are on the root (wasteful). Example: a TimelineLite.exportRoot() is performed when there's a paused tween on the root, the export will not complete until that tween is unpaused, but imagine a child gets restarted later, after all [unpaused] tweens have completed. The start of that child would get pushed out, but one of the ancestors may have completed.

      while (parent.parent) {
        if (parent.parent._time !== parent._start + (parent._ts >= 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) {
          parent.totalTime(parent._tTime, true);
        }

        parent = parent.parent;
      }

      if (!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && _totalTime < this._tDur || this._ts < 0 && _totalTime > 0 || !this._tDur && !_totalTime)) {
        //if the animation doesn't have a parent, put it back into its last parent (recorded as _dp for exactly cases like this). Limit to parents with autoRemoveChildren (like globalTimeline) so that if the user manually removes an animation from a timeline and then alters its playhead, it doesn't get added back in.
        _addToTimeline(this._dp, this, this._start - this._delay);
      }
    }

    if (this._tTime !== _totalTime || !this._dur && !suppressEvents || this._initted && Math.abs(this._zTime) === _tinyNum || !_totalTime && !this._initted && (this.add || this._ptLookup)) {
      // check for _ptLookup on a Tween instance to ensure it has actually finished being instantiated, otherwise if this.reverse() gets called in the Animation constructor, it could trigger a render() here even though the _targets weren't populated, thus when _init() is called there won't be any PropTweens (it'll act like the tween is non-functional)
      this._ts || (this._pTime = _totalTime); // otherwise, if an animation is paused, then the playhead is moved back to zero, then resumed, it'd revert back to the original time at the pause
      //if (!this._lock) { // avoid endless recursion (not sure we need this yet or if it's worth the performance hit)
      //   this._lock = 1;

      _lazySafeRender(this, _totalTime, suppressEvents); //   this._lock = 0;
      //}

    }

    return this;
  };

  _proto.time = function time(value, suppressEvents) {
    return arguments.length ? this.totalTime(Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % this._dur || (value ? this._dur : 0), suppressEvents) : this._time; // note: if the modulus results in 0, the playhead could be exactly at the end or the beginning, and we always defer to the END with a non-zero value, otherwise if you set the time() to the very end (duration()), it would render at the START!
  };

  _proto.totalProgress = function totalProgress(value, suppressEvents) {
    return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.ratio;
  };

  _proto.progress = function progress(value, suppressEvents) {
    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? Math.min(1, this._time / this._dur) : this.ratio;
  };

  _proto.iteration = function iteration(value, suppressEvents) {
    var cycleDuration = this.duration() + this._rDelay;

    return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1;
  } // potential future addition:
  // isPlayingBackwards() {
  // 	let animation = this,
  // 		orientation = 1; // 1 = forward, -1 = backward
  // 	while (animation) {
  // 		orientation *= animation.reversed() || (animation.repeat() && !(animation.iteration() & 1)) ? -1 : 1;
  // 		animation = animation.parent;
  // 	}
  // 	return orientation < 0;
  // }
  ;

  _proto.timeScale = function timeScale(value) {
    if (!arguments.length) {
      return this._rts === -_tinyNum ? 0 : this._rts; // recorded timeScale. Special case: if someone calls reverse() on an animation with timeScale of 0, we assign it -_tinyNum to remember it's reversed.
    }

    if (this._rts === value) {
      return this;
    }

    var tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime; // make sure to do the parentToChildTotalTime() BEFORE setting the new _ts because the old one must be used in that calculation.
    // prioritize rendering where the parent's playhead lines up instead of this._tTime because there could be a tween that's animating another tween's timeScale in the same rendering loop (same parent), thus if the timeScale tween renders first, it would alter _start BEFORE _tTime was set on that tick (in the rendering loop), effectively freezing it until the timeScale tween finishes.

    this._rts = +value || 0;
    this._ts = this._ps || value === -_tinyNum ? 0 : this._rts; // _ts is the functional timeScale which would be 0 if the animation is paused.

    return _recacheAncestors(this.totalTime(_clamp(-this._delay, this._tDur, tTime), true));
  };

  _proto.paused = function paused(value) {
    if (!arguments.length) {
      return this._ps;
    }

    if (this._ps !== value) {
      this._ps = value;

      if (value) {
        this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()); // if the pause occurs during the delay phase, make sure that's factored in when resuming.

        this._ts = this._act = 0; // _ts is the functional timeScale, so a paused tween would effectively have a timeScale of 0. We record the "real" timeScale as _rts (recorded time scale)
      } else {
        _wake();

        this._ts = this._rts; //only defer to _pTime (pauseTime) if tTime is zero. Remember, someone could pause() an animation, then scrub the playhead and resume(). If the parent doesn't have smoothChildTiming, we render at the rawTime() because the startTime won't get updated.

        this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && (this._tTime -= _tinyNum) && Math.abs(this._zTime) !== _tinyNum); // edge case: animation.progress(1).pause().play() wouldn't render again because the playhead is already at the end, but the call to totalTime() below will add it back to its parent...and not remove it again (since removing only happens upon rendering at a new time). Offsetting the _tTime slightly is done simply to cause the final render in totalTime() that'll pop it off its timeline (if autoRemoveChildren is true, of course). Check to make sure _zTime isn't -_tinyNum to avoid an edge case where the playhead is pushed to the end but INSIDE a tween/callback, the timeline itself is paused thus halting rendering and leaving a few unrendered. When resuming, it wouldn't render those otherwise.
      }
    }

    return this;
  };

  _proto.startTime = function startTime(value) {
    if (arguments.length) {
      this._start = value;
      var parent = this.parent || this._dp;
      parent && (parent._sort || !this.parent) && _addToTimeline(parent, this, value - this._delay);
      return this;
    }

    return this._start;
  };

  _proto.endTime = function endTime(includeRepeats) {
    return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts);
  };

  _proto.rawTime = function rawTime(wrapRepeats) {
    var parent = this.parent || this._dp; // _dp = detatched parent

    return !parent ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this);
  };

  _proto.globalTime = function globalTime(rawTime) {
    var animation = this,
        time = arguments.length ? rawTime : animation.rawTime();

    while (animation) {
      time = animation._start + time / (animation._ts || 1);
      animation = animation._dp;
    }

    return time;
  };

  _proto.repeat = function repeat(value) {
    if (arguments.length) {
      this._repeat = value === Infinity ? -2 : value;
      return _onUpdateTotalDuration(this);
    }

    return this._repeat === -2 ? Infinity : this._repeat;
  };

  _proto.repeatDelay = function repeatDelay(value) {
    if (arguments.length) {
      this._rDelay = value;
      return _onUpdateTotalDuration(this);
    }

    return this._rDelay;
  };

  _proto.yoyo = function yoyo(value) {
    if (arguments.length) {
      this._yoyo = value;
      return this;
    }

    return this._yoyo;
  };

  _proto.seek = function seek(position, suppressEvents) {
    return this.totalTime(_parsePosition(this, position), _isNotFalse(suppressEvents));
  };

  _proto.restart = function restart(includeDelay, suppressEvents) {
    return this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents));
  };

  _proto.play = function play(from, suppressEvents) {
    from != null && this.seek(from, suppressEvents);
    return this.reversed(false).paused(false);
  };

  _proto.reverse = function reverse(from, suppressEvents) {
    from != null && this.seek(from || this.totalDuration(), suppressEvents);
    return this.reversed(true).paused(false);
  };

  _proto.pause = function pause(atTime, suppressEvents) {
    atTime != null && this.seek(atTime, suppressEvents);
    return this.paused(true);
  };

  _proto.resume = function resume() {
    return this.paused(false);
  };

  _proto.reversed = function reversed(value) {
    if (arguments.length) {
      !!value !== this.reversed() && this.timeScale(-this._rts || (value ? -_tinyNum : 0)); // in case timeScale is zero, reversing would have no effect so we use _tinyNum.

      return this;
    }

    return this._rts < 0;
  };

  _proto.invalidate = function invalidate() {
    this._initted = this._act = 0;
    this._zTime = -_tinyNum;
    return this;
  };

  _proto.isActive = function isActive() {
    var parent = this.parent || this._dp,
        start = this._start,
        rawTime;
    return !!(!parent || this._ts && this._initted && parent.isActive() && (rawTime = parent.rawTime(true)) >= start && rawTime < this.endTime(true) - _tinyNum);
  };

  _proto.eventCallback = function eventCallback(type, callback, params) {
    var vars = this.vars;

    if (arguments.length > 1) {
      if (!callback) {
        delete vars[type];
      } else {
        vars[type] = callback;
        params && (vars[type + "Params"] = params);
        type === "onUpdate" && (this._onUpdate = callback);
      }

      return this;
    }

    return vars[type];
  };

  _proto.then = function then(onFulfilled) {
    var self = this;
    return new Promise(function (resolve) {
      var f = _isFunction(onFulfilled) ? onFulfilled : _passThrough,
          _resolve = function _resolve() {
        var _then = self.then;
        self.then = null; // temporarily null the then() method to avoid an infinite loop (see https://github.com/greensock/GSAP/issues/322)

        _isFunction(f) && (f = f(self)) && (f.then || f === self) && (self.then = _then);
        resolve(f);
        self.then = _then;
      };

      if (self._initted && self.totalProgress() === 1 && self._ts >= 0 || !self._tTime && self._ts < 0) {
        _resolve();
      } else {
        self._prom = _resolve;
      }
    });
  };

  _proto.kill = function kill() {
    _interrupt(this);
  };

  return Animation;
}();

exports.Animation = Animation;

_setDefaults(Animation.prototype, {
  _time: 0,
  _start: 0,
  _end: 0,
  _tTime: 0,
  _tDur: 0,
  _dirty: 0,
  _repeat: 0,
  _yoyo: false,
  parent: null,
  _initted: false,
  _rDelay: 0,
  _ts: 1,
  _dp: 0,
  ratio: 0,
  _zTime: -_tinyNum,
  _prom: 0,
  _ps: false,
  _rts: 1
});
/*
 * -------------------------------------------------
 * TIMELINE
 * -------------------------------------------------
 */


var Timeline = /*#__PURE__*/function (_Animation) {
  _inheritsLoose(Timeline, _Animation);

  function Timeline(vars, time) {
    var _this;

    if (vars === void 0) {
      vars = {};
    }

    _this = _Animation.call(this, vars, time) || this;
    _this.labels = {};
    _this.smoothChildTiming = !!vars.smoothChildTiming;
    _this.autoRemoveChildren = !!vars.autoRemoveChildren;
    _this._sort = _isNotFalse(vars.sortChildren);
    _this.parent && _postAddChecks(_this.parent, _assertThisInitialized(_this));
    vars.scrollTrigger && _scrollTrigger(_assertThisInitialized(_this), vars.scrollTrigger);
    return _this;
  }

  var _proto2 = Timeline.prototype;

  _proto2.to = function to(targets, vars, position) {
    new Tween(targets, _parseVars(arguments, 0, this), _parsePosition(this, _isNumber(vars) ? arguments[3] : position));
    return this;
  };

  _proto2.from = function from(targets, vars, position) {
    new Tween(targets, _parseVars(arguments, 1, this), _parsePosition(this, _isNumber(vars) ? arguments[3] : position));
    return this;
  };

  _proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
    new Tween(targets, _parseVars(arguments, 2, this), _parsePosition(this, _isNumber(fromVars) ? arguments[4] : position));
    return this;
  };

  _proto2.set = function set(targets, vars, position) {
    vars.duration = 0;
    vars.parent = this;
    _inheritDefaults(vars).repeatDelay || (vars.repeat = 0);
    vars.immediateRender = !!vars.immediateRender;
    new Tween(targets, vars, _parsePosition(this, position), 1);
    return this;
  };

  _proto2.call = function call(callback, params, position) {
    return _addToTimeline(this, Tween.delayedCall(0, callback, params), _parsePosition(this, position));
  } //ONLY for backward compatibility! Maybe delete?
  ;

  _proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
    vars.duration = duration;
    vars.stagger = vars.stagger || stagger;
    vars.onComplete = onCompleteAll;
    vars.onCompleteParams = onCompleteAllParams;
    vars.parent = this;
    new Tween(targets, vars, _parsePosition(this, position));
    return this;
  };

  _proto2.staggerFrom = function staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
    vars.runBackwards = 1;
    _inheritDefaults(vars).immediateRender = _isNotFalse(vars.immediateRender);
    return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams);
  };

  _proto2.staggerFromTo = function staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
    toVars.startAt = fromVars;
    _inheritDefaults(toVars).immediateRender = _isNotFalse(toVars.immediateRender);
    return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams);
  };

  _proto2.render = function render(totalTime, suppressEvents, force) {
    var prevTime = this._time,
        tDur = this._dirty ? this.totalDuration() : this._tDur,
        dur = this._dur,
        tTime = this !== _globalTimeline && totalTime > tDur - _tinyNum && totalTime >= 0 ? tDur : totalTime < _tinyNum ? 0 : totalTime,
        crossingStart = this._zTime < 0 !== totalTime < 0 && (this._initted || !dur),
        time,
        child,
        next,
        iteration,
        cycleDuration,
        prevPaused,
        pauseTween,
        timeScale,
        prevStart,
        prevIteration,
        yoyo,
        isYoyo;

    if (tTime !== this._tTime || force || crossingStart) {
      if (prevTime !== this._time && dur) {
        //if totalDuration() finds a child with a negative startTime and smoothChildTiming is true, things get shifted around internally so we need to adjust the time accordingly. For example, if a tween starts at -30 we must shift EVERYTHING forward 30 seconds and move this timeline's startTime backward by 30 seconds so that things align with the playhead (no jump).
        tTime += this._time - prevTime;
        totalTime += this._time - prevTime;
      }

      time = tTime;
      prevStart = this._start;
      timeScale = this._ts;
      prevPaused = !timeScale;

      if (crossingStart) {
        dur || (prevTime = this._zTime); //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect.

        (totalTime || !suppressEvents) && (this._zTime = totalTime);
      }

      if (this._repeat) {
        //adjust the time for repeats and yoyos
        yoyo = this._yoyo;
        cycleDuration = dur + this._rDelay;

        if (this._repeat < -1 && totalTime < 0) {
          return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
        }

        time = _round(tTime % cycleDuration); //round to avoid floating point errors. (4 % 0.8 should be 0 but some browsers report it as 0.79999999!)

        if (tTime === tDur) {
          // the tDur === tTime is for edge cases where there's a lengthy decimal on the duration and it may reach the very end but the time is rendered as not-quite-there (remember, tDur is rounded to 4 decimals whereas dur isn't)
          iteration = this._repeat;
          time = dur;
        } else {
          iteration = ~~(tTime / cycleDuration);

          if (iteration && iteration === tTime / cycleDuration) {
            time = dur;
            iteration--;
          }

          time > dur && (time = dur);
        }

        prevIteration = _animationCycle(this._tTime, cycleDuration);
        !prevTime && this._tTime && prevIteration !== iteration && (prevIteration = iteration); // edge case - if someone does addPause() at the very beginning of a repeating timeline, that pause is technically at the same spot as the end which causes this._time to get set to 0 when the totalTime would normally place the playhead at the end. See https://greensock.com/forums/topic/23823-closing-nav-animation-not-working-on-ie-and-iphone-6-maybe-other-older-browser/?tab=comments#comment-113005

        if (yoyo && iteration & 1) {
          time = dur - time;
          isYoyo = 1;
        }
        /*
        make sure children at the end/beginning of the timeline are rendered properly. If, for example,
        a 3-second long timeline rendered at 2.9 seconds previously, and now renders at 3.2 seconds (which
        would get translated to 2.8 seconds if the timeline yoyos or 0.2 seconds if it just repeats), there
        could be a callback or a short tween that's at 2.95 or 3 seconds in which wouldn't render. So
        we need to push the timeline to the end (and/or beginning depending on its yoyo value). Also we must
        ensure that zero-duration tweens at the very beginning or end of the Timeline work.
        */


        if (iteration !== prevIteration && !this._lock) {
          var rewinding = yoyo && prevIteration & 1,
              doesWrap = rewinding === (yoyo && iteration & 1);
          iteration < prevIteration && (rewinding = !rewinding);
          prevTime = rewinding ? 0 : dur;
          this._lock = 1;
          this.render(prevTime || (isYoyo ? 0 : _round(iteration * cycleDuration)), suppressEvents, !dur)._lock = 0;
          !suppressEvents && this.parent && _callback(this, "onRepeat");
          this.vars.repeatRefresh && !isYoyo && (this.invalidate()._lock = 1);

          if (prevTime !== this._time || prevPaused !== !this._ts) {
            return this;
          }

          dur = this._dur; // in case the duration changed in the onRepeat

          tDur = this._tDur;

          if (doesWrap) {
            this._lock = 2;
            prevTime = rewinding ? dur : -0.0001;
            this.render(prevTime, true);
            this.vars.repeatRefresh && !isYoyo && this.invalidate();
          }

          this._lock = 0;

          if (!this._ts && !prevPaused) {
            return this;
          } //in order for yoyoEase to work properly when there's a stagger, we must swap out the ease in each sub-tween.


          _propagateYoyoEase(this, isYoyo);
        }
      }

      if (this._hasPause && !this._forcing && this._lock < 2) {
        pauseTween = _findNextPauseTween(this, _round(prevTime), _round(time));

        if (pauseTween) {
          tTime -= time - (time = pauseTween._start);
        }
      }

      this._tTime = tTime;
      this._time = time;
      this._act = !timeScale; //as long as it's not paused, force it to be active so that if the user renders independent of the parent timeline, it'll be forced to re-render on the next tick.

      if (!this._initted) {
        this._onUpdate = this.vars.onUpdate;
        this._initted = 1;
        this._zTime = totalTime;
        prevTime = 0; // upon init, the playhead should always go forward; someone could invalidate() a completed timeline and then if they restart(), that would make child tweens render in reverse order which could lock in the wrong starting values if they build on each other, like tl.to(obj, {x: 100}).to(obj, {x: 0}).
      }

      !prevTime && (time || !dur && totalTime >= 0) && !suppressEvents && _callback(this, "onStart");

      if (time >= prevTime && totalTime >= 0) {
        child = this._first;

        while (child) {
          next = child._next;

          if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
            if (child.parent !== this) {
              // an extreme edge case - the child's render could do something like kill() the "next" one in the linked list, or reparent it. In that case we must re-initiate the whole render to be safe.
              return this.render(totalTime, suppressEvents, force);
            }

            child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);

            if (time !== this._time || !this._ts && !prevPaused) {
              //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
              pauseTween = 0;
              next && (tTime += this._zTime = -_tinyNum); // it didn't finish rendering, so flag zTime as negative so that so that the next time render() is called it'll be forced (to render any remaining children)

              break;
            }
          }

          child = next;
        }
      } else {
        child = this._last;
        var adjustedTime = totalTime < 0 ? totalTime : time; //when the playhead goes backward beyond the start of this timeline, we must pass that information down to the child animations so that zero-duration tweens know whether to render their starting or ending values.

        while (child) {
          next = child._prev;

          if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
            if (child.parent !== this) {
              // an extreme edge case - the child's render could do something like kill() the "next" one in the linked list, or reparent it. In that case we must re-initiate the whole render to be safe.
              return this.render(totalTime, suppressEvents, force);
            }

            child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force);

            if (time !== this._time || !this._ts && !prevPaused) {
              //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
              pauseTween = 0;
              next && (tTime += this._zTime = adjustedTime ? -_tinyNum : _tinyNum); // it didn't finish rendering, so adjust zTime so that so that the next time render() is called it'll be forced (to render any remaining children)

              break;
            }
          }

          child = next;
        }
      }

      if (pauseTween && !suppressEvents) {
        this.pause();
        pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime = time >= prevTime ? 1 : -1;

        if (this._ts) {
          //the callback resumed playback! So since we may have held back the playhead due to where the pause is positioned, go ahead and jump to where it's SUPPOSED to be (if no pause happened).
          this._start = prevStart; //if the pause was at an earlier time and the user resumed in the callback, it could reposition the timeline (changing its startTime), throwing things off slightly, so we make sure the _start doesn't shift.

          _setEnd(this);

          return this.render(totalTime, suppressEvents, force);
        }
      }

      this._onUpdate && !suppressEvents && _callback(this, "onUpdate", true);
      if (tTime === tDur && tDur >= this.totalDuration() || !tTime && prevTime) if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) if (!this._lock) {
        (totalTime || !dur) && (tTime === tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1); // don't remove if the timeline is reversed and the playhead isn't at 0, otherwise tl.progress(1).reverse() won't work. Only remove if the playhead is at the end and timeScale is positive, or if the playhead is at 0 and the timeScale is negative.

        if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime)) {
          _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);

          this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
        }
      }
    }

    return this;
  };

  _proto2.add = function add(child, position) {
    var _this2 = this;

    _isNumber(position) || (position = _parsePosition(this, position));

    if (!(child instanceof Animation)) {
      if (_isArray(child)) {
        child.forEach(function (obj) {
          return _this2.add(obj, position);
        });
        return this;
      }

      if (_isString(child)) {
        return this.addLabel(child, position);
      }

      if (_isFunction(child)) {
        child = Tween.delayedCall(0, child);
      } else {
        return this;
      }
    }

    return this !== child ? _addToTimeline(this, child, position) : this; //don't allow a timeline to be added to itself as a child!
  };

  _proto2.getChildren = function getChildren(nested, tweens, timelines, ignoreBeforeTime) {
    if (nested === void 0) {
      nested = true;
    }

    if (tweens === void 0) {
      tweens = true;
    }

    if (timelines === void 0) {
      timelines = true;
    }

    if (ignoreBeforeTime === void 0) {
      ignoreBeforeTime = -_bigNum;
    }

    var a = [],
        child = this._first;

    while (child) {
      if (child._start >= ignoreBeforeTime) {
        if (child instanceof Tween) {
          tweens && a.push(child);
        } else {
          timelines && a.push(child);
          nested && a.push.apply(a, child.getChildren(true, tweens, timelines));
        }
      }

      child = child._next;
    }

    return a;
  };

  _proto2.getById = function getById(id) {
    var animations = this.getChildren(1, 1, 1),
        i = animations.length;

    while (i--) {
      if (animations[i].vars.id === id) {
        return animations[i];
      }
    }
  };

  _proto2.remove = function remove(child) {
    if (_isString(child)) {
      return this.removeLabel(child);
    }

    if (_isFunction(child)) {
      return this.killTweensOf(child);
    }

    _removeLinkedListItem(this, child);

    if (child === this._recent) {
      this._recent = this._last;
    }

    return _uncache(this);
  };

  _proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
    if (!arguments.length) {
      return this._tTime;
    }

    this._forcing = 1;

    if (!this._dp && this._ts) {
      //special case for the global timeline (or any other that has no parent or detached parent).
      this._start = _round(_ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts));
    }

    _Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);

    this._forcing = 0;
    return this;
  };

  _proto2.addLabel = function addLabel(label, position) {
    this.labels[label] = _parsePosition(this, position);
    return this;
  };

  _proto2.removeLabel = function removeLabel(label) {
    delete this.labels[label];
    return this;
  };

  _proto2.addPause = function addPause(position, callback, params) {
    var t = Tween.delayedCall(0, callback || _emptyFunc, params);
    t.data = "isPause";
    this._hasPause = 1;
    return _addToTimeline(this, t, _parsePosition(this, position));
  };

  _proto2.removePause = function removePause(position) {
    var child = this._first;
    position = _parsePosition(this, position);

    while (child) {
      if (child._start === position && child.data === "isPause") {
        _removeFromParent(child);
      }

      child = child._next;
    }
  };

  _proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
    var tweens = this.getTweensOf(targets, onlyActive),
        i = tweens.length;

    while (i--) {
      _overwritingTween !== tweens[i] && tweens[i].kill(targets, props);
    }

    return this;
  };

  _proto2.getTweensOf = function getTweensOf(targets, onlyActive) {
    var a = [],
        parsedTargets = toArray(targets),
        child = this._first,
        isGlobalTime = _isNumber(onlyActive),
        // a number is interpreted as a global time. If the animation spans
    children;

    while (child) {
      if (child instanceof Tween) {
        if (_arrayContainsAny(child._targets, parsedTargets) && (isGlobalTime ? (!_overwritingTween || child._initted && child._ts) && child.globalTime(0) <= onlyActive && child.globalTime(child.totalDuration()) > onlyActive : !onlyActive || child.isActive())) {
          // note: if this is for overwriting, it should only be for tweens that aren't paused and are initted.
          a.push(child);
        }
      } else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) {
        a.push.apply(a, children);
      }

      child = child._next;
    }

    return a;
  } // potential future feature - targets() on timelines
  // targets() {
  // 	let result = [];
  // 	this.getChildren(true, true, false).forEach(t => result.push(...t.targets()));
  // 	return result;
  // }
  ;

  _proto2.tweenTo = function tweenTo(position, vars) {
    vars = vars || {};

    var tl = this,
        endTime = _parsePosition(tl, position),
        _vars = vars,
        startAt = _vars.startAt,
        _onStart = _vars.onStart,
        onStartParams = _vars.onStartParams,
        immediateRender = _vars.immediateRender,
        tween = Tween.to(tl, _setDefaults({
      ease: "none",
      lazy: false,
      immediateRender: false,
      time: endTime,
      overwrite: "auto",
      duration: vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale()) || _tinyNum,
      onStart: function onStart() {
        tl.pause();
        var duration = vars.duration || Math.abs((endTime - tl._time) / tl.timeScale());
        tween._dur !== duration && _setDuration(tween, duration, 0, 1).render(tween._time, true, true);
        _onStart && _onStart.apply(tween, onStartParams || []); //in case the user had an onStart in the vars - we don't want to overwrite it.
      }
    }, vars));

    return immediateRender ? tween.render(0) : tween;
  };

  _proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
    return this.tweenTo(toPosition, _setDefaults({
      startAt: {
        time: _parsePosition(this, fromPosition)
      }
    }, vars));
  };

  _proto2.recent = function recent() {
    return this._recent;
  };

  _proto2.nextLabel = function nextLabel(afterTime) {
    if (afterTime === void 0) {
      afterTime = this._time;
    }

    return _getLabelInDirection(this, _parsePosition(this, afterTime));
  };

  _proto2.previousLabel = function previousLabel(beforeTime) {
    if (beforeTime === void 0) {
      beforeTime = this._time;
    }

    return _getLabelInDirection(this, _parsePosition(this, beforeTime), 1);
  };

  _proto2.currentLabel = function currentLabel(value) {
    return arguments.length ? this.seek(value, true) : this.previousLabel(this._time + _tinyNum);
  };

  _proto2.shiftChildren = function shiftChildren(amount, adjustLabels, ignoreBeforeTime) {
    if (ignoreBeforeTime === void 0) {
      ignoreBeforeTime = 0;
    }

    var child = this._first,
        labels = this.labels,
        p;

    while (child) {
      if (child._start >= ignoreBeforeTime) {
        child._start += amount;
        child._end += amount;
      }

      child = child._next;
    }

    if (adjustLabels) {
      for (p in labels) {
        if (labels[p] >= ignoreBeforeTime) {
          labels[p] += amount;
        }
      }
    }

    return _uncache(this);
  };

  _proto2.invalidate = function invalidate() {
    var child = this._first;
    this._lock = 0;

    while (child) {
      child.invalidate();
      child = child._next;
    }

    return _Animation.prototype.invalidate.call(this);
  };

  _proto2.clear = function clear(includeLabels) {
    if (includeLabels === void 0) {
      includeLabels = true;
    }

    var child = this._first,
        next;

    while (child) {
      next = child._next;
      this.remove(child);
      child = next;
    }

    this._dp && (this._time = this._tTime = this._pTime = 0);
    includeLabels && (this.labels = {});
    return _uncache(this);
  };

  _proto2.totalDuration = function totalDuration(value) {
    var max = 0,
        self = this,
        child = self._last,
        prevStart = _bigNum,
        prev,
        start,
        parent;

    if (arguments.length) {
      return self.timeScale((self._repeat < 0 ? self.duration() : self.totalDuration()) / (self.reversed() ? -value : value));
    }

    if (self._dirty) {
      parent = self.parent;

      while (child) {
        prev = child._prev; //record it here in case the tween changes position in the sequence...

        child._dirty && child.totalDuration(); //could change the tween._startTime, so make sure the animation's cache is clean before analyzing it.

        start = child._start;

        if (start > prevStart && self._sort && child._ts && !self._lock) {
          //in case one of the tweens shifted out of order, it needs to be re-inserted into the correct position in the sequence
          self._lock = 1; //prevent endless recursive calls - there are methods that get triggered that check duration/totalDuration when we add().

          _addToTimeline(self, child, start - child._delay, 1)._lock = 0;
        } else {
          prevStart = start;
        }

        if (start < 0 && child._ts) {
          //children aren't allowed to have negative startTimes unless smoothChildTiming is true, so adjust here if one is found.
          max -= start;

          if (!parent && !self._dp || parent && parent.smoothChildTiming) {
            self._start += start / self._ts;
            self._time -= start;
            self._tTime -= start;
          }

          self.shiftChildren(-start, false, -1e999);
          prevStart = 0;
        }

        child._end > max && child._ts && (max = child._end);
        child = prev;
      }

      _setDuration(self, self === _globalTimeline && self._time > max ? self._time : max, 1, 1);

      self._dirty = 0;
    }

    return self._tDur;
  };

  Timeline.updateRoot = function updateRoot(time) {
    if (_globalTimeline._ts) {
      _lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));

      _lastRenderedFrame = _ticker.frame;
    }

    if (_ticker.frame >= _nextGCFrame) {
      _nextGCFrame += _config.autoSleep || 120;
      var child = _globalTimeline._first;
      if (!child || !child._ts) if (_config.autoSleep && _ticker._listeners.length < 2) {
        while (child && !child._ts) {
          child = child._next;
        }

        child || _ticker.sleep();
      }
    }
  };

  return Timeline;
}(Animation);

exports.TimelineLite = exports.TimelineMax = exports.Timeline = Timeline;

_setDefaults(Timeline.prototype, {
  _lock: 0,
  _hasPause: 0,
  _forcing: 0
});

var _addComplexStringPropTween = function _addComplexStringPropTween(target, prop, start, end, setter, stringFilter, funcParam) {
  //note: we call _addComplexStringPropTween.call(tweenInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.
  var pt = new PropTween(this._pt, target, prop, 0, 1, _renderComplexString, null, setter),
      index = 0,
      matchIndex = 0,
      result,
      startNums,
      color,
      endNum,
      chunk,
      startNum,
      hasRandom,
      a;
  pt.b = start;
  pt.e = end;
  start += ""; //ensure values are strings

  end += "";

  if (hasRandom = ~end.indexOf("random(")) {
    end = _replaceRandom(end);
  }

  if (stringFilter) {
    a = [start, end];
    stringFilter(a, target, prop); //pass an array with the starting and ending values and let the filter do whatever it needs to the values.

    start = a[0];
    end = a[1];
  }

  startNums = start.match(_complexStringNumExp) || [];

  while (result = _complexStringNumExp.exec(end)) {
    endNum = result[0];
    chunk = end.substring(index, result.index);

    if (color) {
      color = (color + 1) % 5;
    } else if (chunk.substr(-5) === "rgba(") {
      color = 1;
    }

    if (endNum !== startNums[matchIndex++]) {
      startNum = parseFloat(startNums[matchIndex - 1]) || 0; //these nested PropTweens are handled in a special way - we'll never actually call a render or setter method on them. We'll just loop through them in the parent complex string PropTween's render method.

      pt._pt = {
        _next: pt._pt,
        p: chunk || matchIndex === 1 ? chunk : ",",
        //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
        s: startNum,
        c: endNum.charAt(1) === "=" ? parseFloat(endNum.substr(2)) * (endNum.charAt(0) === "-" ? -1 : 1) : parseFloat(endNum) - startNum,
        m: color && color < 4 ? Math.round : 0
      };
      index = _complexStringNumExp.lastIndex;
    }
  }

  pt.c = index < end.length ? end.substring(index, end.length) : ""; //we use the "c" of the PropTween to store the final part of the string (after the last number)

  pt.fp = funcParam;

  if (_relExp.test(end) || hasRandom) {
    pt.e = 0; //if the end string contains relative values or dynamic random(...) values, delete the end it so that on the final render we don't actually set it to the string with += or -= characters (forces it to use the calculated value).
  }

  this._pt = pt; //start the linked list with this new PropTween. Remember, we call _addComplexStringPropTween.call(tweenInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.

  return pt;
},
    _addPropTween = function _addPropTween(target, prop, start, end, index, targets, modifier, stringFilter, funcParam) {
  _isFunction(end) && (end = end(index || 0, target, targets));
  var currentValue = target[prop],
      parsedStart = start !== "get" ? start : !_isFunction(currentValue) ? currentValue : funcParam ? target[prop.indexOf("set") || !_isFunction(target["get" + prop.substr(3)]) ? prop : "get" + prop.substr(3)](funcParam) : target[prop](),
      setter = !_isFunction(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc,
      pt;

  if (_isString(end)) {
    if (~end.indexOf("random(")) {
      end = _replaceRandom(end);
    }

    if (end.charAt(1) === "=") {
      end = parseFloat(parsedStart) + parseFloat(end.substr(2)) * (end.charAt(0) === "-" ? -1 : 1) + (getUnit(parsedStart) || 0);
    }
  }

  if (parsedStart !== end) {
    if (!isNaN(parsedStart * end)) {
      pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === "boolean" ? _renderBoolean : _renderPlain, 0, setter);
      funcParam && (pt.fp = funcParam);
      modifier && pt.modifier(modifier, this, target);
      return this._pt = pt;
    }

    !currentValue && !(prop in target) && _missingPlugin(prop, end);
    return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config.stringFilter, funcParam);
  }
},
    //creates a copy of the vars object and processes any function-based values (putting the resulting values directly into the copy) as well as strings with "random()" in them. It does NOT process relative values.
_processVars = function _processVars(vars, index, target, targets, tween) {
  _isFunction(vars) && (vars = _parseFuncOrString(vars, tween, index, target, targets));

  if (!_isObject(vars) || vars.style && vars.nodeType || _isArray(vars) || _isTypedArray(vars)) {
    return _isString(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars;
  }

  var copy = {},
      p;

  for (p in vars) {
    copy[p] = _parseFuncOrString(vars[p], tween, index, target, targets);
  }

  return copy;
},
    _checkPlugin = function _checkPlugin(property, vars, tween, index, target, targets) {
  var plugin, pt, ptLookup, i;

  if (_plugins[property] && (plugin = new _plugins[property]()).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index, target, targets, tween), tween, index, targets) !== false) {
    tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority);

    if (tween !== _quickTween) {
      ptLookup = tween._ptLookup[tween._targets.indexOf(target)]; //note: we can't use tween._ptLookup[index] because for staggered tweens, the index from the fullTargets array won't match what it is in each individual tween that spawns from the stagger.

      i = plugin._props.length;

      while (i--) {
        ptLookup[plugin._props[i]] = pt;
      }
    }
  }

  return plugin;
},
    _overwritingTween,
    //store a reference temporarily so we can avoid overwriting itself.
_initTween = function _initTween(tween, time) {
  var vars = tween.vars,
      ease = vars.ease,
      startAt = vars.startAt,
      immediateRender = vars.immediateRender,
      lazy = vars.lazy,
      onUpdate = vars.onUpdate,
      onUpdateParams = vars.onUpdateParams,
      callbackScope = vars.callbackScope,
      runBackwards = vars.runBackwards,
      yoyoEase = vars.yoyoEase,
      keyframes = vars.keyframes,
      autoRevert = vars.autoRevert,
      dur = tween._dur,
      prevStartAt = tween._startAt,
      targets = tween._targets,
      parent = tween.parent,
      fullTargets = parent && parent.data === "nested" ? parent.parent._targets : targets,
      autoOverwrite = tween._overwrite === "auto" && !_suppressOverwrites,
      tl = tween.timeline,
      cleanVars,
      i,
      p,
      pt,
      target,
      hasPriority,
      gsData,
      harness,
      plugin,
      ptLookup,
      index,
      harnessVars,
      overwritten;
  tl && (!keyframes || !ease) && (ease = "none");
  tween._ease = _parseEase(ease, _defaults.ease);
  tween._yEase = yoyoEase ? _invertEase(_parseEase(yoyoEase === true ? ease : yoyoEase, _defaults.ease)) : 0;

  if (yoyoEase && tween._yoyo && !tween._repeat) {
    //there must have been a parent timeline with yoyo:true that is currently in its yoyo phase, so flip the eases.
    yoyoEase = tween._yEase;
    tween._yEase = tween._ease;
    tween._ease = yoyoEase;
  }

  if (!tl) {
    //if there's an internal timeline, skip all the parsing because we passed that task down the chain.
    harness = targets[0] ? _getCache(targets[0]).harness : 0;
    harnessVars = harness && vars[harness.prop]; //someone may need to specify CSS-specific values AND non-CSS values, like if the element has an "x" property plus it's a standard DOM element. We allow people to distinguish by wrapping plugin-specific stuff in a css:{} object for example.

    cleanVars = _copyExcluding(vars, _reservedProps);
    prevStartAt && prevStartAt.render(-1, true).kill();

    if (startAt) {
      _removeFromParent(tween._startAt = Tween.set(targets, _setDefaults({
        data: "isStart",
        overwrite: false,
        parent: parent,
        immediateRender: true,
        lazy: _isNotFalse(lazy),
        startAt: null,
        delay: 0,
        onUpdate: onUpdate,
        onUpdateParams: onUpdateParams,
        callbackScope: callbackScope,
        stagger: 0
      }, startAt))); //copy the properties/values into a new object to avoid collisions, like var to = {x:0}, from = {x:500}; timeline.fromTo(e, from, to).fromTo(e, to, from);


      if (immediateRender) {
        if (time > 0) {
          autoRevert || (tween._startAt = 0); //tweens that render immediately (like most from() and fromTo() tweens) shouldn't revert when their parent timeline's playhead goes backward past the startTime because the initial render could have happened anytime and it shouldn't be directly correlated to this tween's startTime. Imagine setting up a complex animation where the beginning states of various objects are rendered immediately but the tween doesn't happen for quite some time - if we revert to the starting values as soon as the playhead goes backward past the tween's startTime, it will throw things off visually. Reversion should only happen in Timeline instances where immediateRender was false or when autoRevert is explicitly set to true.
        } else if (dur && !(time < 0 && prevStartAt)) {
          time && (tween._zTime = time);
          return; //we skip initialization here so that overwriting doesn't occur until the tween actually begins. Otherwise, if you create several immediateRender:true tweens of the same target/properties to drop into a Timeline, the last one created would overwrite the first ones because they didn't get placed into the timeline yet before the first render occurs and kicks in overwriting.
        }
      }
    } else if (runBackwards && dur) {
      //from() tweens must be handled uniquely: their beginning values must be rendered but we don't want overwriting to occur yet (when time is still 0). Wait until the tween actually begins before doing all the routines like overwriting. At that time, we should render at the END of the tween to ensure that things initialize correctly (remember, from() tweens go backwards)
      if (prevStartAt) {
        !autoRevert && (tween._startAt = 0);
      } else {
        time && (immediateRender = false); //in rare cases (like if a from() tween runs and then is invalidate()-ed), immediateRender could be true but the initial forced-render gets skipped, so there's no need to force the render in this context when the _time is greater than 0

        p = _setDefaults({
          overwrite: false,
          data: "isFromStart",
          //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
          lazy: immediateRender && _isNotFalse(lazy),
          immediateRender: immediateRender,
          //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
          stagger: 0,
          parent: parent //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y:gsap.utils.wrap([-100,100])})

        }, cleanVars);
        harnessVars && (p[harness.prop] = harnessVars); // in case someone does something like .from(..., {css:{}})

        _removeFromParent(tween._startAt = Tween.set(targets, p));

        if (!immediateRender) {
          _initTween(tween._startAt, _tinyNum); //ensures that the initial values are recorded

        } else if (!time) {
          return;
        }
      }
    }

    tween._pt = 0;
    lazy = dur && _isNotFalse(lazy) || lazy && !dur;

    for (i = 0; i < targets.length; i++) {
      target = targets[i];
      gsData = target._gsap || _harness(targets)[i]._gsap;
      tween._ptLookup[i] = ptLookup = {};
      _lazyLookup[gsData.id] && _lazyTweens.length && _lazyRender(); //if other tweens of the same target have recently initted but haven't rendered yet, we've got to force the render so that the starting values are correct (imagine populating a timeline with a bunch of sequential tweens and then jumping to the end)

      index = fullTargets === targets ? i : fullTargets.indexOf(target);

      if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== false) {
        tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);

        plugin._props.forEach(function (name) {
          ptLookup[name] = pt;
        });

        plugin.priority && (hasPriority = 1);
      }

      if (!harness || harnessVars) {
        for (p in cleanVars) {
          if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index, target, fullTargets))) {
            plugin.priority && (hasPriority = 1);
          } else {
            ptLookup[p] = pt = _addPropTween.call(tween, target, p, "get", cleanVars[p], index, fullTargets, 0, vars.stringFilter);
          }
        }
      }

      tween._op && tween._op[i] && tween.kill(target, tween._op[i]);

      if (autoOverwrite && tween._pt) {
        _overwritingTween = tween;

        _globalTimeline.killTweensOf(target, ptLookup, tween.globalTime(0)); //Also make sure the overwriting doesn't overwrite THIS tween!!!


        overwritten = !tween.parent;
        _overwritingTween = 0;
      }

      tween._pt && lazy && (_lazyLookup[gsData.id] = 1);
    }

    hasPriority && _sortPropTweensByPriority(tween);
    tween._onInit && tween._onInit(tween); //plugins like RoundProps must wait until ALL of the PropTweens are instantiated. In the plugin's init() function, it sets the _onInit on the tween instance. May not be pretty/intuitive, but it's fast and keeps file size down.
  }

  tween._from = !tl && !!vars.runBackwards; //nested timelines should never run backwards - the backwards-ness is in the child tweens.

  tween._onUpdate = onUpdate;
  tween._initted = (!tween._op || tween._pt) && !overwritten; // if overwrittenProps resulted in the entire tween being killed, do NOT flag it as initted or else it may render for one tick.
},
    _addAliasesToVars = function _addAliasesToVars(targets, vars) {
  var harness = targets[0] ? _getCache(targets[0]).harness : 0,
      propertyAliases = harness && harness.aliases,
      copy,
      p,
      i,
      aliases;

  if (!propertyAliases) {
    return vars;
  }

  copy = _merge({}, vars);

  for (p in propertyAliases) {
    if (p in copy) {
      aliases = propertyAliases[p].split(",");
      i = aliases.length;

      while (i--) {
        copy[aliases[i]] = copy[p];
      }
    }
  }

  return copy;
},
    _parseFuncOrString = function _parseFuncOrString(value, tween, i, target, targets) {
  return _isFunction(value) ? value.call(tween, i, target, targets) : _isString(value) && ~value.indexOf("random(") ? _replaceRandom(value) : value;
},
    _staggerTweenProps = _callbackNames + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase",
    _staggerPropsToSkip = (_staggerTweenProps + ",id,stagger,delay,duration,paused,scrollTrigger").split(",");
/*
 * --------------------------------------------------------------------------------------
 * TWEEN
 * --------------------------------------------------------------------------------------
 */


exports._checkPlugin = _checkPlugin;

var Tween = /*#__PURE__*/function (_Animation2) {
  _inheritsLoose(Tween, _Animation2);

  function Tween(targets, vars, time, skipInherit) {
    var _this3;

    if (typeof vars === "number") {
      time.duration = vars;
      vars = time;
      time = null;
    }

    _this3 = _Animation2.call(this, skipInherit ? vars : _inheritDefaults(vars), time) || this;
    var _this3$vars = _this3.vars,
        duration = _this3$vars.duration,
        delay = _this3$vars.delay,
        immediateRender = _this3$vars.immediateRender,
        stagger = _this3$vars.stagger,
        overwrite = _this3$vars.overwrite,
        keyframes = _this3$vars.keyframes,
        defaults = _this3$vars.defaults,
        scrollTrigger = _this3$vars.scrollTrigger,
        yoyoEase = _this3$vars.yoyoEase,
        parent = _this3.parent,
        parsedTargets = (_isArray(targets) || _isTypedArray(targets) ? _isNumber(targets[0]) : "length" in vars) ? [targets] : toArray(targets),
        tl,
        i,
        copy,
        l,
        p,
        curTarget,
        staggerFunc,
        staggerVarsToMerge;
    _this3._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://greensock.com", !_config.nullTargetWarn) || [];
    _this3._ptLookup = []; //PropTween lookup. An array containing an object for each target, having keys for each tweening property

    _this3._overwrite = overwrite;

    if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
      vars = _this3.vars;
      tl = _this3.timeline = new Timeline({
        data: "nested",
        defaults: defaults || {}
      });
      tl.kill();
      tl.parent = tl._dp = _assertThisInitialized(_this3);
      tl._start = 0;

      if (keyframes) {
        _setDefaults(tl.vars.defaults, {
          ease: "none"
        });

        keyframes.forEach(function (frame) {
          return tl.to(parsedTargets, frame, ">");
        });
      } else {
        l = parsedTargets.length;
        staggerFunc = stagger ? distribute(stagger) : _emptyFunc;

        if (_isObject(stagger)) {
          //users can pass in callbacks like onStart/onComplete in the stagger object. These should fire with each individual tween.
          for (p in stagger) {
            if (~_staggerTweenProps.indexOf(p)) {
              staggerVarsToMerge || (staggerVarsToMerge = {});
              staggerVarsToMerge[p] = stagger[p];
            }
          }
        }

        for (i = 0; i < l; i++) {
          copy = {};

          for (p in vars) {
            if (_staggerPropsToSkip.indexOf(p) < 0) {
              copy[p] = vars[p];
            }
          }

          copy.stagger = 0;
          yoyoEase && (copy.yoyoEase = yoyoEase);
          staggerVarsToMerge && _merge(copy, staggerVarsToMerge);
          curTarget = parsedTargets[i]; //don't just copy duration or delay because if they're a string or function, we'd end up in an infinite loop because _isFuncOrString() would evaluate as true in the child tweens, entering this loop, etc. So we parse the value straight from vars and default to 0.

          copy.duration = +_parseFuncOrString(duration, _assertThisInitialized(_this3), i, curTarget, parsedTargets);
          copy.delay = (+_parseFuncOrString(delay, _assertThisInitialized(_this3), i, curTarget, parsedTargets) || 0) - _this3._delay;

          if (!stagger && l === 1 && copy.delay) {
            // if someone does delay:"random(1, 5)", repeat:-1, for example, the delay shouldn't be inside the repeat.
            _this3._delay = delay = copy.delay;
            _this3._start += delay;
            copy.delay = 0;
          }

          tl.to(curTarget, copy, staggerFunc(i, curTarget, parsedTargets));
        }

        tl.duration() ? duration = delay = 0 : _this3.timeline = 0; // if the timeline's duration is 0, we don't need a timeline internally!
      }

      duration || _this3.duration(duration = tl.duration());
    } else {
      _this3.timeline = 0; //speed optimization, faster lookups (no going up the prototype chain)
    }

    if (overwrite === true && !_suppressOverwrites) {
      _overwritingTween = _assertThisInitialized(_this3);

      _globalTimeline.killTweensOf(parsedTargets);

      _overwritingTween = 0;
    }

    parent && _postAddChecks(parent, _assertThisInitialized(_this3));

    if (immediateRender || !duration && !keyframes && _this3._start === _round(parent._time) && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized(_this3)) && parent.data !== "nested") {
      _this3._tTime = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)

      _this3.render(Math.max(0, -delay)); //in case delay is negative

    }

    scrollTrigger && _scrollTrigger(_assertThisInitialized(_this3), scrollTrigger);
    return _this3;
  }

  var _proto3 = Tween.prototype;

  _proto3.render = function render(totalTime, suppressEvents, force) {
    var prevTime = this._time,
        tDur = this._tDur,
        dur = this._dur,
        tTime = totalTime > tDur - _tinyNum && totalTime >= 0 ? tDur : totalTime < _tinyNum ? 0 : totalTime,
        time,
        pt,
        iteration,
        cycleDuration,
        prevIteration,
        isYoyo,
        ratio,
        timeline,
        yoyoEase;

    if (!dur) {
      _renderZeroDurationTween(this, totalTime, suppressEvents, force);
    } else if (tTime !== this._tTime || !totalTime || force || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== totalTime < 0) {
      //this senses if we're crossing over the start time, in which case we must record _zTime and force the render, but we do it in this lengthy conditional way for performance reasons (usually we can skip the calculations): this._initted && (this._zTime < 0) !== (totalTime < 0)
      time = tTime;
      timeline = this.timeline;

      if (this._repeat) {
        //adjust the time for repeats and yoyos
        cycleDuration = dur + this._rDelay;

        if (this._repeat < -1 && totalTime < 0) {
          return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
        }

        time = _round(tTime % cycleDuration); //round to avoid floating point errors. (4 % 0.8 should be 0 but some browsers report it as 0.79999999!)

        if (tTime === tDur) {
          // the tDur === tTime is for edge cases where there's a lengthy decimal on the duration and it may reach the very end but the time is rendered as not-quite-there (remember, tDur is rounded to 4 decimals whereas dur isn't)
          iteration = this._repeat;
          time = dur;
        } else {
          iteration = ~~(tTime / cycleDuration);

          if (iteration && iteration === tTime / cycleDuration) {
            time = dur;
            iteration--;
          }

          time > dur && (time = dur);
        }

        isYoyo = this._yoyo && iteration & 1;

        if (isYoyo) {
          yoyoEase = this._yEase;
          time = dur - time;
        }

        prevIteration = _animationCycle(this._tTime, cycleDuration);

        if (time === prevTime && !force && this._initted) {
          //could be during the repeatDelay part. No need to render and fire callbacks.
          return this;
        }

        if (iteration !== prevIteration) {
          timeline && this._yEase && _propagateYoyoEase(timeline, isYoyo); //repeatRefresh functionality

          if (this.vars.repeatRefresh && !isYoyo && !this._lock) {
            this._lock = force = 1; //force, otherwise if lazy is true, the _attemptInitTween() will return and we'll jump out and get caught bouncing on each tick.

            this.render(_round(cycleDuration * iteration), true).invalidate()._lock = 0;
          }
        }
      }

      if (!this._initted) {
        if (_attemptInitTween(this, totalTime < 0 ? totalTime : time, force, suppressEvents)) {
          this._tTime = 0; // in constructor if immediateRender is true, we set _tTime to -_tinyNum to have the playhead cross the starting point but we can't leave _tTime as a negative number.

          return this;
        }

        if (dur !== this._dur) {
          // while initting, a plugin like InertiaPlugin might alter the duration, so rerun from the start to ensure everything renders as it should.
          return this.render(totalTime, suppressEvents, force);
        }
      }

      this._tTime = tTime;
      this._time = time;

      if (!this._act && this._ts) {
        this._act = 1; //as long as it's not paused, force it to be active so that if the user renders independent of the parent timeline, it'll be forced to re-render on the next tick.

        this._lazy = 0;
      }

      this.ratio = ratio = (yoyoEase || this._ease)(time / dur);

      if (this._from) {
        this.ratio = ratio = 1 - ratio;
      }

      time && !prevTime && !suppressEvents && _callback(this, "onStart");
      pt = this._pt;

      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }

      timeline && timeline.render(totalTime < 0 ? totalTime : !time && isYoyo ? -_tinyNum : timeline._dur * ratio, suppressEvents, force) || this._startAt && (this._zTime = totalTime);

      if (this._onUpdate && !suppressEvents) {
        totalTime < 0 && this._startAt && this._startAt.render(totalTime, true, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.

        _callback(this, "onUpdate");
      }

      this._repeat && iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent && _callback(this, "onRepeat");

      if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
        totalTime < 0 && this._startAt && !this._onUpdate && this._startAt.render(totalTime, true, true);
        (totalTime || !dur) && (tTime === this._tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1); // don't remove if we're rendering at exactly a time of 0, as there could be autoRevert values that should get set on the next tick (if the playhead goes backward beyond the startTime, negative totalTime). Don't remove if the timeline is reversed and the playhead isn't at 0, otherwise tl.progress(1).reverse() won't work. Only remove if the playhead is at the end and timeScale is positive, or if the playhead is at 0 and the timeScale is negative.

        if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime)) {
          // if prevTime and tTime are zero, we shouldn't fire the onReverseComplete. This could happen if you gsap.to(... {paused:true}).play();
          _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);

          this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
        }
      }
    }

    return this;
  };

  _proto3.targets = function targets() {
    return this._targets;
  };

  _proto3.invalidate = function invalidate() {
    this._pt = this._op = this._startAt = this._onUpdate = this._lazy = this.ratio = 0;
    this._ptLookup = [];
    this.timeline && this.timeline.invalidate();
    return _Animation2.prototype.invalidate.call(this);
  };

  _proto3.kill = function kill(targets, vars) {
    if (vars === void 0) {
      vars = "all";
    }

    if (!targets && (!vars || vars === "all")) {
      this._lazy = this._pt = 0;
      return this.parent ? _interrupt(this) : this;
    }

    if (this.timeline) {
      var tDur = this.timeline.totalDuration();
      this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== true)._first || _interrupt(this); // if nothing is left tweening, interrupt.

      this.parent && tDur !== this.timeline.totalDuration() && _setDuration(this, this._dur * this.timeline._tDur / tDur, 0, 1); // if a nested tween is killed that changes the duration, it should affect this tween's duration. We must use the ratio, though, because sometimes the internal timeline is stretched like for keyframes where they don't all add up to whatever the parent tween's duration was set to.

      return this;
    }

    var parsedTargets = this._targets,
        killingTargets = targets ? toArray(targets) : parsedTargets,
        propTweenLookup = this._ptLookup,
        firstPT = this._pt,
        overwrittenProps,
        curLookup,
        curOverwriteProps,
        props,
        p,
        pt,
        i;

    if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
      vars === "all" && (this._pt = 0);
      return _interrupt(this);
    }

    overwrittenProps = this._op = this._op || [];

    if (vars !== "all") {
      //so people can pass in a comma-delimited list of property names
      if (_isString(vars)) {
        p = {};

        _forEachName(vars, function (name) {
          return p[name] = 1;
        });

        vars = p;
      }

      vars = _addAliasesToVars(parsedTargets, vars);
    }

    i = parsedTargets.length;

    while (i--) {
      if (~killingTargets.indexOf(parsedTargets[i])) {
        curLookup = propTweenLookup[i];

        if (vars === "all") {
          overwrittenProps[i] = vars;
          props = curLookup;
          curOverwriteProps = {};
        } else {
          curOverwriteProps = overwrittenProps[i] = overwrittenProps[i] || {};
          props = vars;
        }

        for (p in props) {
          pt = curLookup && curLookup[p];

          if (pt) {
            if (!("kill" in pt.d) || pt.d.kill(p) === true) {
              _removeLinkedListItem(this, pt, "_pt");
            }

            delete curLookup[p];
          }

          if (curOverwriteProps !== "all") {
            curOverwriteProps[p] = 1;
          }
        }
      }
    }

    this._initted && !this._pt && firstPT && _interrupt(this); //if all tweening properties are killed, kill the tween. Without this line, if there's a tween with multiple targets and then you killTweensOf() each target individually, the tween would technically still remain active and fire its onComplete even though there aren't any more properties tweening.

    return this;
  };

  Tween.to = function to(targets, vars) {
    return new Tween(targets, vars, arguments[2]);
  };

  Tween.from = function from(targets, vars) {
    return new Tween(targets, _parseVars(arguments, 1));
  };

  Tween.delayedCall = function delayedCall(delay, callback, params, scope) {
    return new Tween(callback, 0, {
      immediateRender: false,
      lazy: false,
      overwrite: false,
      delay: delay,
      onComplete: callback,
      onReverseComplete: callback,
      onCompleteParams: params,
      onReverseCompleteParams: params,
      callbackScope: scope
    });
  };

  Tween.fromTo = function fromTo(targets, fromVars, toVars) {
    return new Tween(targets, _parseVars(arguments, 2));
  };

  Tween.set = function set(targets, vars) {
    vars.duration = 0;
    vars.repeatDelay || (vars.repeat = 0);
    return new Tween(targets, vars);
  };

  Tween.killTweensOf = function killTweensOf(targets, props, onlyActive) {
    return _globalTimeline.killTweensOf(targets, props, onlyActive);
  };

  return Tween;
}(Animation);

exports.TweenLite = exports.TweenMax = exports.Tween = Tween;

_setDefaults(Tween.prototype, {
  _targets: [],
  _lazy: 0,
  _startAt: 0,
  _op: 0,
  _onInit: 0
}); //add the pertinent timeline methods to Tween instances so that users can chain conveniently and create a timeline automatically. (removed due to concerns that it'd ultimately add to more confusion especially for beginners)
// _forEachName("to,from,fromTo,set,call,add,addLabel,addPause", name => {
// 	Tween.prototype[name] = function() {
// 		let tl = new Timeline();
// 		return _addToTimeline(tl, this)[name].apply(tl, toArray(arguments));
// 	}
// });
//for backward compatibility. Leverage the timeline calls.


_forEachName("staggerTo,staggerFrom,staggerFromTo", function (name) {
  Tween[name] = function () {
    var tl = new Timeline(),
        params = _slice.call(arguments, 0);

    params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
    return tl[name].apply(tl, params);
  };
});
/*
 * --------------------------------------------------------------------------------------
 * PROPTWEEN
 * --------------------------------------------------------------------------------------
 */


var _setterPlain = function _setterPlain(target, property, value) {
  return target[property] = value;
},
    _setterFunc = function _setterFunc(target, property, value) {
  return target[property](value);
},
    _setterFuncWithParam = function _setterFuncWithParam(target, property, value, data) {
  return target[property](data.fp, value);
},
    _setterAttribute = function _setterAttribute(target, property, value) {
  return target.setAttribute(property, value);
},
    _getSetter = function _getSetter(target, property) {
  return _isFunction(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain;
},
    _renderPlain = function _renderPlain(ratio, data) {
  return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 10000) / 10000, data);
},
    _renderBoolean = function _renderBoolean(ratio, data) {
  return data.set(data.t, data.p, !!(data.s + data.c * ratio), data);
},
    _renderComplexString = function _renderComplexString(ratio, data) {
  var pt = data._pt,
      s = "";

  if (!ratio && data.b) {
    //b = beginning string
    s = data.b;
  } else if (ratio === 1 && data.e) {
    //e = ending string
    s = data.e;
  } else {
    while (pt) {
      s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 10000) / 10000) + s; //we use the "p" property for the text inbetween (like a suffix). And in the context of a complex string, the modifier (m) is typically just Math.round(), like for RGB colors.

      pt = pt._next;
    }

    s += data.c; //we use the "c" of the PropTween to store the final chunk of non-numeric text.
  }

  data.set(data.t, data.p, s, data);
},
    _renderPropTweens = function _renderPropTweens(ratio, data) {
  var pt = data._pt;

  while (pt) {
    pt.r(ratio, pt.d);
    pt = pt._next;
  }
},
    _addPluginModifier = function _addPluginModifier(modifier, tween, target, property) {
  var pt = this._pt,
      next;

  while (pt) {
    next = pt._next;
    pt.p === property && pt.modifier(modifier, tween, target);
    pt = next;
  }
},
    _killPropTweensOf = function _killPropTweensOf(property) {
  var pt = this._pt,
      hasNonDependentRemaining,
      next;

  while (pt) {
    next = pt._next;

    if (pt.p === property && !pt.op || pt.op === property) {
      _removeLinkedListItem(this, pt, "_pt");
    } else if (!pt.dep) {
      hasNonDependentRemaining = 1;
    }

    pt = next;
  }

  return !hasNonDependentRemaining;
},
    _setterWithModifier = function _setterWithModifier(target, property, value, data) {
  data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
},
    _sortPropTweensByPriority = function _sortPropTweensByPriority(parent) {
  var pt = parent._pt,
      next,
      pt2,
      first,
      last; //sorts the PropTween linked list in order of priority because some plugins need to do their work after ALL of the PropTweens were created (like RoundPropsPlugin and ModifiersPlugin)

  while (pt) {
    next = pt._next;
    pt2 = first;

    while (pt2 && pt2.pr > pt.pr) {
      pt2 = pt2._next;
    }

    if (pt._prev = pt2 ? pt2._prev : last) {
      pt._prev._next = pt;
    } else {
      first = pt;
    }

    if (pt._next = pt2) {
      pt2._prev = pt;
    } else {
      last = pt;
    }

    pt = next;
  }

  parent._pt = first;
}; //PropTween key: t = target, p = prop, r = renderer, d = data, s = start, c = change, op = overwriteProperty (ONLY populated when it's different than p), pr = priority, _next/_prev for the linked list siblings, set = setter, m = modifier, mSet = modifierSetter (the original setter, before a modifier was added)


exports._sortPropTweensByPriority = _sortPropTweensByPriority;
exports._renderComplexString = _renderComplexString;
exports._getSetter = _getSetter;

var PropTween = /*#__PURE__*/function () {
  function PropTween(next, target, prop, start, change, renderer, data, setter, priority) {
    this.t = target;
    this.s = start;
    this.c = change;
    this.p = prop;
    this.r = renderer || _renderPlain;
    this.d = data || this;
    this.set = setter || _setterPlain;
    this.pr = priority || 0;
    this._next = next;

    if (next) {
      next._prev = this;
    }
  }

  var _proto4 = PropTween.prototype;

  _proto4.modifier = function modifier(func, tween, target) {
    this.mSet = this.mSet || this.set; //in case it was already set (a PropTween can only have one modifier)

    this.set = _setterWithModifier;
    this.m = func;
    this.mt = target; //modifier target

    this.tween = tween;
  };

  return PropTween;
}(); //Initialization tasks


exports.PropTween = PropTween;

_forEachName(_callbackNames + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function (name) {
  return _reservedProps[name] = 1;
});

_globals.TweenMax = _globals.TweenLite = Tween;
_globals.TimelineLite = _globals.TimelineMax = Timeline;
_globalTimeline = new Timeline({
  sortChildren: false,
  defaults: _defaults,
  autoRemoveChildren: true,
  id: "root",
  smoothChildTiming: true
});
_config.stringFilter = _colorStringFilter;
/*
 * --------------------------------------------------------------------------------------
 * GSAP
 * --------------------------------------------------------------------------------------
 */

var _gsap = {
  registerPlugin: function registerPlugin() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    args.forEach(function (config) {
      return _createPlugin(config);
    });
  },
  timeline: function timeline(vars) {
    return new Timeline(vars);
  },
  getTweensOf: function getTweensOf(targets, onlyActive) {
    return _globalTimeline.getTweensOf(targets, onlyActive);
  },
  getProperty: function getProperty(target, property, unit, uncache) {
    _isString(target) && (target = toArray(target)[0]); //in case selector text or an array is passed in

    var getter = _getCache(target || {}).get,
        format = unit ? _passThrough : _numericIfPossible;

    unit === "native" && (unit = "");
    return !target ? target : !property ? function (property, unit, uncache) {
      return format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
    } : format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
  },
  quickSetter: function quickSetter(target, property, unit) {
    target = toArray(target);

    if (target.length > 1) {
      var setters = target.map(function (t) {
        return gsap.quickSetter(t, property, unit);
      }),
          l = setters.length;
      return function (value) {
        var i = l;

        while (i--) {
          setters[i](value);
        }
      };
    }

    target = target[0] || {};

    var Plugin = _plugins[property],
        cache = _getCache(target),
        p = cache.harness && (cache.harness.aliases || {})[property] || property,
        // in case it's an alias, like "rotate" for "rotation".
    setter = Plugin ? function (value) {
      var p = new Plugin();
      _quickTween._pt = 0;
      p.init(target, unit ? value + unit : value, _quickTween, 0, [target]);
      p.render(1, p);
      _quickTween._pt && _renderPropTweens(1, _quickTween);
    } : cache.set(target, p);

    return Plugin ? setter : function (value) {
      return setter(target, p, unit ? value + unit : value, cache, 1);
    };
  },
  isTweening: function isTweening(targets) {
    return _globalTimeline.getTweensOf(targets, true).length > 0;
  },
  defaults: function defaults(value) {
    value && value.ease && (value.ease = _parseEase(value.ease, _defaults.ease));
    return _mergeDeep(_defaults, value || {});
  },
  config: function config(value) {
    return _mergeDeep(_config, value || {});
  },
  registerEffect: function registerEffect(_ref2) {
    var name = _ref2.name,
        effect = _ref2.effect,
        plugins = _ref2.plugins,
        defaults = _ref2.defaults,
        extendTimeline = _ref2.extendTimeline;
    (plugins || "").split(",").forEach(function (pluginName) {
      return pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(name + " effect requires " + pluginName + " plugin.");
    });

    _effects[name] = function (targets, vars, tl) {
      return effect(toArray(targets), _setDefaults(vars || {}, defaults), tl);
    };

    if (extendTimeline) {
      Timeline.prototype[name] = function (targets, vars, position) {
        return this.add(_effects[name](targets, _isObject(vars) ? vars : (position = vars) && {}, this), position);
      };
    }
  },
  registerEase: function registerEase(name, ease) {
    _easeMap[name] = _parseEase(ease);
  },
  parseEase: function parseEase(ease, defaultEase) {
    return arguments.length ? _parseEase(ease, defaultEase) : _easeMap;
  },
  getById: function getById(id) {
    return _globalTimeline.getById(id);
  },
  exportRoot: function exportRoot(vars, includeDelayedCalls) {
    if (vars === void 0) {
      vars = {};
    }

    var tl = new Timeline(vars),
        child,
        next;
    tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);

    _globalTimeline.remove(tl);

    tl._dp = 0; //otherwise it'll get re-activated when adding children and be re-introduced into _globalTimeline's linked list (then added to itself).

    tl._time = tl._tTime = _globalTimeline._time;
    child = _globalTimeline._first;

    while (child) {
      next = child._next;

      if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) {
        _addToTimeline(tl, child, child._start - child._delay);
      }

      child = next;
    }

    _addToTimeline(_globalTimeline, tl, 0);

    return tl;
  },
  utils: {
    wrap: wrap,
    wrapYoyo: wrapYoyo,
    distribute: distribute,
    random: random,
    snap: snap,
    normalize: normalize,
    getUnit: getUnit,
    clamp: clamp,
    splitColor: splitColor,
    toArray: toArray,
    mapRange: mapRange,
    pipe: pipe,
    unitize: unitize,
    interpolate: interpolate,
    shuffle: shuffle
  },
  install: _install,
  effects: _effects,
  ticker: _ticker,
  updateRoot: Timeline.updateRoot,
  plugins: _plugins,
  globalTimeline: _globalTimeline,
  core: {
    PropTween: PropTween,
    globals: _addGlobal,
    Tween: Tween,
    Timeline: Timeline,
    Animation: Animation,
    getCache: _getCache,
    _removeLinkedListItem: _removeLinkedListItem,
    suppressOverwrites: function suppressOverwrites(value) {
      return _suppressOverwrites = value;
    }
  }
};

_forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function (name) {
  return _gsap[name] = Tween[name];
});

_ticker.add(Timeline.updateRoot);

_quickTween = _gsap.to({}, {
  duration: 0
}); // ---- EXTRA PLUGINS --------------------------------------------------------

var _getPluginPropTween = function _getPluginPropTween(plugin, prop) {
  var pt = plugin._pt;

  while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) {
    pt = pt._next;
  }

  return pt;
},
    _addModifiers = function _addModifiers(tween, modifiers) {
  var targets = tween._targets,
      p,
      i,
      pt;

  for (p in modifiers) {
    i = targets.length;

    while (i--) {
      pt = tween._ptLookup[i][p];

      if (pt && (pt = pt.d)) {
        if (pt._pt) {
          // is a plugin
          pt = _getPluginPropTween(pt, p);
        }

        pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i], p);
      }
    }
  }
},
    _buildModifierPlugin = function _buildModifierPlugin(name, modifier) {
  return {
    name: name,
    rawVars: 1,
    //don't pre-process function-based values or "random()" strings.
    init: function init(target, vars, tween) {
      tween._onInit = function (tween) {
        var temp, p;

        if (_isString(vars)) {
          temp = {};

          _forEachName(vars, function (name) {
            return temp[name] = 1;
          }); //if the user passes in a comma-delimited list of property names to roundProps, like "x,y", we round to whole numbers.


          vars = temp;
        }

        if (modifier) {
          temp = {};

          for (p in vars) {
            temp[p] = modifier(vars[p]);
          }

          vars = temp;
        }

        _addModifiers(tween, vars);
      };
    }
  };
}; //register core plugins


var gsap = _gsap.registerPlugin({
  name: "attr",
  init: function init(target, vars, tween, index, targets) {
    var p, pt;

    for (p in vars) {
      pt = this.add(target, "setAttribute", (target.getAttribute(p) || 0) + "", vars[p], index, targets, 0, 0, p);
      pt && (pt.op = p);

      this._props.push(p);
    }
  }
}, {
  name: "endArray",
  init: function init(target, value) {
    var i = value.length;

    while (i--) {
      this.add(target, i, target[i] || 0, value[i]);
    }
  }
}, _buildModifierPlugin("roundProps", _roundModifier), _buildModifierPlugin("modifiers"), _buildModifierPlugin("snap", snap)) || _gsap; //to prevent the core plugins from being dropped via aggressive tree shaking, we must include them in the variable declaration in this way.


exports.default = exports.gsap = gsap;
Tween.version = Timeline.version = gsap.version = "3.6.0";
_coreReady = 1;

if (_windowExists()) {
  _wake();
}

var Power0 = _easeMap.Power0,
    Power1 = _easeMap.Power1,
    Power2 = _easeMap.Power2,
    Power3 = _easeMap.Power3,
    Power4 = _easeMap.Power4,
    Linear = _easeMap.Linear,
    Quad = _easeMap.Quad,
    Cubic = _easeMap.Cubic,
    Quart = _easeMap.Quart,
    Quint = _easeMap.Quint,
    Strong = _easeMap.Strong,
    Elastic = _easeMap.Elastic,
    Back = _easeMap.Back,
    SteppedEase = _easeMap.SteppedEase,
    Bounce = _easeMap.Bounce,
    Sine = _easeMap.Sine,
    Expo = _easeMap.Expo,
    Circ = _easeMap.Circ;
exports.Circ = Circ;
exports.Expo = Expo;
exports.Sine = Sine;
exports.Bounce = Bounce;
exports.SteppedEase = SteppedEase;
exports.Back = Back;
exports.Elastic = Elastic;
exports.Strong = Strong;
exports.Quint = Quint;
exports.Quart = Quart;
exports.Cubic = Cubic;
exports.Quad = Quad;
exports.Linear = Linear;
exports.Power4 = Power4;
exports.Power3 = Power3;
exports.Power2 = Power2;
exports.Power1 = Power1;
exports.Power0 = Power0;
},{}],"node_modules/gsap/CSSPlugin.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkPrefix = exports._createElement = exports._getBBox = exports.default = exports.CSSPlugin = void 0;

var _gsapCore = require("./gsap-core.js");

/*!
 * CSSPlugin 3.6.0
 * https://greensock.com
 *
 * Copyright 2008-2021, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/

/* eslint-disable */
var _win,
    _doc,
    _docElement,
    _pluginInitted,
    _tempDiv,
    _tempDivStyler,
    _recentSetterPlugin,
    _windowExists = function _windowExists() {
  return typeof window !== "undefined";
},
    _transformProps = {},
    _RAD2DEG = 180 / Math.PI,
    _DEG2RAD = Math.PI / 180,
    _atan2 = Math.atan2,
    _bigNum = 1e8,
    _capsExp = /([A-Z])/g,
    _horizontalExp = /(?:left|right|width|margin|padding|x)/i,
    _complexExp = /[\s,\(]\S/,
    _propertyAliases = {
  autoAlpha: "opacity,visibility",
  scale: "scaleX,scaleY",
  alpha: "opacity"
},
    _renderCSSProp = function _renderCSSProp(ratio, data) {
  return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u, data);
},
    _renderPropWithEnd = function _renderPropWithEnd(ratio, data) {
  return data.set(data.t, data.p, ratio === 1 ? data.e : Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u, data);
},
    _renderCSSPropWithBeginning = function _renderCSSPropWithBeginning(ratio, data) {
  return data.set(data.t, data.p, ratio ? Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u : data.b, data);
},
    //if units change, we need a way to render the original unit/value when the tween goes all the way back to the beginning (ratio:0)
_renderRoundedCSSProp = function _renderRoundedCSSProp(ratio, data) {
  var value = data.s + data.c * ratio;
  data.set(data.t, data.p, ~~(value + (value < 0 ? -.5 : .5)) + data.u, data);
},
    _renderNonTweeningValue = function _renderNonTweeningValue(ratio, data) {
  return data.set(data.t, data.p, ratio ? data.e : data.b, data);
},
    _renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd(ratio, data) {
  return data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data);
},
    _setterCSSStyle = function _setterCSSStyle(target, property, value) {
  return target.style[property] = value;
},
    _setterCSSProp = function _setterCSSProp(target, property, value) {
  return target.style.setProperty(property, value);
},
    _setterTransform = function _setterTransform(target, property, value) {
  return target._gsap[property] = value;
},
    _setterScale = function _setterScale(target, property, value) {
  return target._gsap.scaleX = target._gsap.scaleY = value;
},
    _setterScaleWithRender = function _setterScaleWithRender(target, property, value, data, ratio) {
  var cache = target._gsap;
  cache.scaleX = cache.scaleY = value;
  cache.renderTransform(ratio, cache);
},
    _setterTransformWithRender = function _setterTransformWithRender(target, property, value, data, ratio) {
  var cache = target._gsap;
  cache[property] = value;
  cache.renderTransform(ratio, cache);
},
    _transformProp = "transform",
    _transformOriginProp = _transformProp + "Origin",
    _supports3D,
    _createElement = function _createElement(type, ns) {
  var e = _doc.createElementNS ? _doc.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : _doc.createElement(type); //some servers swap in https for http in the namespace which can break things, making "style" inaccessible.

  return e.style ? e : _doc.createElement(type); //some environments won't allow access to the element's style when created with a namespace in which case we default to the standard createElement() to work around the issue. Also note that when GSAP is embedded directly inside an SVG file, createElement() won't allow access to the style object in Firefox (see https://greensock.com/forums/topic/20215-problem-using-tweenmax-in-standalone-self-containing-svg-file-err-cannot-set-property-csstext-of-undefined/).
},
    _getComputedProperty = function _getComputedProperty(target, property, skipPrefixFallback) {
  var cs = getComputedStyle(target);
  return cs[property] || cs.getPropertyValue(property.replace(_capsExp, "-$1").toLowerCase()) || cs.getPropertyValue(property) || !skipPrefixFallback && _getComputedProperty(target, _checkPropPrefix(property) || property, 1) || ""; //css variables may not need caps swapped out for dashes and lowercase.
},
    _prefixes = "O,Moz,ms,Ms,Webkit".split(","),
    _checkPropPrefix = function _checkPropPrefix(property, element, preferPrefix) {
  var e = element || _tempDiv,
      s = e.style,
      i = 5;

  if (property in s && !preferPrefix) {
    return property;
  }

  property = property.charAt(0).toUpperCase() + property.substr(1);

  while (i-- && !(_prefixes[i] + property in s)) {}

  return i < 0 ? null : (i === 3 ? "ms" : i >= 0 ? _prefixes[i] : "") + property;
},
    _initCore = function _initCore() {
  if (_windowExists() && window.document) {
    _win = window;
    _doc = _win.document;
    _docElement = _doc.documentElement;
    _tempDiv = _createElement("div") || {
      style: {}
    };
    _tempDivStyler = _createElement("div");
    _transformProp = _checkPropPrefix(_transformProp);
    _transformOriginProp = _transformProp + "Origin";
    _tempDiv.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0"; //make sure to override certain properties that may contaminate measurements, in case the user has overreaching style sheets.

    _supports3D = !!_checkPropPrefix("perspective");
    _pluginInitted = 1;
  }
},
    _getBBoxHack = function _getBBoxHack(swapIfPossible) {
  //works around issues in some browsers (like Firefox) that don't correctly report getBBox() on SVG elements inside a <defs> element and/or <mask>. We try creating an SVG, adding it to the documentElement and toss the element in there so that it's definitely part of the rendering tree, then grab the bbox and if it works, we actually swap out the original getBBox() method for our own that does these extra steps whenever getBBox is needed. This helps ensure that performance is optimal (only do all these extra steps when absolutely necessary...most elements don't need it).
  var svg = _createElement("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
      oldParent = this.parentNode,
      oldSibling = this.nextSibling,
      oldCSS = this.style.cssText,
      bbox;

  _docElement.appendChild(svg);

  svg.appendChild(this);
  this.style.display = "block";

  if (swapIfPossible) {
    try {
      bbox = this.getBBox();
      this._gsapBBox = this.getBBox; //store the original

      this.getBBox = _getBBoxHack;
    } catch (e) {}
  } else if (this._gsapBBox) {
    bbox = this._gsapBBox();
  }

  if (oldParent) {
    if (oldSibling) {
      oldParent.insertBefore(this, oldSibling);
    } else {
      oldParent.appendChild(this);
    }
  }

  _docElement.removeChild(svg);

  this.style.cssText = oldCSS;
  return bbox;
},
    _getAttributeFallbacks = function _getAttributeFallbacks(target, attributesArray) {
  var i = attributesArray.length;

  while (i--) {
    if (target.hasAttribute(attributesArray[i])) {
      return target.getAttribute(attributesArray[i]);
    }
  }
},
    _getBBox = function _getBBox(target) {
  var bounds;

  try {
    bounds = target.getBBox(); //Firefox throws errors if you try calling getBBox() on an SVG element that's not rendered (like in a <symbol> or <defs>). https://bugzilla.mozilla.org/show_bug.cgi?id=612118
  } catch (error) {
    bounds = _getBBoxHack.call(target, true);
  }

  bounds && (bounds.width || bounds.height) || target.getBBox === _getBBoxHack || (bounds = _getBBoxHack.call(target, true)); //some browsers (like Firefox) misreport the bounds if the element has zero width and height (it just assumes it's at x:0, y:0), thus we need to manually grab the position in that case.

  return bounds && !bounds.width && !bounds.x && !bounds.y ? {
    x: +_getAttributeFallbacks(target, ["x", "cx", "x1"]) || 0,
    y: +_getAttributeFallbacks(target, ["y", "cy", "y1"]) || 0,
    width: 0,
    height: 0
  } : bounds;
},
    _isSVG = function _isSVG(e) {
  return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e));
},
    //reports if the element is an SVG on which getBBox() actually works
_removeProperty = function _removeProperty(target, property) {
  if (property) {
    var style = target.style;

    if (property in _transformProps && property !== _transformOriginProp) {
      property = _transformProp;
    }

    if (style.removeProperty) {
      if (property.substr(0, 2) === "ms" || property.substr(0, 6) === "webkit") {
        //Microsoft and some Webkit browsers don't conform to the standard of capitalizing the first prefix character, so we adjust so that when we prefix the caps with a dash, it's correct (otherwise it'd be "ms-transform" instead of "-ms-transform" for IE9, for example)
        property = "-" + property;
      }

      style.removeProperty(property.replace(_capsExp, "-$1").toLowerCase());
    } else {
      //note: old versions of IE use "removeAttribute()" instead of "removeProperty()"
      style.removeAttribute(property);
    }
  }
},
    _addNonTweeningPT = function _addNonTweeningPT(plugin, target, property, beginning, end, onlySetAtEnd) {
  var pt = new _gsapCore.PropTween(plugin._pt, target, property, 0, 1, onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue);
  plugin._pt = pt;
  pt.b = beginning;
  pt.e = end;

  plugin._props.push(property);

  return pt;
},
    _nonConvertibleUnits = {
  deg: 1,
  rad: 1,
  turn: 1
},
    //takes a single value like 20px and converts it to the unit specified, like "%", returning only the numeric amount.
_convertToUnit = function _convertToUnit(target, property, value, unit) {
  var curValue = parseFloat(value) || 0,
      curUnit = (value + "").trim().substr((curValue + "").length) || "px",
      // some browsers leave extra whitespace at the beginning of CSS variables, hence the need to trim()
  style = _tempDiv.style,
      horizontal = _horizontalExp.test(property),
      isRootSVG = target.tagName.toLowerCase() === "svg",
      measureProperty = (isRootSVG ? "client" : "offset") + (horizontal ? "Width" : "Height"),
      amount = 100,
      toPixels = unit === "px",
      toPercent = unit === "%",
      px,
      parent,
      cache,
      isSVG;

  if (unit === curUnit || !curValue || _nonConvertibleUnits[unit] || _nonConvertibleUnits[curUnit]) {
    return curValue;
  }

  curUnit !== "px" && !toPixels && (curValue = _convertToUnit(target, property, value, "px"));
  isSVG = target.getCTM && _isSVG(target);

  if ((toPercent || curUnit === "%") && (_transformProps[property] || ~property.indexOf("adius"))) {
    px = isSVG ? target.getBBox()[horizontal ? "width" : "height"] : target[measureProperty];
    return (0, _gsapCore._round)(toPercent ? curValue / px * amount : curValue / 100 * px);
  }

  style[horizontal ? "width" : "height"] = amount + (toPixels ? curUnit : unit);
  parent = ~property.indexOf("adius") || unit === "em" && target.appendChild && !isRootSVG ? target : target.parentNode;

  if (isSVG) {
    parent = (target.ownerSVGElement || {}).parentNode;
  }

  if (!parent || parent === _doc || !parent.appendChild) {
    parent = _doc.body;
  }

  cache = parent._gsap;

  if (cache && toPercent && cache.width && horizontal && cache.time === _gsapCore._ticker.time) {
    return (0, _gsapCore._round)(curValue / cache.width * amount);
  } else {
    (toPercent || curUnit === "%") && (style.position = _getComputedProperty(target, "position"));
    parent === target && (style.position = "static"); // like for borderRadius, if it's a % we must have it relative to the target itself but that may not have position: relative or position: absolute in which case it'd go up the chain until it finds its offsetParent (bad). position: static protects against that.

    parent.appendChild(_tempDiv);
    px = _tempDiv[measureProperty];
    parent.removeChild(_tempDiv);
    style.position = "absolute";

    if (horizontal && toPercent) {
      cache = (0, _gsapCore._getCache)(parent);
      cache.time = _gsapCore._ticker.time;
      cache.width = parent[measureProperty];
    }
  }

  return (0, _gsapCore._round)(toPixels ? px * curValue / amount : px && curValue ? amount / px * curValue : 0);
},
    _get = function _get(target, property, unit, uncache) {
  var value;
  _pluginInitted || _initCore();

  if (property in _propertyAliases && property !== "transform") {
    property = _propertyAliases[property];

    if (~property.indexOf(",")) {
      property = property.split(",")[0];
    }
  }

  if (_transformProps[property] && property !== "transform") {
    value = _parseTransform(target, uncache);
    value = property !== "transformOrigin" ? value[property] : _firstTwoOnly(_getComputedProperty(target, _transformOriginProp)) + " " + value.zOrigin + "px";
  } else {
    value = target.style[property];

    if (!value || value === "auto" || uncache || ~(value + "").indexOf("calc(")) {
      value = _specialProps[property] && _specialProps[property](target, property, unit) || _getComputedProperty(target, property) || (0, _gsapCore._getProperty)(target, property) || (property === "opacity" ? 1 : 0); // note: some browsers, like Firefox, don't report borderRadius correctly! Instead, it only reports every corner like  borderTopLeftRadius
    }
  }

  return unit && !~(value + "").trim().indexOf(" ") ? _convertToUnit(target, property, value, unit) + unit : value;
},
    _tweenComplexCSSString = function _tweenComplexCSSString(target, prop, start, end) {
  //note: we call _tweenComplexCSSString.call(pluginInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.
  if (!start || start === "none") {
    // some browsers like Safari actually PREFER the prefixed property and mis-report the unprefixed value like clipPath (BUG). In other words, even though clipPath exists in the style ("clipPath" in target.style) and it's set in the CSS properly (along with -webkit-clip-path), Safari reports clipPath as "none" whereas WebkitClipPath reports accurately like "ellipse(100% 0% at 50% 0%)", so in this case we must SWITCH to using the prefixed property instead. See https://greensock.com/forums/topic/18310-clippath-doesnt-work-on-ios/
    var p = _checkPropPrefix(prop, target, 1),
        s = p && _getComputedProperty(target, p, 1);

    if (s && s !== start) {
      prop = p;
      start = s;
    } else if (prop === "borderColor") {
      start = _getComputedProperty(target, "borderTopColor"); // Firefox bug: always reports "borderColor" as "", so we must fall back to borderTopColor. See https://greensock.com/forums/topic/24583-how-to-return-colors-that-i-had-after-reverse/
    }
  }

  var pt = new _gsapCore.PropTween(this._pt, target.style, prop, 0, 1, _gsapCore._renderComplexString),
      index = 0,
      matchIndex = 0,
      a,
      result,
      startValues,
      startNum,
      color,
      startValue,
      endValue,
      endNum,
      chunk,
      endUnit,
      startUnit,
      relative,
      endValues;
  pt.b = start;
  pt.e = end;
  start += ""; //ensure values are strings

  end += "";

  if (end === "auto") {
    target.style[prop] = end;
    end = _getComputedProperty(target, prop) || end;
    target.style[prop] = start;
  }

  a = [start, end];
  (0, _gsapCore._colorStringFilter)(a); //pass an array with the starting and ending values and let the filter do whatever it needs to the values. If colors are found, it returns true and then we must match where the color shows up order-wise because for things like boxShadow, sometimes the browser provides the computed values with the color FIRST, but the user provides it with the color LAST, so flip them if necessary. Same for drop-shadow().

  start = a[0];
  end = a[1];
  startValues = start.match(_gsapCore._numWithUnitExp) || [];
  endValues = end.match(_gsapCore._numWithUnitExp) || [];

  if (endValues.length) {
    while (result = _gsapCore._numWithUnitExp.exec(end)) {
      endValue = result[0];
      chunk = end.substring(index, result.index);

      if (color) {
        color = (color + 1) % 5;
      } else if (chunk.substr(-5) === "rgba(" || chunk.substr(-5) === "hsla(") {
        color = 1;
      }

      if (endValue !== (startValue = startValues[matchIndex++] || "")) {
        startNum = parseFloat(startValue) || 0;
        startUnit = startValue.substr((startNum + "").length);
        relative = endValue.charAt(1) === "=" ? +(endValue.charAt(0) + "1") : 0;

        if (relative) {
          endValue = endValue.substr(2);
        }

        endNum = parseFloat(endValue);
        endUnit = endValue.substr((endNum + "").length);
        index = _gsapCore._numWithUnitExp.lastIndex - endUnit.length;

        if (!endUnit) {
          //if something like "perspective:300" is passed in and we must add a unit to the end
          endUnit = endUnit || _gsapCore._config.units[prop] || startUnit;

          if (index === end.length) {
            end += endUnit;
            pt.e += endUnit;
          }
        }

        if (startUnit !== endUnit) {
          startNum = _convertToUnit(target, prop, startValue, endUnit) || 0;
        } //these nested PropTweens are handled in a special way - we'll never actually call a render or setter method on them. We'll just loop through them in the parent complex string PropTween's render method.


        pt._pt = {
          _next: pt._pt,
          p: chunk || matchIndex === 1 ? chunk : ",",
          //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
          s: startNum,
          c: relative ? relative * endNum : endNum - startNum,
          m: color && color < 4 || prop === "zIndex" ? Math.round : 0
        };
      }
    }

    pt.c = index < end.length ? end.substring(index, end.length) : ""; //we use the "c" of the PropTween to store the final part of the string (after the last number)
  } else {
    pt.r = prop === "display" && end === "none" ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue;
  }

  _gsapCore._relExp.test(end) && (pt.e = 0); //if the end string contains relative values or dynamic random(...) values, delete the end it so that on the final render we don't actually set it to the string with += or -= characters (forces it to use the calculated value).

  this._pt = pt; //start the linked list with this new PropTween. Remember, we call _tweenComplexCSSString.call(pluginInstance...) to ensure that it's scoped properly. We may call it from within another plugin too, thus "this" would refer to the plugin.

  return pt;
},
    _keywordToPercent = {
  top: "0%",
  bottom: "100%",
  left: "0%",
  right: "100%",
  center: "50%"
},
    _convertKeywordsToPercentages = function _convertKeywordsToPercentages(value) {
  var split = value.split(" "),
      x = split[0],
      y = split[1] || "50%";

  if (x === "top" || x === "bottom" || y === "left" || y === "right") {
    //the user provided them in the wrong order, so flip them
    value = x;
    x = y;
    y = value;
  }

  split[0] = _keywordToPercent[x] || x;
  split[1] = _keywordToPercent[y] || y;
  return split.join(" ");
},
    _renderClearProps = function _renderClearProps(ratio, data) {
  if (data.tween && data.tween._time === data.tween._dur) {
    var target = data.t,
        style = target.style,
        props = data.u,
        cache = target._gsap,
        prop,
        clearTransforms,
        i;

    if (props === "all" || props === true) {
      style.cssText = "";
      clearTransforms = 1;
    } else {
      props = props.split(",");
      i = props.length;

      while (--i > -1) {
        prop = props[i];

        if (_transformProps[prop]) {
          clearTransforms = 1;
          prop = prop === "transformOrigin" ? _transformOriginProp : _transformProp;
        }

        _removeProperty(target, prop);
      }
    }

    if (clearTransforms) {
      _removeProperty(target, _transformProp);

      if (cache) {
        cache.svg && target.removeAttribute("transform");

        _parseTransform(target, 1); // force all the cached values back to "normal"/identity, otherwise if there's another tween that's already set to render transforms on this element, it could display the wrong values.


        cache.uncache = 1;
      }
    }
  }
},
    // note: specialProps should return 1 if (and only if) they have a non-zero priority. It indicates we need to sort the linked list.
_specialProps = {
  clearProps: function clearProps(plugin, target, property, endValue, tween) {
    if (tween.data !== "isFromStart") {
      var pt = plugin._pt = new _gsapCore.PropTween(plugin._pt, target, property, 0, 0, _renderClearProps);
      pt.u = endValue;
      pt.pr = -10;
      pt.tween = tween;

      plugin._props.push(property);

      return 1;
    }
  }
  /* className feature (about 0.4kb gzipped).
  , className(plugin, target, property, endValue, tween) {
  	let _renderClassName = (ratio, data) => {
  			data.css.render(ratio, data.css);
  			if (!ratio || ratio === 1) {
  				let inline = data.rmv,
  					target = data.t,
  					p;
  				target.setAttribute("class", ratio ? data.e : data.b);
  				for (p in inline) {
  					_removeProperty(target, p);
  				}
  			}
  		},
  		_getAllStyles = (target) => {
  			let styles = {},
  				computed = getComputedStyle(target),
  				p;
  			for (p in computed) {
  				if (isNaN(p) && p !== "cssText" && p !== "length") {
  					styles[p] = computed[p];
  				}
  			}
  			_setDefaults(styles, _parseTransform(target, 1));
  			return styles;
  		},
  		startClassList = target.getAttribute("class"),
  		style = target.style,
  		cssText = style.cssText,
  		cache = target._gsap,
  		classPT = cache.classPT,
  		inlineToRemoveAtEnd = {},
  		data = {t:target, plugin:plugin, rmv:inlineToRemoveAtEnd, b:startClassList, e:(endValue.charAt(1) !== "=") ? endValue : startClassList.replace(new RegExp("(?:\\s|^)" + endValue.substr(2) + "(?![\\w-])"), "") + ((endValue.charAt(0) === "+") ? " " + endValue.substr(2) : "")},
  		changingVars = {},
  		startVars = _getAllStyles(target),
  		transformRelated = /(transform|perspective)/i,
  		endVars, p;
  	if (classPT) {
  		classPT.r(1, classPT.d);
  		_removeLinkedListItem(classPT.d.plugin, classPT, "_pt");
  	}
  	target.setAttribute("class", data.e);
  	endVars = _getAllStyles(target, true);
  	target.setAttribute("class", startClassList);
  	for (p in endVars) {
  		if (endVars[p] !== startVars[p] && !transformRelated.test(p)) {
  			changingVars[p] = endVars[p];
  			if (!style[p] && style[p] !== "0") {
  				inlineToRemoveAtEnd[p] = 1;
  			}
  		}
  	}
  	cache.classPT = plugin._pt = new PropTween(plugin._pt, target, "className", 0, 0, _renderClassName, data, 0, -11);
  	if (style.cssText !== cssText) { //only apply if things change. Otherwise, in cases like a background-image that's pulled dynamically, it could cause a refresh. See https://greensock.com/forums/topic/20368-possible-gsap-bug-switching-classnames-in-chrome/.
  		style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
  	}
  	_parseTransform(target, true); //to clear the caching of transforms
  	data.css = new gsap.plugins.css();
  	data.css.init(target, changingVars, tween);
  	plugin._props.push(...data.css._props);
  	return 1;
  }
  */

},

/*
 * --------------------------------------------------------------------------------------
 * TRANSFORMS
 * --------------------------------------------------------------------------------------
 */
_identity2DMatrix = [1, 0, 0, 1, 0, 0],
    _rotationalProperties = {},
    _isNullTransform = function _isNullTransform(value) {
  return value === "matrix(1, 0, 0, 1, 0, 0)" || value === "none" || !value;
},
    _getComputedTransformMatrixAsArray = function _getComputedTransformMatrixAsArray(target) {
  var matrixString = _getComputedProperty(target, _transformProp);

  return _isNullTransform(matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_gsapCore._numExp).map(_gsapCore._round);
},
    _getMatrix = function _getMatrix(target, force2D) {
  var cache = target._gsap || (0, _gsapCore._getCache)(target),
      style = target.style,
      matrix = _getComputedTransformMatrixAsArray(target),
      parent,
      nextSibling,
      temp,
      addedToDOM;

  if (cache.svg && target.getAttribute("transform")) {
    temp = target.transform.baseVal.consolidate().matrix; //ensures that even complex values like "translate(50,60) rotate(135,0,0)" are parsed because it mashes it into a matrix.

    matrix = [temp.a, temp.b, temp.c, temp.d, temp.e, temp.f];
    return matrix.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : matrix;
  } else if (matrix === _identity2DMatrix && !target.offsetParent && target !== _docElement && !cache.svg) {
    //note: if offsetParent is null, that means the element isn't in the normal document flow, like if it has display:none or one of its ancestors has display:none). Firefox returns null for getComputedStyle() if the element is in an iframe that has display:none. https://bugzilla.mozilla.org/show_bug.cgi?id=548397
    //browsers don't report transforms accurately unless the element is in the DOM and has a display value that's not "none". Firefox and Microsoft browsers have a partial bug where they'll report transforms even if display:none BUT not any percentage-based values like translate(-50%, 8px) will be reported as if it's translate(0, 8px).
    temp = style.display;
    style.display = "block";
    parent = target.parentNode;

    if (!parent || !target.offsetParent) {
      // note: in 3.3.0 we switched target.offsetParent to _doc.body.contains(target) to avoid [sometimes unnecessary] MutationObserver calls but that wasn't adequate because there are edge cases where nested position: fixed elements need to get reparented to accurately sense transforms. See https://github.com/greensock/GSAP/issues/388 and https://github.com/greensock/GSAP/issues/375
      addedToDOM = 1; //flag

      nextSibling = target.nextSibling;

      _docElement.appendChild(target); //we must add it to the DOM in order to get values properly

    }

    matrix = _getComputedTransformMatrixAsArray(target);
    temp ? style.display = temp : _removeProperty(target, "display");

    if (addedToDOM) {
      nextSibling ? parent.insertBefore(target, nextSibling) : parent ? parent.appendChild(target) : _docElement.removeChild(target);
    }
  }

  return force2D && matrix.length > 6 ? [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]] : matrix;
},
    _applySVGOrigin = function _applySVGOrigin(target, origin, originIsAbsolute, smooth, matrixArray, pluginToAddPropTweensTo) {
  var cache = target._gsap,
      matrix = matrixArray || _getMatrix(target, true),
      xOriginOld = cache.xOrigin || 0,
      yOriginOld = cache.yOrigin || 0,
      xOffsetOld = cache.xOffset || 0,
      yOffsetOld = cache.yOffset || 0,
      a = matrix[0],
      b = matrix[1],
      c = matrix[2],
      d = matrix[3],
      tx = matrix[4],
      ty = matrix[5],
      originSplit = origin.split(" "),
      xOrigin = parseFloat(originSplit[0]) || 0,
      yOrigin = parseFloat(originSplit[1]) || 0,
      bounds,
      determinant,
      x,
      y;

  if (!originIsAbsolute) {
    bounds = _getBBox(target);
    xOrigin = bounds.x + (~originSplit[0].indexOf("%") ? xOrigin / 100 * bounds.width : xOrigin);
    yOrigin = bounds.y + (~(originSplit[1] || originSplit[0]).indexOf("%") ? yOrigin / 100 * bounds.height : yOrigin);
  } else if (matrix !== _identity2DMatrix && (determinant = a * d - b * c)) {
    //if it's zero (like if scaleX and scaleY are zero), skip it to avoid errors with dividing by zero.
    x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + (c * ty - d * tx) / determinant;
    y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - (a * ty - b * tx) / determinant;
    xOrigin = x;
    yOrigin = y;
  }

  if (smooth || smooth !== false && cache.smooth) {
    tx = xOrigin - xOriginOld;
    ty = yOrigin - yOriginOld;
    cache.xOffset = xOffsetOld + (tx * a + ty * c) - tx;
    cache.yOffset = yOffsetOld + (tx * b + ty * d) - ty;
  } else {
    cache.xOffset = cache.yOffset = 0;
  }

  cache.xOrigin = xOrigin;
  cache.yOrigin = yOrigin;
  cache.smooth = !!smooth;
  cache.origin = origin;
  cache.originIsAbsolute = !!originIsAbsolute;
  target.style[_transformOriginProp] = "0px 0px"; //otherwise, if someone sets  an origin via CSS, it will likely interfere with the SVG transform attribute ones (because remember, we're baking the origin into the matrix() value).

  if (pluginToAddPropTweensTo) {
    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOrigin", xOriginOld, xOrigin);

    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOrigin", yOriginOld, yOrigin);

    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOffset", xOffsetOld, cache.xOffset);

    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOffset", yOffsetOld, cache.yOffset);
  }

  target.setAttribute("data-svg-origin", xOrigin + " " + yOrigin);
},
    _parseTransform = function _parseTransform(target, uncache) {
  var cache = target._gsap || new _gsapCore.GSCache(target);

  if ("x" in cache && !uncache && !cache.uncache) {
    return cache;
  }

  var style = target.style,
      invertedScaleX = cache.scaleX < 0,
      px = "px",
      deg = "deg",
      origin = _getComputedProperty(target, _transformOriginProp) || "0",
      x,
      y,
      z,
      scaleX,
      scaleY,
      rotation,
      rotationX,
      rotationY,
      skewX,
      skewY,
      perspective,
      xOrigin,
      yOrigin,
      matrix,
      angle,
      cos,
      sin,
      a,
      b,
      c,
      d,
      a12,
      a22,
      t1,
      t2,
      t3,
      a13,
      a23,
      a33,
      a42,
      a43,
      a32;
  x = y = z = rotation = rotationX = rotationY = skewX = skewY = perspective = 0;
  scaleX = scaleY = 1;
  cache.svg = !!(target.getCTM && _isSVG(target));
  matrix = _getMatrix(target, cache.svg);

  if (cache.svg) {
    t1 = !cache.uncache && target.getAttribute("data-svg-origin");

    _applySVGOrigin(target, t1 || origin, !!t1 || cache.originIsAbsolute, cache.smooth !== false, matrix);
  }

  xOrigin = cache.xOrigin || 0;
  yOrigin = cache.yOrigin || 0;

  if (matrix !== _identity2DMatrix) {
    a = matrix[0]; //a11

    b = matrix[1]; //a21

    c = matrix[2]; //a31

    d = matrix[3]; //a41

    x = a12 = matrix[4];
    y = a22 = matrix[5]; //2D matrix

    if (matrix.length === 6) {
      scaleX = Math.sqrt(a * a + b * b);
      scaleY = Math.sqrt(d * d + c * c);
      rotation = a || b ? _atan2(b, a) * _RAD2DEG : 0; //note: if scaleX is 0, we cannot accurately measure rotation. Same for skewX with a scaleY of 0. Therefore, we default to the previously recorded value (or zero if that doesn't exist).

      skewX = c || d ? _atan2(c, d) * _RAD2DEG + rotation : 0;
      skewX && (scaleY *= Math.cos(skewX * _DEG2RAD));

      if (cache.svg) {
        x -= xOrigin - (xOrigin * a + yOrigin * c);
        y -= yOrigin - (xOrigin * b + yOrigin * d);
      } //3D matrix

    } else {
      a32 = matrix[6];
      a42 = matrix[7];
      a13 = matrix[8];
      a23 = matrix[9];
      a33 = matrix[10];
      a43 = matrix[11];
      x = matrix[12];
      y = matrix[13];
      z = matrix[14];
      angle = _atan2(a32, a33);
      rotationX = angle * _RAD2DEG; //rotationX

      if (angle) {
        cos = Math.cos(-angle);
        sin = Math.sin(-angle);
        t1 = a12 * cos + a13 * sin;
        t2 = a22 * cos + a23 * sin;
        t3 = a32 * cos + a33 * sin;
        a13 = a12 * -sin + a13 * cos;
        a23 = a22 * -sin + a23 * cos;
        a33 = a32 * -sin + a33 * cos;
        a43 = a42 * -sin + a43 * cos;
        a12 = t1;
        a22 = t2;
        a32 = t3;
      } //rotationY


      angle = _atan2(-c, a33);
      rotationY = angle * _RAD2DEG;

      if (angle) {
        cos = Math.cos(-angle);
        sin = Math.sin(-angle);
        t1 = a * cos - a13 * sin;
        t2 = b * cos - a23 * sin;
        t3 = c * cos - a33 * sin;
        a43 = d * sin + a43 * cos;
        a = t1;
        b = t2;
        c = t3;
      } //rotationZ


      angle = _atan2(b, a);
      rotation = angle * _RAD2DEG;

      if (angle) {
        cos = Math.cos(angle);
        sin = Math.sin(angle);
        t1 = a * cos + b * sin;
        t2 = a12 * cos + a22 * sin;
        b = b * cos - a * sin;
        a22 = a22 * cos - a12 * sin;
        a = t1;
        a12 = t2;
      }

      if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
        //when rotationY is set, it will often be parsed as 180 degrees different than it should be, and rotationX and rotation both being 180 (it looks the same), so we adjust for that here.
        rotationX = rotation = 0;
        rotationY = 180 - rotationY;
      }

      scaleX = (0, _gsapCore._round)(Math.sqrt(a * a + b * b + c * c));
      scaleY = (0, _gsapCore._round)(Math.sqrt(a22 * a22 + a32 * a32));
      angle = _atan2(a12, a22);
      skewX = Math.abs(angle) > 0.0002 ? angle * _RAD2DEG : 0;
      perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0;
    }

    if (cache.svg) {
      //sense if there are CSS transforms applied on an SVG element in which case we must overwrite them when rendering. The transform attribute is more reliable cross-browser, but we can't just remove the CSS ones because they may be applied in a CSS rule somewhere (not just inline).
      t1 = target.getAttribute("transform");
      cache.forceCSS = target.setAttribute("transform", "") || !_isNullTransform(_getComputedProperty(target, _transformProp));
      t1 && target.setAttribute("transform", t1);
    }
  }

  if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
    if (invertedScaleX) {
      scaleX *= -1;
      skewX += rotation <= 0 ? 180 : -180;
      rotation += rotation <= 0 ? 180 : -180;
    } else {
      scaleY *= -1;
      skewX += skewX <= 0 ? 180 : -180;
    }
  }

  cache.x = x - ((cache.xPercent = x && (cache.xPercent || (Math.round(target.offsetWidth / 2) === Math.round(-x) ? -50 : 0))) ? target.offsetWidth * cache.xPercent / 100 : 0) + px;
  cache.y = y - ((cache.yPercent = y && (cache.yPercent || (Math.round(target.offsetHeight / 2) === Math.round(-y) ? -50 : 0))) ? target.offsetHeight * cache.yPercent / 100 : 0) + px;
  cache.z = z + px;
  cache.scaleX = (0, _gsapCore._round)(scaleX);
  cache.scaleY = (0, _gsapCore._round)(scaleY);
  cache.rotation = (0, _gsapCore._round)(rotation) + deg;
  cache.rotationX = (0, _gsapCore._round)(rotationX) + deg;
  cache.rotationY = (0, _gsapCore._round)(rotationY) + deg;
  cache.skewX = skewX + deg;
  cache.skewY = skewY + deg;
  cache.transformPerspective = perspective + px;

  if (cache.zOrigin = parseFloat(origin.split(" ")[2]) || 0) {
    style[_transformOriginProp] = _firstTwoOnly(origin);
  }

  cache.xOffset = cache.yOffset = 0;
  cache.force3D = _gsapCore._config.force3D;
  cache.renderTransform = cache.svg ? _renderSVGTransforms : _supports3D ? _renderCSSTransforms : _renderNon3DTransforms;
  cache.uncache = 0;
  return cache;
},
    _firstTwoOnly = function _firstTwoOnly(value) {
  return (value = value.split(" "))[0] + " " + value[1];
},
    //for handling transformOrigin values, stripping out the 3rd dimension
_addPxTranslate = function _addPxTranslate(target, start, value) {
  var unit = (0, _gsapCore.getUnit)(start);
  return (0, _gsapCore._round)(parseFloat(start) + parseFloat(_convertToUnit(target, "x", value + "px", unit))) + unit;
},
    _renderNon3DTransforms = function _renderNon3DTransforms(ratio, cache) {
  cache.z = "0px";
  cache.rotationY = cache.rotationX = "0deg";
  cache.force3D = 0;

  _renderCSSTransforms(ratio, cache);
},
    _zeroDeg = "0deg",
    _zeroPx = "0px",
    _endParenthesis = ") ",
    _renderCSSTransforms = function _renderCSSTransforms(ratio, cache) {
  var _ref = cache || this,
      xPercent = _ref.xPercent,
      yPercent = _ref.yPercent,
      x = _ref.x,
      y = _ref.y,
      z = _ref.z,
      rotation = _ref.rotation,
      rotationY = _ref.rotationY,
      rotationX = _ref.rotationX,
      skewX = _ref.skewX,
      skewY = _ref.skewY,
      scaleX = _ref.scaleX,
      scaleY = _ref.scaleY,
      transformPerspective = _ref.transformPerspective,
      force3D = _ref.force3D,
      target = _ref.target,
      zOrigin = _ref.zOrigin,
      transforms = "",
      use3D = force3D === "auto" && ratio && ratio !== 1 || force3D === true; // Safari has a bug that causes it not to render 3D transform-origin values properly, so we force the z origin to 0, record it in the cache, and then do the math here to offset the translate values accordingly (basically do the 3D transform-origin part manually)


  if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
    var angle = parseFloat(rotationY) * _DEG2RAD,
        a13 = Math.sin(angle),
        a33 = Math.cos(angle),
        cos;

    angle = parseFloat(rotationX) * _DEG2RAD;
    cos = Math.cos(angle);
    x = _addPxTranslate(target, x, a13 * cos * -zOrigin);
    y = _addPxTranslate(target, y, -Math.sin(angle) * -zOrigin);
    z = _addPxTranslate(target, z, a33 * cos * -zOrigin + zOrigin);
  }

  if (transformPerspective !== _zeroPx) {
    transforms += "perspective(" + transformPerspective + _endParenthesis;
  }

  if (xPercent || yPercent) {
    transforms += "translate(" + xPercent + "%, " + yPercent + "%) ";
  }

  if (use3D || x !== _zeroPx || y !== _zeroPx || z !== _zeroPx) {
    transforms += z !== _zeroPx || use3D ? "translate3d(" + x + ", " + y + ", " + z + ") " : "translate(" + x + ", " + y + _endParenthesis;
  }

  if (rotation !== _zeroDeg) {
    transforms += "rotate(" + rotation + _endParenthesis;
  }

  if (rotationY !== _zeroDeg) {
    transforms += "rotateY(" + rotationY + _endParenthesis;
  }

  if (rotationX !== _zeroDeg) {
    transforms += "rotateX(" + rotationX + _endParenthesis;
  }

  if (skewX !== _zeroDeg || skewY !== _zeroDeg) {
    transforms += "skew(" + skewX + ", " + skewY + _endParenthesis;
  }

  if (scaleX !== 1 || scaleY !== 1) {
    transforms += "scale(" + scaleX + ", " + scaleY + _endParenthesis;
  }

  target.style[_transformProp] = transforms || "translate(0, 0)";
},
    _renderSVGTransforms = function _renderSVGTransforms(ratio, cache) {
  var _ref2 = cache || this,
      xPercent = _ref2.xPercent,
      yPercent = _ref2.yPercent,
      x = _ref2.x,
      y = _ref2.y,
      rotation = _ref2.rotation,
      skewX = _ref2.skewX,
      skewY = _ref2.skewY,
      scaleX = _ref2.scaleX,
      scaleY = _ref2.scaleY,
      target = _ref2.target,
      xOrigin = _ref2.xOrigin,
      yOrigin = _ref2.yOrigin,
      xOffset = _ref2.xOffset,
      yOffset = _ref2.yOffset,
      forceCSS = _ref2.forceCSS,
      tx = parseFloat(x),
      ty = parseFloat(y),
      a11,
      a21,
      a12,
      a22,
      temp;

  rotation = parseFloat(rotation);
  skewX = parseFloat(skewX);
  skewY = parseFloat(skewY);

  if (skewY) {
    //for performance reasons, we combine all skewing into the skewX and rotation values. Remember, a skewY of 10 degrees looks the same as a rotation of 10 degrees plus a skewX of 10 degrees.
    skewY = parseFloat(skewY);
    skewX += skewY;
    rotation += skewY;
  }

  if (rotation || skewX) {
    rotation *= _DEG2RAD;
    skewX *= _DEG2RAD;
    a11 = Math.cos(rotation) * scaleX;
    a21 = Math.sin(rotation) * scaleX;
    a12 = Math.sin(rotation - skewX) * -scaleY;
    a22 = Math.cos(rotation - skewX) * scaleY;

    if (skewX) {
      skewY *= _DEG2RAD;
      temp = Math.tan(skewX - skewY);
      temp = Math.sqrt(1 + temp * temp);
      a12 *= temp;
      a22 *= temp;

      if (skewY) {
        temp = Math.tan(skewY);
        temp = Math.sqrt(1 + temp * temp);
        a11 *= temp;
        a21 *= temp;
      }
    }

    a11 = (0, _gsapCore._round)(a11);
    a21 = (0, _gsapCore._round)(a21);
    a12 = (0, _gsapCore._round)(a12);
    a22 = (0, _gsapCore._round)(a22);
  } else {
    a11 = scaleX;
    a22 = scaleY;
    a21 = a12 = 0;
  }

  if (tx && !~(x + "").indexOf("px") || ty && !~(y + "").indexOf("px")) {
    tx = _convertToUnit(target, "x", x, "px");
    ty = _convertToUnit(target, "y", y, "px");
  }

  if (xOrigin || yOrigin || xOffset || yOffset) {
    tx = (0, _gsapCore._round)(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
    ty = (0, _gsapCore._round)(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset);
  }

  if (xPercent || yPercent) {
    //The SVG spec doesn't support percentage-based translation in the "transform" attribute, so we merge it into the translation to simulate it.
    temp = target.getBBox();
    tx = (0, _gsapCore._round)(tx + xPercent / 100 * temp.width);
    ty = (0, _gsapCore._round)(ty + yPercent / 100 * temp.height);
  }

  temp = "matrix(" + a11 + "," + a21 + "," + a12 + "," + a22 + "," + tx + "," + ty + ")";
  target.setAttribute("transform", temp);
  forceCSS && (target.style[_transformProp] = temp); //some browsers prioritize CSS transforms over the transform attribute. When we sense that the user has CSS transforms applied, we must overwrite them this way (otherwise some browser simply won't render the  transform attribute changes!)
},
    _addRotationalPropTween = function _addRotationalPropTween(plugin, target, property, startNum, endValue, relative) {
  var cap = 360,
      isString = (0, _gsapCore._isString)(endValue),
      endNum = parseFloat(endValue) * (isString && ~endValue.indexOf("rad") ? _RAD2DEG : 1),
      change = relative ? endNum * relative : endNum - startNum,
      finalValue = startNum + change + "deg",
      direction,
      pt;

  if (isString) {
    direction = endValue.split("_")[1];

    if (direction === "short") {
      change %= cap;

      if (change !== change % (cap / 2)) {
        change += change < 0 ? cap : -cap;
      }
    }

    if (direction === "cw" && change < 0) {
      change = (change + cap * _bigNum) % cap - ~~(change / cap) * cap;
    } else if (direction === "ccw" && change > 0) {
      change = (change - cap * _bigNum) % cap - ~~(change / cap) * cap;
    }
  }

  plugin._pt = pt = new _gsapCore.PropTween(plugin._pt, target, property, startNum, change, _renderPropWithEnd);
  pt.e = finalValue;
  pt.u = "deg";

  plugin._props.push(property);

  return pt;
},
    _addRawTransformPTs = function _addRawTransformPTs(plugin, transforms, target) {
  //for handling cases where someone passes in a whole transform string, like transform: "scale(2, 3) rotate(20deg) translateY(30em)"
  var style = _tempDivStyler.style,
      startCache = target._gsap,
      exclude = "perspective,force3D,transformOrigin,svgOrigin",
      endCache,
      p,
      startValue,
      endValue,
      startNum,
      endNum,
      startUnit,
      endUnit;
  style.cssText = getComputedStyle(target).cssText + ";position:absolute;display:block;"; //%-based translations will fail unless we set the width/height to match the original target (and padding/borders can affect it)

  style[_transformProp] = transforms;

  _doc.body.appendChild(_tempDivStyler);

  endCache = _parseTransform(_tempDivStyler, 1);

  for (p in _transformProps) {
    startValue = startCache[p];
    endValue = endCache[p];

    if (startValue !== endValue && exclude.indexOf(p) < 0) {
      //tweening to no perspective gives very unintuitive results - just keep the same perspective in that case.
      startUnit = (0, _gsapCore.getUnit)(startValue);
      endUnit = (0, _gsapCore.getUnit)(endValue);
      startNum = startUnit !== endUnit ? _convertToUnit(target, p, startValue, endUnit) : parseFloat(startValue);
      endNum = parseFloat(endValue);
      plugin._pt = new _gsapCore.PropTween(plugin._pt, startCache, p, startNum, endNum - startNum, _renderCSSProp);
      plugin._pt.u = endUnit || 0;

      plugin._props.push(p);
    }
  }

  _doc.body.removeChild(_tempDivStyler);
}; // handle splitting apart padding, margin, borderWidth, and borderRadius into their 4 components. Firefox, for example, won't report borderRadius correctly - it will only do borderTopLeftRadius and the other corners. We also want to handle paddingTop, marginLeft, borderRightWidth, etc.


exports._getBBox = _getBBox;
exports.checkPrefix = _checkPropPrefix;
exports._createElement = _createElement;
(0, _gsapCore._forEachName)("padding,margin,Width,Radius", function (name, index) {
  var t = "Top",
      r = "Right",
      b = "Bottom",
      l = "Left",
      props = (index < 3 ? [t, r, b, l] : [t + l, t + r, b + r, b + l]).map(function (side) {
    return index < 2 ? name + side : "border" + side + name;
  });

  _specialProps[index > 1 ? "border" + name : name] = function (plugin, target, property, endValue, tween) {
    var a, vars;

    if (arguments.length < 4) {
      // getter, passed target, property, and unit (from _get())
      a = props.map(function (prop) {
        return _get(plugin, prop, property);
      });
      vars = a.join(" ");
      return vars.split(a[0]).length === 5 ? a[0] : vars;
    }

    a = (endValue + "").split(" ");
    vars = {};
    props.forEach(function (prop, i) {
      return vars[prop] = a[i] = a[i] || a[(i - 1) / 2 | 0];
    });
    plugin.init(target, vars, tween);
  };
});
var CSSPlugin = {
  name: "css",
  register: _initCore,
  targetTest: function targetTest(target) {
    return target.style && target.nodeType;
  },
  init: function init(target, vars, tween, index, targets) {
    var props = this._props,
        style = target.style,
        startAt = tween.vars.startAt,
        startValue,
        endValue,
        endNum,
        startNum,
        type,
        specialProp,
        p,
        startUnit,
        endUnit,
        relative,
        isTransformRelated,
        transformPropTween,
        cache,
        smooth,
        hasPriority;
    _pluginInitted || _initCore();

    for (p in vars) {
      if (p === "autoRound") {
        continue;
      }

      endValue = vars[p];

      if (_gsapCore._plugins[p] && (0, _gsapCore._checkPlugin)(p, vars, tween, index, target, targets)) {
        // plugins
        continue;
      }

      type = typeof endValue;
      specialProp = _specialProps[p];

      if (type === "function") {
        endValue = endValue.call(tween, index, target, targets);
        type = typeof endValue;
      }

      if (type === "string" && ~endValue.indexOf("random(")) {
        endValue = (0, _gsapCore._replaceRandom)(endValue);
      }

      if (specialProp) {
        specialProp(this, target, p, endValue, tween) && (hasPriority = 1);
      } else if (p.substr(0, 2) === "--") {
        //CSS variable
        startValue = (getComputedStyle(target).getPropertyValue(p) + "").trim();
        endValue += "";
        startUnit = (0, _gsapCore.getUnit)(startValue);
        endUnit = (0, _gsapCore.getUnit)(endValue);
        endUnit ? startUnit !== endUnit && (startValue = _convertToUnit(target, p, startValue, endUnit) + endUnit) : startUnit && (endValue += startUnit);
        this.add(style, "setProperty", startValue, endValue, index, targets, 0, 0, p);
      } else if (type !== "undefined") {
        if (startAt && p in startAt) {
          // in case someone hard-codes a complex value as the start, like top: "calc(2vh / 2)". Without this, it'd use the computed value (always in px)
          startValue = typeof startAt[p] === "function" ? startAt[p].call(tween, index, target, targets) : startAt[p];
          p in _gsapCore._config.units && !(0, _gsapCore.getUnit)(startValue) && (startValue += _gsapCore._config.units[p]); // for cases when someone passes in a unitless value like {x: 100}; if we try setting translate(100, 0px) it won't work.

          (startValue + "").charAt(1) === "=" && (startValue = _get(target, p)); // can't work with relative values
        } else {
          startValue = _get(target, p);
        }

        startNum = parseFloat(startValue);
        relative = type === "string" && endValue.charAt(1) === "=" ? +(endValue.charAt(0) + "1") : 0;
        relative && (endValue = endValue.substr(2));
        endNum = parseFloat(endValue);

        if (p in _propertyAliases) {
          if (p === "autoAlpha") {
            //special case where we control the visibility along with opacity. We still allow the opacity value to pass through and get tweened.
            if (startNum === 1 && _get(target, "visibility") === "hidden" && endNum) {
              //if visibility is initially set to "hidden", we should interpret that as intent to make opacity 0 (a convenience)
              startNum = 0;
            }

            _addNonTweeningPT(this, style, "visibility", startNum ? "inherit" : "hidden", endNum ? "inherit" : "hidden", !endNum);
          }

          if (p !== "scale" && p !== "transform") {
            p = _propertyAliases[p];
            ~p.indexOf(",") && (p = p.split(",")[0]);
          }
        }

        isTransformRelated = p in _transformProps; //--- TRANSFORM-RELATED ---

        if (isTransformRelated) {
          if (!transformPropTween) {
            cache = target._gsap;
            cache.renderTransform && !vars.parseTransform || _parseTransform(target, vars.parseTransform); // if, for example, gsap.set(... {transform:"translateX(50vw)"}), the _get() call doesn't parse the transform, thus cache.renderTransform won't be set yet so force the parsing of the transform here.

            smooth = vars.smoothOrigin !== false && cache.smooth;
            transformPropTween = this._pt = new _gsapCore.PropTween(this._pt, style, _transformProp, 0, 1, cache.renderTransform, cache, 0, -1); //the first time through, create the rendering PropTween so that it runs LAST (in the linked list, we keep adding to the beginning)

            transformPropTween.dep = 1; //flag it as dependent so that if things get killed/overwritten and this is the only PropTween left, we can safely kill the whole tween.
          }

          if (p === "scale") {
            this._pt = new _gsapCore.PropTween(this._pt, cache, "scaleY", cache.scaleY, relative ? relative * endNum : endNum - cache.scaleY);
            props.push("scaleY", p);
            p += "X";
          } else if (p === "transformOrigin") {
            endValue = _convertKeywordsToPercentages(endValue); //in case something like "left top" or "bottom right" is passed in. Convert to percentages.

            if (cache.svg) {
              _applySVGOrigin(target, endValue, 0, smooth, 0, this);
            } else {
              endUnit = parseFloat(endValue.split(" ")[2]) || 0; //handle the zOrigin separately!

              endUnit !== cache.zOrigin && _addNonTweeningPT(this, cache, "zOrigin", cache.zOrigin, endUnit);

              _addNonTweeningPT(this, style, p, _firstTwoOnly(startValue), _firstTwoOnly(endValue));
            }

            continue;
          } else if (p === "svgOrigin") {
            _applySVGOrigin(target, endValue, 1, smooth, 0, this);

            continue;
          } else if (p in _rotationalProperties) {
            _addRotationalPropTween(this, cache, p, startNum, endValue, relative);

            continue;
          } else if (p === "smoothOrigin") {
            _addNonTweeningPT(this, cache, "smooth", cache.smooth, endValue);

            continue;
          } else if (p === "force3D") {
            cache[p] = endValue;
            continue;
          } else if (p === "transform") {
            _addRawTransformPTs(this, endValue, target);

            continue;
          }
        } else if (!(p in style)) {
          p = _checkPropPrefix(p) || p;
        }

        if (isTransformRelated || (endNum || endNum === 0) && (startNum || startNum === 0) && !_complexExp.test(endValue) && p in style) {
          startUnit = (startValue + "").substr((startNum + "").length);
          endNum || (endNum = 0); // protect against NaN

          endUnit = (0, _gsapCore.getUnit)(endValue) || (p in _gsapCore._config.units ? _gsapCore._config.units[p] : startUnit);
          startUnit !== endUnit && (startNum = _convertToUnit(target, p, startValue, endUnit));
          this._pt = new _gsapCore.PropTween(this._pt, isTransformRelated ? cache : style, p, startNum, relative ? relative * endNum : endNum - startNum, !isTransformRelated && (endUnit === "px" || p === "zIndex") && vars.autoRound !== false ? _renderRoundedCSSProp : _renderCSSProp);
          this._pt.u = endUnit || 0;

          if (startUnit !== endUnit) {
            //when the tween goes all the way back to the beginning, we need to revert it to the OLD/ORIGINAL value (with those units). We record that as a "b" (beginning) property and point to a render method that handles that. (performance optimization)
            this._pt.b = startValue;
            this._pt.r = _renderCSSPropWithBeginning;
          }
        } else if (!(p in style)) {
          if (p in target) {
            //maybe it's not a style - it could be a property added directly to an element in which case we'll try to animate that.
            this.add(target, p, target[p], endValue, index, targets);
          } else {
            (0, _gsapCore._missingPlugin)(p, endValue);
            continue;
          }
        } else {
          _tweenComplexCSSString.call(this, target, p, startValue, endValue);
        }

        props.push(p);
      }
    }

    hasPriority && (0, _gsapCore._sortPropTweensByPriority)(this);
  },
  get: _get,
  aliases: _propertyAliases,
  getSetter: function getSetter(target, property, plugin) {
    //returns a setter function that accepts target, property, value and applies it accordingly. Remember, properties like "x" aren't as simple as target.style.property = value because they've got to be applied to a proxy object and then merged into a transform string in a renderer.
    var p = _propertyAliases[property];
    p && p.indexOf(",") < 0 && (property = p);
    return property in _transformProps && property !== _transformOriginProp && (target._gsap.x || _get(target, "x")) ? plugin && _recentSetterPlugin === plugin ? property === "scale" ? _setterScale : _setterTransform : (_recentSetterPlugin = plugin || {}) && (property === "scale" ? _setterScaleWithRender : _setterTransformWithRender) : target.style && !(0, _gsapCore._isUndefined)(target.style[property]) ? _setterCSSStyle : ~property.indexOf("-") ? _setterCSSProp : (0, _gsapCore._getSetter)(target, property);
  },
  core: {
    _removeProperty: _removeProperty,
    _getMatrix: _getMatrix
  }
};
exports.default = exports.CSSPlugin = CSSPlugin;
_gsapCore.gsap.utils.checkPrefix = _checkPropPrefix;

(function (positionAndScale, rotation, others, aliases) {
  var all = (0, _gsapCore._forEachName)(positionAndScale + "," + rotation + "," + others, function (name) {
    _transformProps[name] = 1;
  });
  (0, _gsapCore._forEachName)(rotation, function (name) {
    _gsapCore._config.units[name] = "deg";
    _rotationalProperties[name] = 1;
  });
  _propertyAliases[all[13]] = positionAndScale + "," + rotation;
  (0, _gsapCore._forEachName)(aliases, function (name) {
    var split = name.split(":");
    _propertyAliases[split[1]] = all[split[0]];
  });
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");

(0, _gsapCore._forEachName)("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function (name) {
  _gsapCore._config.units[name] = "px";
});

_gsapCore.gsap.registerPlugin(CSSPlugin);
},{"./gsap-core.js":"node_modules/gsap/gsap-core.js"}],"node_modules/gsap/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Power0", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power0;
  }
});
Object.defineProperty(exports, "Power1", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power1;
  }
});
Object.defineProperty(exports, "Power2", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power2;
  }
});
Object.defineProperty(exports, "Power3", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power3;
  }
});
Object.defineProperty(exports, "Power4", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power4;
  }
});
Object.defineProperty(exports, "Linear", {
  enumerable: true,
  get: function () {
    return _gsapCore.Linear;
  }
});
Object.defineProperty(exports, "Quad", {
  enumerable: true,
  get: function () {
    return _gsapCore.Quad;
  }
});
Object.defineProperty(exports, "Cubic", {
  enumerable: true,
  get: function () {
    return _gsapCore.Cubic;
  }
});
Object.defineProperty(exports, "Quart", {
  enumerable: true,
  get: function () {
    return _gsapCore.Quart;
  }
});
Object.defineProperty(exports, "Quint", {
  enumerable: true,
  get: function () {
    return _gsapCore.Quint;
  }
});
Object.defineProperty(exports, "Strong", {
  enumerable: true,
  get: function () {
    return _gsapCore.Strong;
  }
});
Object.defineProperty(exports, "Elastic", {
  enumerable: true,
  get: function () {
    return _gsapCore.Elastic;
  }
});
Object.defineProperty(exports, "Back", {
  enumerable: true,
  get: function () {
    return _gsapCore.Back;
  }
});
Object.defineProperty(exports, "SteppedEase", {
  enumerable: true,
  get: function () {
    return _gsapCore.SteppedEase;
  }
});
Object.defineProperty(exports, "Bounce", {
  enumerable: true,
  get: function () {
    return _gsapCore.Bounce;
  }
});
Object.defineProperty(exports, "Sine", {
  enumerable: true,
  get: function () {
    return _gsapCore.Sine;
  }
});
Object.defineProperty(exports, "Expo", {
  enumerable: true,
  get: function () {
    return _gsapCore.Expo;
  }
});
Object.defineProperty(exports, "Circ", {
  enumerable: true,
  get: function () {
    return _gsapCore.Circ;
  }
});
Object.defineProperty(exports, "TweenLite", {
  enumerable: true,
  get: function () {
    return _gsapCore.TweenLite;
  }
});
Object.defineProperty(exports, "TimelineLite", {
  enumerable: true,
  get: function () {
    return _gsapCore.TimelineLite;
  }
});
Object.defineProperty(exports, "TimelineMax", {
  enumerable: true,
  get: function () {
    return _gsapCore.TimelineMax;
  }
});
Object.defineProperty(exports, "CSSPlugin", {
  enumerable: true,
  get: function () {
    return _CSSPlugin.CSSPlugin;
  }
});
exports.TweenMax = exports.default = exports.gsap = void 0;

var _gsapCore = require("./gsap-core.js");

var _CSSPlugin = require("./CSSPlugin.js");

var gsapWithCSS = _gsapCore.gsap.registerPlugin(_CSSPlugin.CSSPlugin) || _gsapCore.gsap,
    // to protect from tree shaking
TweenMaxWithCSS = gsapWithCSS.core.Tween;

exports.TweenMax = TweenMaxWithCSS;
exports.default = exports.gsap = gsapWithCSS;
},{"./gsap-core.js":"node_modules/gsap/gsap-core.js","./CSSPlugin.js":"node_modules/gsap/CSSPlugin.js"}],"node_modules/tweakpane/dist/tweakpane.js":[function(require,module,exports) {
var define;
var global = arguments[3];
/*! Tweakpane 2.1.1 (c) 2016 cocopon, licensed under the MIT license. */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Tweakpane = factory());
}(this, (function () { 'use strict';

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    var Plugins = {
        inputs: [],
        monitors: [],
    };
    function getAllPlugins() {
        return __spreadArrays(Plugins.inputs, Plugins.monitors);
    }

    var PREFIX = 'tp';
    /**
     * A utility function for generating BEM-like class name.
     * @param viewName The name of the view. Used as part of the block name.
     * @return A class name generator function.
     */
    function ClassName(viewName) {
        /**
         * Generates a class name.
         * @param [opt_elementName] The name of the element.
         * @param [opt_modifier] The name of the modifier.
         * @return A class name.
         */
        var fn = function (opt_elementName, opt_modifier) {
            return [
                PREFIX,
                '-',
                viewName,
                'v',
                opt_elementName ? "_" + opt_elementName : '',
                opt_modifier ? "-" + opt_modifier : '',
            ].join('');
        };
        return fn;
    }

    var className$m = ClassName('lbl');
    function createLabelNode(doc, label) {
        var frag = doc.createDocumentFragment();
        var lineNodes = label.split('\n').map(function (line) {
            return doc.createTextNode(line);
        });
        lineNodes.forEach(function (lineNode, index) {
            if (index > 0) {
                frag.appendChild(doc.createElement('br'));
            }
            frag.appendChild(lineNode);
        });
        return frag;
    }
    /**
     * @hidden
     */
    var LabeledView = /** @class */ (function () {
        function LabeledView(doc, config) {
            this.label = config.label;
            this.element = doc.createElement('div');
            this.element.classList.add(className$m());
            if (this.label !== undefined) {
                var labelElem = doc.createElement('div');
                labelElem.classList.add(className$m('l'));
                labelElem.appendChild(createLabelNode(doc, this.label));
                this.element.appendChild(labelElem);
            }
            else {
                this.element.classList.add(className$m(undefined, 'nol'));
            }
            var valueElem = doc.createElement('div');
            valueElem.classList.add(className$m('v'));
            this.element.appendChild(valueElem);
            this.valueElement = valueElem;
        }
        return LabeledView;
    }());

    function disposeElement(elem) {
        if (elem && elem.parentElement) {
            elem.parentElement.removeChild(elem);
        }
        return null;
    }

    function getAllBladePositions() {
        return ['first', 'last'];
    }

    var className$l = ClassName('');
    function setUpBladeView(view, model) {
        var elem = view.element;
        model.emitter.on('change', function (ev) {
            if (ev.propertyName === 'hidden') {
                var hiddenClass = className$l(undefined, 'hidden');
                if (model.hidden) {
                    elem.classList.add(hiddenClass);
                }
                else {
                    elem.classList.remove(hiddenClass);
                }
            }
            else if (ev.propertyName === 'positions') {
                getAllBladePositions().forEach(function (pos) {
                    elem.classList.remove(className$l(undefined, pos));
                });
                model.positions.forEach(function (pos) {
                    elem.classList.add(className$l(undefined, pos));
                });
            }
        });
        model.emitter.on('dispose', function () {
            if (view.onDispose) {
                view.onDispose();
            }
            disposeElement(elem);
        });
    }

    /**
     * @hidden
     */
    var InputBindingController = /** @class */ (function () {
        function InputBindingController(doc, config) {
            this.binding = config.binding;
            this.controller = config.controller;
            this.view = new LabeledView(doc, {
                label: config.label,
            });
            this.view.valueElement.appendChild(this.controller.view.element);
            this.blade = config.blade;
            setUpBladeView(this.view, this.blade);
        }
        return InputBindingController;
    }());

    /**
     * @hidden
     */
    var MonitorBindingController = /** @class */ (function () {
        function MonitorBindingController(doc, config) {
            var _this = this;
            this.binding = config.binding;
            this.controller = config.controller;
            this.view = new LabeledView(doc, {
                label: config.label,
            });
            this.view.valueElement.appendChild(this.controller.view.element);
            this.blade = config.blade;
            this.blade.emitter.on('dispose', function () {
                _this.binding.dispose();
            });
            setUpBladeView(this.view, this.blade);
        }
        return MonitorBindingController;
    }());

    function forceCast(v) {
        return v;
    }
    function isEmpty(value) {
        return value === null || value === undefined;
    }
    function deepEqualsArray(a1, a2) {
        if (a1.length !== a2.length) {
            return false;
        }
        for (var i = 0; i < a1.length; i++) {
            if (a1[i] !== a2[i]) {
                return false;
            }
        }
        return true;
    }

    /**
     * A type-safe event emitter.
     * @template E The interface that maps event names and event objects.
     */
    var Emitter = /** @class */ (function () {
        function Emitter() {
            this.observers_ = {};
        }
        /**
         * Adds an event listener to the emitter.
         * @param eventName The event name to listen.
         * @param handler The event handler.
         */
        Emitter.prototype.on = function (eventName, handler) {
            var observers = this.observers_[eventName];
            if (!observers) {
                observers = this.observers_[eventName] = [];
            }
            observers.push({
                handler: handler,
            });
            return this;
        };
        /**
         * Removes an event listener from the emitter.
         * @param eventName The event name.
         * @param handler The event handler to remove.
         */
        Emitter.prototype.off = function (eventName, handler) {
            var observers = this.observers_[eventName];
            if (observers) {
                this.observers_[eventName] = observers.filter(function (observer) {
                    return observer.handler !== handler;
                });
            }
            return this;
        };
        Emitter.prototype.emit = function (eventName, event) {
            var observers = this.observers_[eventName];
            if (!observers) {
                return;
            }
            observers.forEach(function (observer) {
                observer.handler(event);
            });
        };
        return Emitter;
    }());

    /**
     * @hidden
     */
    var Button = /** @class */ (function () {
        function Button(title) {
            this.emitter = new Emitter();
            this.title = title;
        }
        Button.prototype.click = function () {
            this.emitter.emit('click', {
                sender: this,
            });
        };
        return Button;
    }());

    var className$k = ClassName('btn');
    /**
     * @hidden
     */
    var ButtonView = /** @class */ (function () {
        function ButtonView(doc, config) {
            this.button = config.button;
            this.element = doc.createElement('div');
            this.element.classList.add(className$k());
            var buttonElem = doc.createElement('button');
            buttonElem.classList.add(className$k('b'));
            buttonElem.textContent = this.button.title;
            this.element.appendChild(buttonElem);
            this.buttonElement = buttonElem;
        }
        return ButtonView;
    }());

    /**
     * @hidden
     */
    var ButtonController = /** @class */ (function () {
        function ButtonController(doc, config) {
            this.onButtonClick_ = this.onButtonClick_.bind(this);
            this.button = new Button(config.title);
            this.view = new ButtonView(doc, {
                button: this.button,
            });
            this.view.buttonElement.addEventListener('click', this.onButtonClick_);
        }
        ButtonController.prototype.onButtonClick_ = function () {
            this.button.click();
        };
        return ButtonController;
    }());

    /**
     * @hidden
     */
    var Disposable = /** @class */ (function () {
        function Disposable() {
            this.emitter = new Emitter();
            this.disposed_ = false;
        }
        Object.defineProperty(Disposable.prototype, "disposed", {
            get: function () {
                return this.disposed_;
            },
            enumerable: false,
            configurable: true
        });
        Disposable.prototype.dispose = function () {
            if (this.disposed_) {
                return false;
            }
            this.disposed_ = true;
            this.emitter.emit('dispose', {
                sender: this,
            });
            return true;
        };
        return Disposable;
    }());

    var Blade = /** @class */ (function () {
        function Blade() {
            this.onDispose_ = this.onDispose_.bind(this);
            this.emitter = new Emitter();
            this.positions_ = [];
            this.hidden_ = false;
            this.disposable_ = new Disposable();
            this.disposable_.emitter.on('dispose', this.onDispose_);
        }
        Object.defineProperty(Blade.prototype, "hidden", {
            get: function () {
                return this.hidden_;
            },
            set: function (hidden) {
                if (this.hidden_ === hidden) {
                    return;
                }
                this.hidden_ = hidden;
                this.emitter.emit('change', {
                    propertyName: 'hidden',
                    sender: this,
                });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Blade.prototype, "positions", {
            get: function () {
                return this.positions_;
            },
            set: function (positions) {
                if (deepEqualsArray(positions, this.positions_)) {
                    return;
                }
                this.positions_ = positions;
                this.emitter.emit('change', {
                    propertyName: 'positions',
                    sender: this,
                });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Blade.prototype, "disposed", {
            get: function () {
                return this.disposable_.disposed;
            },
            enumerable: false,
            configurable: true
        });
        Blade.prototype.dispose = function () {
            this.disposable_.dispose();
        };
        Blade.prototype.onDispose_ = function () {
            this.emitter.emit('dispose', {
                sender: this,
            });
        };
        return Blade;
    }());

    var SVG_NS = 'http://www.w3.org/2000/svg';
    function forceReflow(element) {
        element.offsetHeight;
    }
    function disableTransitionTemporarily(element, callback) {
        var t = element.style.transition;
        element.style.transition = 'none';
        callback();
        element.style.transition = t;
    }
    function supportsTouch(doc) {
        return doc.ontouchstart !== undefined;
    }
    function getGlobalObject() {
        return new Function('return this')();
    }
    function getWindowDocument() {
        var globalObj = forceCast(getGlobalObject());
        return globalObj.document;
    }
    function isBrowser() {
        return 'document' in getGlobalObject();
    }
    function getCanvasContext(canvasElement) {
        // HTMLCanvasElement.prototype.getContext is not defined on testing environment
        return isBrowser() ? canvasElement.getContext('2d') : null;
    }
    var ICON_ID_TO_INNER_HTML_MAP = {
        check: '<path d="M2 8l4 4l8 -8"/>',
        dropdown: '<path d="M5 7h6l-3 3 z"/>',
        p2dpad: '<path d="M8 4v8"/><path d="M4 8h8"/><circle cx="12" cy="12" r="1.2"/>',
    };
    function createSvgIconElement(document, iconId) {
        var elem = document.createElementNS(SVG_NS, 'svg');
        elem.innerHTML = ICON_ID_TO_INNER_HTML_MAP[iconId];
        return elem;
    }
    function insertElementAt(parentElement, element, index) {
        parentElement.insertBefore(element, parentElement.children[index]);
    }
    function findNextTarget(ev) {
        if (ev.relatedTarget) {
            return forceCast(ev.relatedTarget);
        }
        // Workaround for Firefox
        if ('explicitOriginalTarget' in ev) {
            return ev.explicitOriginalTarget;
        }
        // TODO: Workaround for Safari
        // Safari doesn't set next target for some elements
        // (e.g. button, input[type=checkbox], etc.)
        return null;
    }

    function updateAllItemsPositions(bladeRack) {
        var visibleItems = bladeRack.items.filter(function (bc) { return !bc.blade.hidden; });
        var firstVisibleItem = visibleItems[0];
        var lastVisibleItem = visibleItems[visibleItems.length - 1];
        bladeRack.items.forEach(function (bc) {
            var ps = [];
            if (bc === firstVisibleItem) {
                ps.push('first');
            }
            if (bc === lastVisibleItem) {
                ps.push('last');
            }
            bc.blade.positions = ps;
        });
    }
    /**
     * @hidden
     */
    function computeExpandedFolderHeight(folder, containerElement) {
        var height = 0;
        disableTransitionTemporarily(containerElement, function () {
            // Expand folder temporarily
            folder.expandedHeight = null;
            folder.temporaryExpanded = true;
            forceReflow(containerElement);
            // Compute height
            height = containerElement.clientHeight;
            // Restore expanded
            folder.temporaryExpanded = null;
            forceReflow(containerElement);
        });
        return height;
    }

    /**
     * @hidden
     */
    var List = /** @class */ (function () {
        function List() {
            this.emitter = new Emitter();
            this.items_ = [];
        }
        Object.defineProperty(List.prototype, "items", {
            get: function () {
                return this.items_;
            },
            enumerable: false,
            configurable: true
        });
        List.prototype.add = function (item, opt_index) {
            var index = opt_index !== undefined ? opt_index : this.items_.length;
            this.items_.splice(index, 0, item);
            this.emitter.emit('add', {
                index: index,
                item: item,
                sender: this,
            });
        };
        List.prototype.remove = function (item) {
            var index = this.items_.indexOf(item);
            if (index < 0) {
                return;
            }
            this.items_.splice(index, 1);
            this.emitter.emit('remove', {
                sender: this,
            });
        };
        return List;
    }());

    function findInputBindingController(bcs, b) {
        for (var i = 0; i < bcs.length; i++) {
            var bc = bcs[i];
            if (bc instanceof InputBindingController && bc.binding === b) {
                return bc;
            }
        }
        return null;
    }
    function findMonitorBindingController(bcs, b) {
        for (var i = 0; i < bcs.length; i++) {
            var bc = bcs[i];
            if (bc instanceof MonitorBindingController && bc.binding === b) {
                return bc;
            }
        }
        return null;
    }
    function findFolderController(bcs, f) {
        for (var i = 0; i < bcs.length; i++) {
            var bc = bcs[i];
            if (bc instanceof FolderController && bc.folder === f) {
                return bc;
            }
        }
        return null;
    }
    /**
     * @hidden
     */
    var BladeRack = /** @class */ (function () {
        function BladeRack() {
            this.onItemFolderFold_ = this.onItemFolderFold_.bind(this);
            this.onListItemLayout_ = this.onListItemLayout_.bind(this);
            this.onSubitemLayout_ = this.onSubitemLayout_.bind(this);
            this.onSubitemFolderFold_ = this.onSubitemFolderFold_.bind(this);
            this.onSubitemInputChange_ = this.onSubitemInputChange_.bind(this);
            this.onSubitemMonitorUpdate_ = this.onSubitemMonitorUpdate_.bind(this);
            this.onItemInputChange_ = this.onItemInputChange_.bind(this);
            this.onListAdd_ = this.onListAdd_.bind(this);
            this.onListItemDispose_ = this.onListItemDispose_.bind(this);
            this.onListRemove_ = this.onListRemove_.bind(this);
            this.onItemMonitorUpdate_ = this.onItemMonitorUpdate_.bind(this);
            this.bcList_ = new List();
            this.emitter = new Emitter();
            this.bcList_.emitter.on('add', this.onListAdd_);
            this.bcList_.emitter.on('remove', this.onListRemove_);
        }
        Object.defineProperty(BladeRack.prototype, "items", {
            get: function () {
                return this.bcList_.items;
            },
            enumerable: false,
            configurable: true
        });
        BladeRack.prototype.add = function (bc, opt_index) {
            this.bcList_.add(bc, opt_index);
        };
        BladeRack.prototype.find = function (controllerClass) {
            return this.items.reduce(function (results, bc) {
                if (bc instanceof FolderController) {
                    results.push.apply(results, bc.bladeRack.find(controllerClass));
                }
                if (bc instanceof controllerClass) {
                    results.push(bc);
                }
                return results;
            }, []);
        };
        BladeRack.prototype.onListAdd_ = function (ev) {
            var bc = ev.item;
            this.emitter.emit('add', {
                bladeController: bc,
                index: ev.index,
                sender: this,
            });
            bc.blade.emitter.on('dispose', this.onListItemDispose_);
            bc.blade.emitter.on('change', this.onListItemLayout_);
            if (bc instanceof InputBindingController) {
                bc.binding.emitter.on('change', this.onItemInputChange_);
            }
            else if (bc instanceof MonitorBindingController) {
                bc.binding.emitter.on('update', this.onItemMonitorUpdate_);
            }
            else if (bc instanceof FolderController) {
                bc.folder.emitter.on('change', this.onItemFolderFold_);
                var emitter = bc.bladeRack.emitter;
                emitter.on('itemfold', this.onSubitemFolderFold_);
                emitter.on('itemlayout', this.onSubitemLayout_);
                emitter.on('inputchange', this.onSubitemInputChange_);
                emitter.on('monitorupdate', this.onSubitemMonitorUpdate_);
            }
        };
        BladeRack.prototype.onListRemove_ = function (_) {
            this.emitter.emit('remove', {
                sender: this,
            });
        };
        BladeRack.prototype.onListItemLayout_ = function (ev) {
            if (ev.propertyName === 'hidden' || ev.propertyName === 'positions') {
                this.emitter.emit('itemlayout', {
                    sender: this,
                });
            }
        };
        BladeRack.prototype.onListItemDispose_ = function (_) {
            var _this = this;
            var disposedUcs = this.bcList_.items.filter(function (bc) {
                return bc.blade.disposed;
            });
            disposedUcs.forEach(function (bc) {
                _this.bcList_.remove(bc);
            });
        };
        BladeRack.prototype.onItemInputChange_ = function (ev) {
            var ibc = findInputBindingController(this.find(InputBindingController), ev.sender);
            if (!ibc) {
                return;
            }
            this.emitter.emit('inputchange', {
                bindingController: ibc,
                sender: this,
            });
        };
        BladeRack.prototype.onItemMonitorUpdate_ = function (ev) {
            var mbc = findMonitorBindingController(this.find(MonitorBindingController), ev.sender);
            if (!mbc) {
                return;
            }
            this.emitter.emit('monitorupdate', {
                bindingController: mbc,
                sender: this,
            });
        };
        BladeRack.prototype.onItemFolderFold_ = function (ev) {
            if (ev.propertyName !== 'expanded') {
                return;
            }
            var fc = findFolderController(this.find(FolderController), ev.sender);
            if (fc) {
                this.emitter.emit('itemfold', {
                    folderController: fc,
                    sender: this,
                });
            }
        };
        BladeRack.prototype.onSubitemLayout_ = function (_) {
            this.emitter.emit('itemlayout', {
                sender: this,
            });
        };
        BladeRack.prototype.onSubitemInputChange_ = function (ev) {
            this.emitter.emit('inputchange', {
                bindingController: ev.bindingController,
                sender: this,
            });
        };
        BladeRack.prototype.onSubitemMonitorUpdate_ = function (ev) {
            this.emitter.emit('monitorupdate', {
                bindingController: ev.bindingController,
                sender: this,
            });
        };
        BladeRack.prototype.onSubitemFolderFold_ = function (ev) {
            this.emitter.emit('itemfold', {
                folderController: ev.folderController,
                sender: this,
            });
        };
        return BladeRack;
    }());

    /**
     * @hidden
     */
    var Folder = /** @class */ (function () {
        function Folder(title, expanded) {
            this.emitter = new Emitter();
            this.expanded_ = expanded;
            this.expandedHeight_ = null;
            this.temporaryExpanded_ = null;
            this.shouldFixHeight_ = false;
            this.title = title;
        }
        Object.defineProperty(Folder.prototype, "expanded", {
            get: function () {
                return this.expanded_;
            },
            set: function (expanded) {
                var changed = this.expanded_ !== expanded;
                if (!changed) {
                    return;
                }
                this.emitter.emit('beforechange', {
                    propertyName: 'expanded',
                    sender: this,
                });
                this.expanded_ = expanded;
                this.emitter.emit('change', {
                    propertyName: 'expanded',
                    sender: this,
                });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Folder.prototype, "temporaryExpanded", {
            get: function () {
                return this.temporaryExpanded_;
            },
            set: function (expanded) {
                var changed = this.temporaryExpanded_ !== expanded;
                if (!changed) {
                    return;
                }
                this.emitter.emit('beforechange', {
                    propertyName: 'temporaryExpanded',
                    sender: this,
                });
                this.temporaryExpanded_ = expanded;
                this.emitter.emit('change', {
                    propertyName: 'temporaryExpanded',
                    sender: this,
                });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Folder.prototype, "expandedHeight", {
            get: function () {
                return this.expandedHeight_;
            },
            set: function (expandedHeight) {
                var changed = this.expandedHeight_ !== expandedHeight;
                if (!changed) {
                    return;
                }
                this.emitter.emit('beforechange', {
                    propertyName: 'expandedHeight',
                    sender: this,
                });
                this.expandedHeight_ = expandedHeight;
                this.emitter.emit('change', {
                    propertyName: 'expandedHeight',
                    sender: this,
                });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Folder.prototype, "shouldFixHeight", {
            get: function () {
                return this.shouldFixHeight_;
            },
            set: function (shouldFixHeight) {
                var changed = this.shouldFixHeight_ !== shouldFixHeight;
                if (!changed) {
                    return;
                }
                this.emitter.emit('beforechange', {
                    propertyName: 'shouldFixHeight',
                    sender: this,
                });
                this.shouldFixHeight_ = shouldFixHeight;
                this.emitter.emit('change', {
                    propertyName: 'shouldFixHeight',
                    sender: this,
                });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Folder.prototype, "styleExpanded", {
            get: function () {
                var _a;
                return (_a = this.temporaryExpanded) !== null && _a !== void 0 ? _a : this.expanded;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Folder.prototype, "styleHeight", {
            get: function () {
                if (!this.styleExpanded) {
                    return '0';
                }
                if (this.shouldFixHeight && !isEmpty(this.expandedHeight)) {
                    return this.expandedHeight + "px";
                }
                return 'auto';
            },
            enumerable: false,
            configurable: true
        });
        return Folder;
    }());

    /**
     * @hidden
     */
    var FolderView = /** @class */ (function () {
        function FolderView(doc, config) {
            this.onFolderChange_ = this.onFolderChange_.bind(this);
            this.folder_ = config.folder;
            this.folder_.emitter.on('change', this.onFolderChange_);
            this.className_ = ClassName(config.viewName || 'fld');
            this.element = doc.createElement('div');
            this.element.classList.add(this.className_());
            var titleElem = doc.createElement('button');
            titleElem.classList.add(this.className_('t'));
            titleElem.textContent = this.folder_.title;
            if (config.hidesTitle) {
                titleElem.style.display = 'none';
            }
            this.element.appendChild(titleElem);
            this.titleElement = titleElem;
            var markElem = doc.createElement('div');
            markElem.classList.add(this.className_('m'));
            this.titleElement.appendChild(markElem);
            var containerElem = doc.createElement('div');
            containerElem.classList.add(this.className_('c'));
            this.element.appendChild(containerElem);
            this.containerElement = containerElem;
            this.applyModel_();
        }
        FolderView.prototype.applyModel_ = function () {
            var expanded = this.folder_.styleExpanded;
            var expandedClass = this.className_(undefined, 'expanded');
            if (expanded) {
                this.element.classList.add(expandedClass);
            }
            else {
                this.element.classList.remove(expandedClass);
            }
            this.containerElement.style.height = this.folder_.styleHeight;
        };
        FolderView.prototype.onFolderChange_ = function () {
            this.applyModel_();
        };
        return FolderView;
    }());

    /**
     * @hidden
     */
    var FolderController = /** @class */ (function () {
        function FolderController(doc, config) {
            var _a;
            this.onContainerTransitionEnd_ = this.onContainerTransitionEnd_.bind(this);
            this.onFolderBeforeChange_ = this.onFolderBeforeChange_.bind(this);
            this.onTitleClick_ = this.onTitleClick_.bind(this);
            this.onRackAdd_ = this.onRackAdd_.bind(this);
            this.onRackItemLayout_ = this.onRackItemLayout_.bind(this);
            this.onRackRemove_ = this.onRackRemove_.bind(this);
            this.blade = config.blade;
            this.folder = new Folder(config.title, (_a = config.expanded) !== null && _a !== void 0 ? _a : true);
            this.folder.emitter.on('beforechange', this.onFolderBeforeChange_);
            var rack = new BladeRack();
            rack.emitter.on('add', this.onRackAdd_);
            rack.emitter.on('itemlayout', this.onRackItemLayout_);
            rack.emitter.on('remove', this.onRackRemove_);
            this.bladeRack = rack;
            this.doc_ = doc;
            this.view = new FolderView(this.doc_, {
                folder: this.folder,
                hidesTitle: config.hidesTitle,
                viewName: config.viewName,
            });
            this.view.titleElement.addEventListener('click', this.onTitleClick_);
            this.view.containerElement.addEventListener('transitionend', this.onContainerTransitionEnd_);
            setUpBladeView(this.view, this.blade);
        }
        Object.defineProperty(FolderController.prototype, "document", {
            get: function () {
                return this.doc_;
            },
            enumerable: false,
            configurable: true
        });
        FolderController.prototype.onFolderBeforeChange_ = function (ev) {
            if (ev.propertyName !== 'expanded') {
                return;
            }
            if (isEmpty(this.folder.expandedHeight)) {
                this.folder.expandedHeight = computeExpandedFolderHeight(this.folder, this.view.containerElement);
            }
            this.folder.shouldFixHeight = true;
            forceReflow(this.view.containerElement);
        };
        FolderController.prototype.onTitleClick_ = function () {
            this.folder.expanded = !this.folder.expanded;
        };
        FolderController.prototype.applyRackChange_ = function () {
            updateAllItemsPositions(this.bladeRack);
        };
        FolderController.prototype.onRackAdd_ = function (ev) {
            insertElementAt(this.view.containerElement, ev.bladeController.view.element, ev.index);
            this.applyRackChange_();
        };
        FolderController.prototype.onRackRemove_ = function (_) {
            this.applyRackChange_();
        };
        FolderController.prototype.onRackItemLayout_ = function (_) {
            this.applyRackChange_();
        };
        FolderController.prototype.onContainerTransitionEnd_ = function (ev) {
            if (ev.propertyName !== 'height') {
                return;
            }
            this.folder.shouldFixHeight = false;
            this.folder.expandedHeight = null;
        };
        return FolderController;
    }());

    var LabeledController = /** @class */ (function () {
        function LabeledController(doc, config) {
            this.blade = config.blade;
            this.valueController = config.valueController;
            this.view = new LabeledView(doc, {
                label: config.label,
            });
            this.view.valueElement.appendChild(this.valueController.view.element);
            setUpBladeView(this.view, this.blade);
        }
        return LabeledController;
    }());

    var className$j = ClassName('spt');
    /**
     * @hidden
     */
    var SeparatorView = /** @class */ (function () {
        function SeparatorView(doc) {
            this.element = doc.createElement('div');
            this.element.classList.add(className$j());
            var hrElem = doc.createElement('hr');
            hrElem.classList.add(className$j('r'));
            this.element.appendChild(hrElem);
        }
        return SeparatorView;
    }());

    /**
     * @hidden
     */
    var SeparatorController = /** @class */ (function () {
        function SeparatorController(doc, config) {
            this.blade = config.blade;
            this.view = new SeparatorView(doc);
            setUpBladeView(this.view, this.blade);
        }
        return SeparatorController;
    }());

    var ButtonApi = /** @class */ (function () {
        /**
         * @hidden
         */
        function ButtonApi(buttonController) {
            this.controller = buttonController;
        }
        Object.defineProperty(ButtonApi.prototype, "hidden", {
            get: function () {
                return this.controller.blade.hidden;
            },
            set: function (hidden) {
                this.controller.blade.hidden = hidden;
            },
            enumerable: false,
            configurable: true
        });
        ButtonApi.prototype.dispose = function () {
            this.controller.blade.dispose();
        };
        ButtonApi.prototype.on = function (eventName, handler) {
            var emitter = this.controller.valueController.button.emitter;
            // TODO: Type-safe
            emitter.on(eventName, forceCast(handler.bind(this)));
            return this;
        };
        return ButtonApi;
    }());

    /**
     * A base class of Tweakpane API events.
     */
    var TpEvent = /** @class */ (function () {
        /**
         * @hidden
         */
        function TpEvent(target) {
            this.target = target;
        }
        return TpEvent;
    }());
    /**
     * An event class for value changes of input bindings.
     * @template T The type of the value.
     */
    var TpChangeEvent = /** @class */ (function (_super) {
        __extends(TpChangeEvent, _super);
        /**
         * @hidden
         */
        function TpChangeEvent(target, value, presetKey) {
            var _this = _super.call(this, target) || this;
            _this.value = value;
            _this.presetKey = presetKey;
            return _this;
        }
        return TpChangeEvent;
    }(TpEvent));
    /**
     * An event class for value updates of monitor bindings.
     * @template T The type of the value.
     */
    var TpUpdateEvent = /** @class */ (function (_super) {
        __extends(TpUpdateEvent, _super);
        /**
         * @hidden
         */
        function TpUpdateEvent(target, value, presetKey) {
            var _this = _super.call(this, target) || this;
            _this.value = value;
            _this.presetKey = presetKey;
            return _this;
        }
        return TpUpdateEvent;
    }(TpEvent));
    /**
     * An event class for folder.
     */
    var TpFoldEvent = /** @class */ (function (_super) {
        __extends(TpFoldEvent, _super);
        /**
         * @hidden
         */
        function TpFoldEvent(target, expanded) {
            var _this = _super.call(this, target) || this;
            _this.expanded = expanded;
            return _this;
        }
        return TpFoldEvent;
    }(TpEvent));

    /**
     * The API for the input binding between the parameter and the pane.
     * @template In The internal type.
     * @template Ex The external type (= parameter object).
     */
    var InputBindingApi = /** @class */ (function () {
        /**
         * @hidden
         */
        function InputBindingApi(bindingController) {
            this.onBindingChange_ = this.onBindingChange_.bind(this);
            this.emitter_ = new Emitter();
            this.controller = bindingController;
            this.controller.binding.emitter.on('change', this.onBindingChange_);
        }
        Object.defineProperty(InputBindingApi.prototype, "hidden", {
            get: function () {
                return this.controller.blade.hidden;
            },
            set: function (hidden) {
                this.controller.blade.hidden = hidden;
            },
            enumerable: false,
            configurable: true
        });
        InputBindingApi.prototype.dispose = function () {
            this.controller.blade.dispose();
        };
        InputBindingApi.prototype.on = function (eventName, handler) {
            var bh = handler.bind(this);
            this.emitter_.on(eventName, function (ev) {
                bh(ev.event);
            });
            return this;
        };
        InputBindingApi.prototype.refresh = function () {
            this.controller.binding.read();
        };
        InputBindingApi.prototype.onBindingChange_ = function (ev) {
            var value = ev.sender.target.read();
            this.emitter_.emit('change', {
                event: new TpChangeEvent(this, forceCast(value), this.controller.binding.target.presetKey),
            });
        };
        return InputBindingApi;
    }());

    var CREATE_MESSAGE_MAP = {
        alreadydisposed: function () { return 'View has been already disposed'; },
        invalidparams: function (context) { return "Invalid parameters for '" + context.name + "'"; },
        nomatchingcontroller: function (context) {
            return "No matching controller for '" + context.key + "'";
        },
        notbindable: function () { return "Value is not bindable"; },
        propertynotfound: function (context) { return "Property '" + context.name + "' not found"; },
        shouldneverhappen: function () { return 'This error should never happen'; },
    };
    var TpError = /** @class */ (function () {
        function TpError(config) {
            var _a;
            this.message = (_a = CREATE_MESSAGE_MAP[config.type](forceCast(config.context))) !== null && _a !== void 0 ? _a : 'Unexpected error';
            this.name = this.constructor.name;
            this.stack = new Error(this.message).stack;
            this.type = config.type;
        }
        TpError.alreadyDisposed = function () {
            return new TpError({ type: 'alreadydisposed' });
        };
        TpError.notBindable = function () {
            return new TpError({
                type: 'notbindable',
            });
        };
        TpError.propertyNotFound = function (name) {
            return new TpError({
                type: 'propertynotfound',
                context: {
                    name: name,
                },
            });
        };
        TpError.shouldNeverHappen = function () {
            return new TpError({ type: 'shouldneverhappen' });
        };
        return TpError;
    }());
    TpError.prototype = Object.create(Error.prototype);
    TpError.prototype.constructor = TpError;

    /**
     * @hidden
     */
    var InputBinding = /** @class */ (function () {
        function InputBinding(config) {
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.reader = config.reader;
            this.writer = config.writer;
            this.emitter = new Emitter();
            this.value = config.value;
            this.value.emitter.on('change', this.onValueChange_);
            this.target = config.target;
            this.read();
        }
        InputBinding.prototype.read = function () {
            var targetValue = this.target.read();
            if (targetValue !== undefined) {
                this.value.rawValue = this.reader(targetValue);
            }
        };
        InputBinding.prototype.write_ = function (rawValue) {
            this.writer(this.target, rawValue);
        };
        InputBinding.prototype.onValueChange_ = function (ev) {
            this.write_(ev.rawValue);
            this.emitter.emit('change', {
                rawValue: ev.rawValue,
                sender: this,
            });
        };
        return InputBinding;
    }());

    /**
     * A model for handling value changes.
     * @template T The type of the raw value.
     */
    var Value = /** @class */ (function () {
        function Value(initialValue, config) {
            var _a;
            this.constraint_ = config === null || config === void 0 ? void 0 : config.constraint;
            this.equals_ = (_a = config === null || config === void 0 ? void 0 : config.equals) !== null && _a !== void 0 ? _a : (function (v1, v2) { return v1 === v2; });
            this.emitter = new Emitter();
            this.rawValue_ = initialValue;
        }
        Object.defineProperty(Value.prototype, "constraint", {
            get: function () {
                return this.constraint_;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Value.prototype, "rawValue", {
            /**
             * The raw value of the model.
             */
            get: function () {
                return this.rawValue_;
            },
            set: function (rawValue) {
                var constrainedValue = this.constraint_
                    ? this.constraint_.constrain(rawValue)
                    : rawValue;
                var changed = !this.equals_(this.rawValue_, constrainedValue);
                if (changed) {
                    this.rawValue_ = constrainedValue;
                    this.emitter.emit('change', {
                        rawValue: constrainedValue,
                        sender: this,
                    });
                }
            },
            enumerable: false,
            configurable: true
        });
        return Value;
    }());

    function createController$7(plugin, args) {
        var initialValue = plugin.accept(args.target.read(), args.params);
        if (initialValue === null) {
            return null;
        }
        var valueArgs = {
            target: args.target,
            initialValue: initialValue,
            params: args.params,
        };
        var reader = plugin.binding.reader(valueArgs);
        var constraint = plugin.binding.constraint
            ? plugin.binding.constraint(valueArgs)
            : undefined;
        var value = new Value(reader(initialValue), {
            constraint: constraint,
            equals: plugin.binding.equals,
        });
        var binding = new InputBinding({
            reader: reader,
            target: args.target,
            value: value,
            writer: plugin.binding.writer(valueArgs),
        });
        var controller = plugin.controller({
            document: args.document,
            initialValue: initialValue,
            params: args.params,
            value: binding.value,
        });
        return new InputBindingController(args.document, {
            binding: binding,
            controller: controller,
            label: args.params.label || args.target.key,
            blade: new Blade(),
        });
    }

    /**
     * @hidden
     */
    function createInputBindingController(document, target, params) {
        var initialValue = target.read();
        if (isEmpty(initialValue)) {
            throw new TpError({
                context: {
                    key: target.key,
                },
                type: 'nomatchingcontroller',
            });
        }
        var bc = Plugins.inputs.reduce(function (result, plugin) {
            return result ||
                createController$7(plugin, {
                    document: document,
                    target: target,
                    params: params,
                });
        }, null);
        if (bc) {
            return bc;
        }
        throw new TpError({
            context: {
                key: target.key,
            },
            type: 'nomatchingcontroller',
        });
    }

    /**
     * The API for the monitor binding between the parameter and the pane.
     */
    var MonitorBindingApi = /** @class */ (function () {
        /**
         * @hidden
         */
        function MonitorBindingApi(bindingController) {
            this.onBindingUpdate_ = this.onBindingUpdate_.bind(this);
            this.emitter_ = new Emitter();
            this.controller = bindingController;
            this.controller.binding.emitter.on('update', this.onBindingUpdate_);
        }
        Object.defineProperty(MonitorBindingApi.prototype, "hidden", {
            get: function () {
                return this.controller.blade.hidden;
            },
            set: function (hidden) {
                this.controller.blade.hidden = hidden;
            },
            enumerable: false,
            configurable: true
        });
        MonitorBindingApi.prototype.dispose = function () {
            this.controller.blade.dispose();
        };
        MonitorBindingApi.prototype.on = function (eventName, handler) {
            var bh = handler.bind(this);
            this.emitter_.on(eventName, function (ev) {
                bh(ev.event);
            });
            return this;
        };
        MonitorBindingApi.prototype.refresh = function () {
            this.controller.binding.read();
        };
        MonitorBindingApi.prototype.onBindingUpdate_ = function (ev) {
            var value = ev.sender.target.read();
            this.emitter_.emit('update', {
                event: new TpUpdateEvent(this, forceCast(value), this.controller.binding.target.presetKey),
            });
        };
        return MonitorBindingApi;
    }());

    var Constants = {
        monitor: {
            defaultInterval: 200,
            defaultLineCount: 3,
        },
    };

    function fillBuffer(buffer, bufferSize) {
        while (buffer.length < bufferSize) {
            buffer.push(undefined);
        }
    }
    /**
     * @hidden
     */
    function initializeBuffer(bufferSize) {
        var buffer = [];
        fillBuffer(buffer, bufferSize);
        return new Value(buffer);
    }
    function createTrimmedBuffer(buffer) {
        var index = buffer.indexOf(undefined);
        return forceCast(index < 0 ? buffer : buffer.slice(0, index));
    }
    /**
     * @hidden
     */
    function createPushedBuffer(buffer, newValue) {
        var newBuffer = __spreadArrays(createTrimmedBuffer(buffer), [newValue]);
        if (newBuffer.length > buffer.length) {
            newBuffer.splice(0, newBuffer.length - buffer.length);
        }
        else {
            fillBuffer(newBuffer, buffer.length);
        }
        return newBuffer;
    }

    /**
     * @hidden
     */
    var MonitorBinding = /** @class */ (function () {
        function MonitorBinding(config) {
            this.onTick_ = this.onTick_.bind(this);
            this.reader_ = config.reader;
            this.target = config.target;
            this.emitter = new Emitter();
            this.value = config.value;
            this.ticker = config.ticker;
            this.ticker.emitter.on('tick', this.onTick_);
            this.read();
        }
        MonitorBinding.prototype.dispose = function () {
            this.ticker.disposable.dispose();
        };
        MonitorBinding.prototype.read = function () {
            var targetValue = this.target.read();
            if (targetValue === undefined) {
                return;
            }
            var buffer = this.value.rawValue;
            var newValue = this.reader_(targetValue);
            this.value.rawValue = createPushedBuffer(buffer, newValue);
            this.emitter.emit('update', {
                rawValue: newValue,
                sender: this,
            });
        };
        MonitorBinding.prototype.onTick_ = function (_) {
            this.read();
        };
        return MonitorBinding;
    }());

    /**
     * @hidden
     */
    var IntervalTicker = /** @class */ (function () {
        function IntervalTicker(doc, interval) {
            var _this = this;
            this.id_ = null;
            this.onTick_ = this.onTick_.bind(this);
            // this.onWindowBlur_ = this.onWindowBlur_.bind(this);
            // this.onWindowFocus_ = this.onWindowFocus_.bind(this);
            this.doc_ = doc;
            this.emitter = new Emitter();
            if (interval <= 0) {
                this.id_ = null;
            }
            else {
                var win = this.doc_.defaultView;
                if (win) {
                    this.id_ = win.setInterval(this.onTick_, interval);
                }
            }
            // TODO: Stop on blur?
            // const win = document.defaultView;
            // if (win) {
            //   win.addEventListener('blur', this.onWindowBlur_);
            //   win.addEventListener('focus', this.onWindowFocus_);
            // }
            this.disposable = new Disposable();
            this.disposable.emitter.on('dispose', function () {
                if (_this.id_ !== null) {
                    var win = _this.doc_.defaultView;
                    if (win) {
                        win.clearInterval(_this.id_);
                    }
                }
                _this.id_ = null;
            });
        }
        IntervalTicker.prototype.onTick_ = function () {
            // if (!this.active_) {
            // 	return;
            // }
            this.emitter.emit('tick', {
                sender: this,
            });
        };
        return IntervalTicker;
    }());

    /**
     * @hidden
     */
    var ManualTicker = /** @class */ (function () {
        function ManualTicker() {
            this.disposable = new Disposable();
            this.emitter = new Emitter();
        }
        ManualTicker.prototype.tick = function () {
            this.emitter.emit('tick', {
                sender: this,
            });
        };
        return ManualTicker;
    }());

    function createTicker(document, interval) {
        return interval === 0
            ? new ManualTicker()
            : new IntervalTicker(document, interval !== null && interval !== void 0 ? interval : Constants.monitor.defaultInterval);
    }
    function createController$6(plugin, args) {
        var _a, _b;
        var initialValue = plugin.accept(args.target.read(), args.params);
        if (initialValue === null) {
            return null;
        }
        var valueArgs = {
            target: args.target,
            initialValue: initialValue,
            params: args.params,
        };
        var reader = plugin.binding.reader(valueArgs);
        var bufferSize = (_b = (_a = args.params.bufferSize) !== null && _a !== void 0 ? _a : (plugin.binding.defaultBufferSize &&
            plugin.binding.defaultBufferSize(args.params))) !== null && _b !== void 0 ? _b : 1;
        var binding = new MonitorBinding({
            reader: reader,
            target: args.target,
            ticker: createTicker(args.document, args.params.interval),
            value: initializeBuffer(bufferSize),
        });
        return new MonitorBindingController(args.document, {
            binding: binding,
            controller: plugin.controller({
                document: args.document,
                params: args.params,
                value: binding.value,
            }),
            label: args.params.label || args.target.key,
            blade: new Blade(),
        });
    }

    /**
     * @hidden
     */
    function createMonitorBindingController(document, target, params) {
        var bc = Plugins.monitors.reduce(function (result, plugin) {
            return result ||
                createController$6(plugin, {
                    document: document,
                    params: params,
                    target: target,
                });
        }, null);
        if (bc) {
            return bc;
        }
        throw new TpError({
            context: {
                key: target.key,
            },
            type: 'nomatchingcontroller',
        });
    }

    var SeparatorApi = /** @class */ (function () {
        /**
         * @hidden
         */
        function SeparatorApi(controller) {
            this.controller = controller;
        }
        Object.defineProperty(SeparatorApi.prototype, "hidden", {
            get: function () {
                return this.controller.blade.hidden;
            },
            set: function (hidden) {
                this.controller.blade.hidden = hidden;
            },
            enumerable: false,
            configurable: true
        });
        SeparatorApi.prototype.dispose = function () {
            this.controller.blade.dispose();
        };
        return SeparatorApi;
    }());

    /**
     * A binding target.
     */
    var BindingTarget = /** @class */ (function () {
        function BindingTarget(obj, key, opt_id) {
            this.obj_ = obj;
            this.key_ = key;
            this.presetKey_ = opt_id !== null && opt_id !== void 0 ? opt_id : key;
        }
        BindingTarget.isBindable = function (obj) {
            if (obj === null) {
                return false;
            }
            if (typeof obj !== 'object') {
                return false;
            }
            return true;
        };
        Object.defineProperty(BindingTarget.prototype, "key", {
            /**
             * The property name of the binding.
             */
            get: function () {
                return this.key_;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BindingTarget.prototype, "presetKey", {
            /**
             * The key used for presets.
             */
            get: function () {
                return this.presetKey_;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Read a bound value.
         * @return A bound value
         */
        BindingTarget.prototype.read = function () {
            return this.obj_[this.key_];
        };
        /**
         * Write a value.
         * @param value The value to write to the target.
         */
        BindingTarget.prototype.write = function (value) {
            this.obj_[this.key_] = value;
        };
        /**
         * Write a value to the target property.
         * @param name The property name.
         * @param value The value to write to the target.
         */
        BindingTarget.prototype.writeProperty = function (name, value) {
            var valueObj = this.read();
            if (!BindingTarget.isBindable(valueObj)) {
                throw TpError.notBindable();
            }
            if (!(name in valueObj)) {
                throw TpError.propertyNotFound(name);
            }
            valueObj[name] = value;
        };
        return BindingTarget;
    }());

    function createBindingTarget(obj, key, opt_id) {
        if (!BindingTarget.isBindable(obj)) {
            throw TpError.notBindable();
        }
        return new BindingTarget(obj, key, opt_id);
    }

    var FolderApi = /** @class */ (function () {
        /**
         * @hidden
         */
        function FolderApi(controller) {
            this.onFolderChange_ = this.onFolderChange_.bind(this);
            this.onRackInputChange_ = this.onRackInputChange_.bind(this);
            this.onRackItemFold_ = this.onRackItemFold_.bind(this);
            this.onRackMonitorUpdate_ = this.onRackMonitorUpdate_.bind(this);
            this.controller = controller;
            this.emitter_ = new Emitter();
            this.controller.folder.emitter.on('change', this.onFolderChange_);
            var rack = this.controller.bladeRack;
            rack.emitter.on('inputchange', this.onRackInputChange_);
            rack.emitter.on('monitorupdate', this.onRackMonitorUpdate_);
            rack.emitter.on('itemfold', this.onRackItemFold_);
        }
        Object.defineProperty(FolderApi.prototype, "expanded", {
            get: function () {
                return this.controller.folder.expanded;
            },
            set: function (expanded) {
                this.controller.folder.expanded = expanded;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FolderApi.prototype, "hidden", {
            get: function () {
                return this.controller.blade.hidden;
            },
            set: function (hidden) {
                this.controller.blade.hidden = hidden;
            },
            enumerable: false,
            configurable: true
        });
        FolderApi.prototype.dispose = function () {
            this.controller.blade.dispose();
        };
        FolderApi.prototype.addInput = function (object, key, opt_params) {
            var params = opt_params || {};
            var bc = createInputBindingController(this.controller.document, createBindingTarget(object, key, params.presetKey), params);
            this.controller.bladeRack.add(bc, params.index);
            return new InputBindingApi(forceCast(bc));
        };
        FolderApi.prototype.addMonitor = function (object, key, opt_params) {
            var params = opt_params || {};
            var bc = createMonitorBindingController(this.controller.document, createBindingTarget(object, key), params);
            this.controller.bladeRack.add(bc, params.index);
            return new MonitorBindingApi(forceCast(bc));
        };
        FolderApi.prototype.addFolder = function (params) {
            var bc = new FolderController(this.controller.document, __assign(__assign({}, params), { blade: new Blade() }));
            this.controller.bladeRack.add(bc, params.index);
            return new FolderApi(bc);
        };
        FolderApi.prototype.addButton = function (params) {
            var doc = this.controller.document;
            var bc = new LabeledController(doc, {
                blade: new Blade(),
                label: params.label,
                valueController: new ButtonController(doc, params),
            });
            this.controller.bladeRack.add(bc, params.index);
            return new ButtonApi(bc);
        };
        FolderApi.prototype.addSeparator = function (opt_params) {
            var params = opt_params || {};
            var bc = new SeparatorController(this.controller.document, {
                blade: new Blade(),
            });
            this.controller.bladeRack.add(bc, params.index);
            return new SeparatorApi(bc);
        };
        /**
         * Adds a global event listener. It handles all events of child inputs/monitors.
         * @param eventName The event name to listen.
         * @return The API object itself.
         */
        FolderApi.prototype.on = function (eventName, handler) {
            var bh = handler.bind(this);
            this.emitter_.on(eventName, function (ev) {
                bh(ev.event);
            });
            return this;
        };
        FolderApi.prototype.onRackInputChange_ = function (ev) {
            var bapi = new InputBindingApi(ev.bindingController);
            var binding = ev.bindingController.binding;
            this.emitter_.emit('change', {
                event: new TpChangeEvent(bapi, forceCast(binding.target.read()), binding.target.presetKey),
            });
        };
        FolderApi.prototype.onRackMonitorUpdate_ = function (ev) {
            var bapi = new MonitorBindingApi(ev.bindingController);
            var binding = ev.bindingController.binding;
            this.emitter_.emit('update', {
                event: new TpUpdateEvent(bapi, forceCast(binding.target.read()), binding.target.presetKey),
            });
        };
        FolderApi.prototype.onRackItemFold_ = function (ev) {
            var fapi = new FolderApi(ev.folderController);
            this.emitter_.emit('fold', {
                event: new TpFoldEvent(fapi, ev.folderController.folder.expanded),
            });
        };
        FolderApi.prototype.onFolderChange_ = function (ev) {
            if (ev.propertyName !== 'expanded') {
                return;
            }
            this.emitter_.emit('fold', {
                event: new TpFoldEvent(this, ev.sender.expanded),
            });
        };
        return FolderApi;
    }());

    /**
     * @hidden
     */
    function exportPresetJson(targets) {
        return targets.reduce(function (result, target) {
            var _a;
            return Object.assign(result, (_a = {},
                _a[target.presetKey] = target.read(),
                _a));
        }, {});
    }
    /**
     * @hidden
     */
    function importPresetJson(targets, preset) {
        targets.forEach(function (target) {
            var value = preset[target.presetKey];
            if (value !== undefined) {
                target.write(value);
            }
        });
    }

    /**
     * The Tweakpane interface.
     *
     * ```
     * new Tweakpane(options: TweakpaneConfig): RootApi
     * ```
     *
     * See [[`TweakpaneConfig`]] interface for available options.
     */
    var RootApi = /** @class */ (function (_super) {
        __extends(RootApi, _super);
        /**
         * @hidden
         */
        function RootApi(controller) {
            return _super.call(this, controller) || this;
        }
        /**
         * Registers a plugin.
         * @template In The type of the internal value.
         * @template Ex The type of the external value.
         * @param r The configuration of the plugin.
         */
        RootApi.registerPlugin = function (r) {
            if (r.type === 'input') {
                Plugins.inputs.unshift(r.plugin);
            }
            else if (r.type === 'monitor') {
                Plugins.monitors.unshift(r.plugin);
            }
        };
        Object.defineProperty(RootApi.prototype, "element", {
            get: function () {
                return this.controller.view.element;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Imports a preset of all inputs.
         * @param preset The preset object to import.
         */
        RootApi.prototype.importPreset = function (preset) {
            var targets = this.controller.bladeRack
                .find(InputBindingController)
                .map(function (ibc) {
                return ibc.binding.target;
            });
            importPresetJson(targets, preset);
            this.refresh();
        };
        /**
         * Exports a preset of all inputs.
         * @return An exported preset object.
         */
        RootApi.prototype.exportPreset = function () {
            var targets = this.controller.bladeRack
                .find(InputBindingController)
                .map(function (ibc) {
                return ibc.binding.target;
            });
            return exportPresetJson(targets);
        };
        /**
         * Refreshes all bindings of the pane.
         */
        RootApi.prototype.refresh = function () {
            // Force-read all input bindings
            this.controller.bladeRack.find(InputBindingController).forEach(function (ibc) {
                ibc.binding.read();
            });
            // Force-read all monitor bindings
            this.controller.bladeRack.find(MonitorBindingController).forEach(function (mbc) {
                mbc.binding.read();
            });
        };
        return RootApi;
    }(FolderApi));

    /***
     * A simple semantic versioning perser.
     */
    var Semver = /** @class */ (function () {
        function Semver(text) {
            var comps = text.split('.');
            this.major = parseInt(comps[0], 10);
            this.minor = parseInt(comps[1], 10);
            this.patch = parseInt(comps[2], 10);
        }
        Semver.prototype.toString = function () {
            return [this.major, this.minor, this.patch].join('.');
        };
        return Semver;
    }());

    var RootController = /** @class */ (function (_super) {
        __extends(RootController, _super);
        function RootController(doc, config) {
            return _super.call(this, doc, {
                expanded: config.expanded,
                title: config.title || '',
                blade: config.blade,
                hidesTitle: config.title === undefined,
                viewName: 'rot',
            }) || this;
        }
        return RootController;
    }(FolderController));

    /**
     * A constraint to combine multiple constraints.
     * @template T The type of the value.
     */
    var CompositeConstraint = /** @class */ (function () {
        function CompositeConstraint(constraints) {
            this.constraints = constraints;
        }
        CompositeConstraint.prototype.constrain = function (value) {
            return this.constraints.reduce(function (result, c) {
                return c.constrain(result);
            }, value);
        };
        return CompositeConstraint;
    }());
    function findConstraint(c, constraintClass) {
        if (c instanceof constraintClass) {
            return c;
        }
        if (c instanceof CompositeConstraint) {
            var result = c.constraints.reduce(function (tmpResult, sc) {
                if (tmpResult) {
                    return tmpResult;
                }
                return sc instanceof constraintClass ? sc : null;
            }, null);
            if (result) {
                return result;
            }
        }
        return null;
    }

    /**
     * A list constranit.
     * @template T The type of the value.
     */
    var ListConstraint = /** @class */ (function () {
        function ListConstraint(options) {
            this.options = options;
        }
        ListConstraint.prototype.constrain = function (value) {
            var opts = this.options;
            if (opts.length === 0) {
                return value;
            }
            var matched = opts.filter(function (item) {
                return item.value === value;
            }).length > 0;
            return matched ? value : opts[0].value;
        };
        return ListConstraint;
    }());

    /**
     * @hidden
     */
    function boolToString(value) {
        return String(value);
    }
    /**
     * @hidden
     */
    function boolFromUnknown(value) {
        if (value === 'false') {
            return false;
        }
        return !!value;
    }
    /**
     * @hidden
     */
    function BooleanFormatter(value) {
        return boolToString(value);
    }

    /**
     * Compares two primitive values.
     * @param v1 The value.
     * @param v2 The another value.
     * @return true if equal, false otherwise.
     */
    function equalsPrimitive(v1, v2) {
        return v1 === v2;
    }
    /**
     * Writes the primitive value.
     * @param target The target to be written.
     * @param value The value to write.
     */
    function writePrimitive(target, value) {
        target.write(value);
    }

    /**
     * A number step range constraint.
     */
    var StepConstraint = /** @class */ (function () {
        function StepConstraint(step) {
            this.step = step;
        }
        StepConstraint.prototype.constrain = function (value) {
            var r = value < 0
                ? -Math.round(-value / this.step)
                : Math.round(value / this.step);
            return r * this.step;
        };
        return StepConstraint;
    }());

    function mapRange(value, start1, end1, start2, end2) {
        var p = (value - start1) / (end1 - start1);
        return start2 + p * (end2 - start2);
    }
    function getDecimalDigits(value) {
        var text = String(value.toFixed(10));
        var frac = text.split('.')[1];
        return frac.replace(/0+$/, '').length;
    }
    function constrainRange(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    function loopRange(value, max) {
        return ((value % max) + max) % max;
    }

    function normalizeInputParamsOptions(options, convert) {
        if (Array.isArray(options)) {
            return options.map(function (item) {
                return {
                    text: item.text,
                    value: convert(item.value),
                };
            });
        }
        var textToValueMap = options;
        var texts = Object.keys(textToValueMap);
        return texts.reduce(function (result, text) {
            return result.concat({
                text: text,
                value: convert(textToValueMap[text]),
            });
        }, []);
    }
    /**
     * Tries to create a list constraint.
     * @template T The type of the raw value.
     * @param params The input parameters object.
     * @param convert The converter that converts unknown value into T.
     * @return A constraint or null if not found.
     */
    function createListConstraint(params, convert) {
        if ('options' in params && params.options !== undefined) {
            return new ListConstraint(normalizeInputParamsOptions(params.options, convert));
        }
        return null;
    }
    /**
     * @hidden
     */
    function findListItems(constraint) {
        var c = constraint
            ? findConstraint(constraint, ListConstraint)
            : null;
        if (!c) {
            return null;
        }
        return c.options;
    }
    function findStep(constraint) {
        var c = constraint ? findConstraint(constraint, StepConstraint) : null;
        if (!c) {
            return null;
        }
        return c.step;
    }
    /**
     * @hidden
     */
    function getSuitableDecimalDigits(constraint, rawValue) {
        var sc = constraint && findConstraint(constraint, StepConstraint);
        if (sc) {
            return getDecimalDigits(sc.step);
        }
        return Math.max(getDecimalDigits(rawValue), 2);
    }
    /**
     * @hidden
     */
    function getBaseStep(constraint) {
        var step = findStep(constraint);
        return step !== null && step !== void 0 ? step : 1;
    }
    /**
     * @hidden
     */
    function getSuitableDraggingScale(constraint, rawValue) {
        var _a;
        var sc = constraint && findConstraint(constraint, StepConstraint);
        var base = Math.abs((_a = sc === null || sc === void 0 ? void 0 : sc.step) !== null && _a !== void 0 ? _a : rawValue);
        return base === 0 ? 0.1 : Math.pow(10, Math.floor(Math.log10(base)) - 1);
    }

    var className$i = ClassName('lst');
    /**
     * @hidden
     */
    var ListView = /** @class */ (function () {
        function ListView(doc, config) {
            var _this = this;
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.element = doc.createElement('div');
            this.element.classList.add(className$i());
            this.stringifyValue_ = config.stringifyValue;
            var selectElem = doc.createElement('select');
            selectElem.classList.add(className$i('s'));
            config.options.forEach(function (item, index) {
                var optionElem = doc.createElement('option');
                optionElem.dataset.index = String(index);
                optionElem.textContent = item.text;
                optionElem.value = _this.stringifyValue_(item.value);
                selectElem.appendChild(optionElem);
            });
            this.element.appendChild(selectElem);
            this.selectElement = selectElem;
            var markElem = doc.createElement('div');
            markElem.classList.add(className$i('m'));
            markElem.appendChild(createSvgIconElement(doc, 'dropdown'));
            this.element.appendChild(markElem);
            config.value.emitter.on('change', this.onValueChange_);
            this.value = config.value;
            this.update();
        }
        ListView.prototype.update = function () {
            this.selectElement.value = this.stringifyValue_(this.value.rawValue);
        };
        ListView.prototype.onValueChange_ = function () {
            this.update();
        };
        return ListView;
    }());

    /**
     * @hidden
     */
    var ListController = /** @class */ (function () {
        function ListController(doc, config) {
            this.onSelectChange_ = this.onSelectChange_.bind(this);
            this.value = config.value;
            this.listItems_ = config.listItems;
            this.view = new ListView(doc, {
                options: this.listItems_,
                stringifyValue: config.stringifyValue,
                value: this.value,
            });
            this.view.selectElement.addEventListener('change', this.onSelectChange_);
        }
        ListController.prototype.onSelectChange_ = function (e) {
            var selectElem = forceCast(e.currentTarget);
            var optElem = selectElem.selectedOptions.item(0);
            if (!optElem) {
                return;
            }
            var itemIndex = Number(optElem.dataset.index);
            this.value.rawValue = this.listItems_[itemIndex].value;
            this.view.update();
        };
        return ListController;
    }());

    var className$h = ClassName('ckb');
    /**
     * @hidden
     */
    var CheckboxView = /** @class */ (function () {
        function CheckboxView(doc, config) {
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.element = doc.createElement('div');
            this.element.classList.add(className$h());
            var labelElem = doc.createElement('label');
            labelElem.classList.add(className$h('l'));
            this.element.appendChild(labelElem);
            var inputElem = doc.createElement('input');
            inputElem.classList.add(className$h('i'));
            inputElem.type = 'checkbox';
            labelElem.appendChild(inputElem);
            this.inputElement = inputElem;
            var wrapperElem = doc.createElement('div');
            wrapperElem.classList.add(className$h('w'));
            labelElem.appendChild(wrapperElem);
            var markElem = createSvgIconElement(doc, 'check');
            wrapperElem.appendChild(markElem);
            config.value.emitter.on('change', this.onValueChange_);
            this.value = config.value;
            this.update();
        }
        CheckboxView.prototype.update = function () {
            this.inputElement.checked = this.value.rawValue;
        };
        CheckboxView.prototype.onValueChange_ = function () {
            this.update();
        };
        return CheckboxView;
    }());

    /**
     * @hidden
     */
    var CheckboxController = /** @class */ (function () {
        function CheckboxController(doc, config) {
            this.onInputChange_ = this.onInputChange_.bind(this);
            this.value = config.value;
            this.view = new CheckboxView(doc, {
                value: this.value,
            });
            this.view.inputElement.addEventListener('change', this.onInputChange_);
        }
        CheckboxController.prototype.onInputChange_ = function (e) {
            var inputElem = forceCast(e.currentTarget);
            this.value.rawValue = inputElem.checked;
            this.view.update();
        };
        return CheckboxController;
    }());

    function createConstraint$5(params) {
        var constraints = [];
        var lc = createListConstraint(params, boolFromUnknown);
        if (lc) {
            constraints.push(lc);
        }
        return new CompositeConstraint(constraints);
    }
    function createController$5(doc, value) {
        var _a;
        var c = value.constraint;
        if (c && findConstraint(c, ListConstraint)) {
            return new ListController(doc, {
                listItems: (_a = findListItems(c)) !== null && _a !== void 0 ? _a : [],
                stringifyValue: boolToString,
                value: value,
            });
        }
        return new CheckboxController(doc, {
            value: value,
        });
    }
    /**
     * @hidden
     */
    var BooleanInputPlugin = {
        id: 'input-bool',
        accept: function (value) { return (typeof value === 'boolean' ? value : null); },
        binding: {
            reader: function (_args) { return boolFromUnknown; },
            constraint: function (args) { return createConstraint$5(args.params); },
            equals: equalsPrimitive,
            writer: function (_args) { return writePrimitive; },
        },
        controller: function (args) {
            return createController$5(args.document, args.value);
        },
    };

    var className$g = ClassName('txt');
    /**
     * @hidden
     */
    var TextView = /** @class */ (function () {
        function TextView(doc, config) {
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.formatter = config.formatter;
            this.element = doc.createElement('div');
            this.element.classList.add(className$g());
            if (config.arrayPosition) {
                this.element.classList.add(className$g(undefined, config.arrayPosition));
            }
            var inputElem = doc.createElement('input');
            inputElem.classList.add(className$g('i'));
            inputElem.type = 'text';
            this.element.appendChild(inputElem);
            this.inputElement = inputElem;
            config.value.emitter.on('change', this.onValueChange_);
            this.value = config.value;
            this.update();
        }
        TextView.prototype.update = function () {
            this.inputElement.value = this.formatter(this.value.rawValue);
        };
        TextView.prototype.onValueChange_ = function () {
            this.update();
        };
        return TextView;
    }());

    /**
     * @hidden
     */
    var TextController = /** @class */ (function () {
        function TextController(doc, config) {
            this.onInputChange_ = this.onInputChange_.bind(this);
            this.parser_ = config.parser;
            this.value = config.value;
            this.view = new TextView(doc, {
                formatter: config.formatter,
                value: this.value,
            });
            this.view.inputElement.addEventListener('change', this.onInputChange_);
        }
        TextController.prototype.onInputChange_ = function (e) {
            var inputElem = forceCast(e.currentTarget);
            var value = inputElem.value;
            var parsedValue = this.parser_(value);
            if (!isEmpty(parsedValue)) {
                this.value.rawValue = parsedValue;
            }
            this.view.update();
        };
        return TextController;
    }());

    var className$f = ClassName('clswtxt');
    /**
     * @hidden
     */
    var ColorSwatchTextView = /** @class */ (function () {
        function ColorSwatchTextView(doc, config) {
            this.element = doc.createElement('div');
            this.element.classList.add(className$f());
            var swatchElem = doc.createElement('div');
            swatchElem.classList.add(className$f('s'));
            this.swatchView_ = config.swatchView;
            swatchElem.appendChild(this.swatchView_.element);
            this.element.appendChild(swatchElem);
            var textElem = doc.createElement('div');
            textElem.classList.add(className$f('t'));
            this.textView = config.textView;
            textElem.appendChild(this.textView.element);
            this.element.appendChild(textElem);
        }
        Object.defineProperty(ColorSwatchTextView.prototype, "value", {
            get: function () {
                return this.textView.value;
            },
            enumerable: false,
            configurable: true
        });
        ColorSwatchTextView.prototype.update = function () {
            this.swatchView_.update();
            this.textView.update();
        };
        return ColorSwatchTextView;
    }());

    var PickedColor = /** @class */ (function () {
        function PickedColor(value) {
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.mode_ = value.rawValue.mode;
            this.value = value;
            this.value.emitter.on('change', this.onValueChange_);
            this.emitter = new Emitter();
        }
        Object.defineProperty(PickedColor.prototype, "mode", {
            get: function () {
                return this.mode_;
            },
            set: function (mode) {
                if (this.mode_ === mode) {
                    return;
                }
                this.mode_ = mode;
                this.emitter.emit('change', {
                    propertyName: 'mode',
                    sender: this,
                });
            },
            enumerable: false,
            configurable: true
        });
        PickedColor.prototype.onValueChange_ = function () {
            this.emitter.emit('change', {
                propertyName: 'value',
                sender: this,
            });
        };
        return PickedColor;
    }());

    var NumberLiteralNode = /** @class */ (function () {
        function NumberLiteralNode(text) {
            this.text = text;
        }
        NumberLiteralNode.prototype.evaluate = function () {
            return Number(this.text);
        };
        NumberLiteralNode.prototype.toString = function () {
            return this.text;
        };
        return NumberLiteralNode;
    }());
    var BINARY_OPERATION_MAP = {
        '**': function (v1, v2) { return Math.pow(v1, v2); },
        '*': function (v1, v2) { return v1 * v2; },
        '/': function (v1, v2) { return v1 / v2; },
        '%': function (v1, v2) { return v1 % v2; },
        '+': function (v1, v2) { return v1 + v2; },
        '-': function (v1, v2) { return v1 - v2; },
        '<<': function (v1, v2) { return v1 << v2; },
        '>>': function (v1, v2) { return v1 >> v2; },
        '>>>': function (v1, v2) { return v1 >>> v2; },
        '&': function (v1, v2) { return v1 & v2; },
        '^': function (v1, v2) { return v1 ^ v2; },
        '|': function (v1, v2) { return v1 | v2; },
    };
    var BinaryOperationNode = /** @class */ (function () {
        function BinaryOperationNode(operator, left, right) {
            this.left = left;
            this.operator = operator;
            this.right = right;
        }
        BinaryOperationNode.prototype.evaluate = function () {
            var op = BINARY_OPERATION_MAP[this.operator];
            if (!op) {
                throw new Error("unexpected binary operator: '" + this.operator);
            }
            return op(this.left.evaluate(), this.right.evaluate());
        };
        BinaryOperationNode.prototype.toString = function () {
            return [
                'b(',
                this.left.toString(),
                this.operator,
                this.right.toString(),
                ')',
            ].join(' ');
        };
        return BinaryOperationNode;
    }());
    var UNARY_OPERATION_MAP = {
        '+': function (v) { return v; },
        '-': function (v) { return -v; },
        '~': function (v) { return ~v; },
    };
    var UnaryOperationNode = /** @class */ (function () {
        function UnaryOperationNode(operator, expr) {
            this.operator = operator;
            this.expression = expr;
        }
        UnaryOperationNode.prototype.evaluate = function () {
            var op = UNARY_OPERATION_MAP[this.operator];
            if (!op) {
                throw new Error("unexpected unary operator: '" + this.operator);
            }
            return op(this.expression.evaluate());
        };
        UnaryOperationNode.prototype.toString = function () {
            return ['u(', this.operator, this.expression.toString(), ')'].join(' ');
        };
        return UnaryOperationNode;
    }());

    function combineReader(parsers) {
        return function (text, cursor) {
            for (var i = 0; i < parsers.length; i++) {
                var result = parsers[i](text, cursor);
                if (result !== '') {
                    return result;
                }
            }
            return '';
        };
    }
    function readWhitespace(text, cursor) {
        var _a;
        var m = text.substr(cursor).match(/^\s+/);
        return (_a = (m && m[0])) !== null && _a !== void 0 ? _a : '';
    }
    function readNonZeroDigit(text, cursor) {
        var ch = text.substr(cursor, 1);
        return ch.match(/^[1-9]$/) ? ch : '';
    }
    function readDecimalDigits(text, cursor) {
        var _a;
        var m = text.substr(cursor).match(/^[0-9]+/);
        return (_a = (m && m[0])) !== null && _a !== void 0 ? _a : '';
    }
    function readSignedInteger(text, cursor) {
        var ds = readDecimalDigits(text, cursor);
        if (ds !== '') {
            return ds;
        }
        var sign = text.substr(cursor, 1);
        cursor += 1;
        if (sign !== '-' && sign !== '+') {
            return '';
        }
        var sds = readDecimalDigits(text, cursor);
        if (sds === '') {
            return '';
        }
        return sign + sds;
    }
    function readExponentPart(text, cursor) {
        var e = text.substr(cursor, 1);
        cursor += 1;
        if (e.toLowerCase() !== 'e') {
            return '';
        }
        var si = readSignedInteger(text, cursor);
        if (si === '') {
            return '';
        }
        return e + si;
    }
    function readDecimalIntegerLiteral(text, cursor) {
        var ch = text.substr(cursor, 1);
        if (ch === '0') {
            return ch;
        }
        var nzd = readNonZeroDigit(text, cursor);
        cursor += nzd.length;
        if (nzd === '') {
            return '';
        }
        return nzd + readDecimalDigits(text, cursor);
    }
    function readDecimalLiteral1(text, cursor) {
        var dil = readDecimalIntegerLiteral(text, cursor);
        cursor += dil.length;
        if (dil === '') {
            return '';
        }
        var dot = text.substr(cursor, 1);
        cursor += dot.length;
        if (dot !== '.') {
            return '';
        }
        var dds = readDecimalDigits(text, cursor);
        cursor += dds.length;
        return dil + dot + dds + readExponentPart(text, cursor);
    }
    function readDecimalLiteral2(text, cursor) {
        var dot = text.substr(cursor, 1);
        cursor += dot.length;
        if (dot !== '.') {
            return '';
        }
        var dds = readDecimalDigits(text, cursor);
        cursor += dds.length;
        if (dds === '') {
            return '';
        }
        return dot + dds + readExponentPart(text, cursor);
    }
    function readDecimalLiteral3(text, cursor) {
        var dil = readDecimalIntegerLiteral(text, cursor);
        cursor += dil.length;
        if (dil === '') {
            return '';
        }
        return dil + readExponentPart(text, cursor);
    }
    var readDecimalLiteral = combineReader([
        readDecimalLiteral1,
        readDecimalLiteral2,
        readDecimalLiteral3,
    ]);
    function parseBinaryDigits(text, cursor) {
        var _a;
        var m = text.substr(cursor).match(/^[01]+/);
        return (_a = (m && m[0])) !== null && _a !== void 0 ? _a : '';
    }
    function readBinaryIntegerLiteral(text, cursor) {
        var prefix = text.substr(cursor, 2);
        cursor += prefix.length;
        if (prefix.toLowerCase() !== '0b') {
            return '';
        }
        var bds = parseBinaryDigits(text, cursor);
        if (bds === '') {
            return '';
        }
        return prefix + bds;
    }
    function readOctalDigits(text, cursor) {
        var _a;
        var m = text.substr(cursor).match(/^[0-7]+/);
        return (_a = (m && m[0])) !== null && _a !== void 0 ? _a : '';
    }
    function readOctalIntegerLiteral(text, cursor) {
        var prefix = text.substr(cursor, 2);
        cursor += prefix.length;
        if (prefix.toLowerCase() !== '0o') {
            return '';
        }
        var ods = readOctalDigits(text, cursor);
        if (ods === '') {
            return '';
        }
        return prefix + ods;
    }
    function readHexDigits(text, cursor) {
        var _a;
        var m = text.substr(cursor).match(/^[0-9a-f]+/i);
        return (_a = (m && m[0])) !== null && _a !== void 0 ? _a : '';
    }
    function readHexIntegerLiteral(text, cursor) {
        var prefix = text.substr(cursor, 2);
        cursor += prefix.length;
        if (prefix.toLowerCase() !== '0x') {
            return '';
        }
        var hds = readHexDigits(text, cursor);
        if (hds === '') {
            return '';
        }
        return prefix + hds;
    }
    var readNonDecimalIntegerLiteral = combineReader([
        readBinaryIntegerLiteral,
        readOctalIntegerLiteral,
        readHexIntegerLiteral,
    ]);
    var readNumericLiteral = combineReader([
        readNonDecimalIntegerLiteral,
        readDecimalLiteral,
    ]);

    function parseLiteral(text, cursor) {
        var num = readNumericLiteral(text, cursor);
        cursor += num.length;
        if (num === '') {
            return null;
        }
        return {
            evaluable: new NumberLiteralNode(num),
            cursor: cursor,
        };
    }
    function parseParenthesizedExpression(text, cursor) {
        var op = text.substr(cursor, 1);
        cursor += op.length;
        if (op !== '(') {
            return null;
        }
        var expr = parseExpression(text, cursor);
        if (!expr) {
            return null;
        }
        cursor = expr.cursor;
        cursor += readWhitespace(text, cursor).length;
        var cl = text.substr(cursor, 1);
        cursor += cl.length;
        if (cl !== ')') {
            return null;
        }
        return {
            evaluable: expr.evaluable,
            cursor: cursor,
        };
    }
    function parsePrimaryExpression(text, cursor) {
        return (parseLiteral(text, cursor) || parseParenthesizedExpression(text, cursor));
    }
    function parseUnaryExpression(text, cursor) {
        var expr = parsePrimaryExpression(text, cursor);
        if (expr) {
            return expr;
        }
        var op = text.substr(cursor, 1);
        cursor += op.length;
        if (op !== '+' && op !== '-' && op !== '~') {
            return null;
        }
        var num = parseUnaryExpression(text, cursor);
        if (!num) {
            return null;
        }
        cursor = num.cursor;
        return {
            cursor: cursor,
            evaluable: new UnaryOperationNode(op, num.evaluable),
        };
    }
    function readBinaryOperator(ops, text, cursor) {
        cursor += readWhitespace(text, cursor).length;
        var op = ops.filter(function (op) { return text.startsWith(op, cursor); })[0];
        if (!op) {
            return null;
        }
        cursor += op.length;
        cursor += readWhitespace(text, cursor).length;
        return {
            cursor: cursor,
            operator: op,
        };
    }
    function createBinaryOperationExpressionParser(exprParser, ops) {
        return function (text, cursor) {
            var firstExpr = exprParser(text, cursor);
            if (!firstExpr) {
                return null;
            }
            cursor = firstExpr.cursor;
            var expr = firstExpr.evaluable;
            for (;;) {
                var op = readBinaryOperator(ops, text, cursor);
                if (!op) {
                    break;
                }
                cursor = op.cursor;
                var nextExpr = exprParser(text, cursor);
                if (!nextExpr) {
                    return null;
                }
                cursor = nextExpr.cursor;
                expr = new BinaryOperationNode(op.operator, expr, nextExpr.evaluable);
            }
            return expr
                ? {
                    cursor: cursor,
                    evaluable: expr,
                }
                : null;
        };
    }
    var parseBinaryOperationExpression = [
        ['**'],
        ['*', '/', '%'],
        ['+', '-'],
        ['<<', '>>>', '>>'],
        ['&'],
        ['^'],
        ['|'],
    ].reduce(function (parser, ops) {
        return createBinaryOperationExpressionParser(parser, ops);
    }, parseUnaryExpression);
    function parseExpression(text, cursor) {
        cursor += readWhitespace(text, cursor).length;
        return parseBinaryOperationExpression(text, cursor);
    }
    /**
     * Parse ECMAScript expression with numeric literals.
     * https://262.ecma-international.org/
     * @param text The string to be parsed.
     * @return A parsing result, or null if failed.
     */
    function parseEcmaNumberExpression(text) {
        var expr = parseExpression(text, 0);
        if (!expr) {
            return null;
        }
        var cursor = expr.cursor + readWhitespace(text, expr.cursor).length;
        if (cursor !== text.length) {
            return null;
        }
        return expr.evaluable;
    }

    /**
     * @hidden
     */
    function parseNumber(text) {
        var _a;
        var r = parseEcmaNumberExpression(text);
        return (_a = r === null || r === void 0 ? void 0 : r.evaluate()) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * @hidden
     */
    function numberFromUnknown(value) {
        if (typeof value === 'number') {
            return value;
        }
        if (typeof value === 'string') {
            var pv = parseNumber(value);
            if (!isEmpty(pv)) {
                return pv;
            }
        }
        return 0;
    }
    /**
     * @hidden
     */
    function numberToString(value) {
        return String(value);
    }
    /**
     * @hidden
     */
    function createNumberFormatter(digits) {
        return function (value) {
            return value.toFixed(Math.max(Math.min(digits, 20), 0));
        };
    }

    var innerFormatter = createNumberFormatter(0);
    /**
     * @hidden
     */
    function formatPercentage(value) {
        return innerFormatter(value) + '%';
    }

    function rgbToHsl(r, g, b) {
        var rp = constrainRange(r / 255, 0, 1);
        var gp = constrainRange(g / 255, 0, 1);
        var bp = constrainRange(b / 255, 0, 1);
        var cmax = Math.max(rp, gp, bp);
        var cmin = Math.min(rp, gp, bp);
        var c = cmax - cmin;
        var h = 0;
        var s = 0;
        var l = (cmin + cmax) / 2;
        if (c !== 0) {
            s = l > 0.5 ? c / (2 - cmin - cmax) : c / (cmax + cmin);
            if (rp === cmax) {
                h = (gp - bp) / c;
            }
            else if (gp === cmax) {
                h = 2 + (bp - rp) / c;
            }
            else {
                h = 4 + (rp - gp) / c;
            }
            h = h / 6 + (h < 0 ? 1 : 0);
        }
        return [h * 360, s * 100, l * 100];
    }
    function hslToRgb(h, s, l) {
        var _a, _b, _c, _d, _e, _f;
        var hp = ((h % 360) + 360) % 360;
        var sp = constrainRange(s / 100, 0, 1);
        var lp = constrainRange(l / 100, 0, 1);
        var c = (1 - Math.abs(2 * lp - 1)) * sp;
        var x = c * (1 - Math.abs(((hp / 60) % 2) - 1));
        var m = lp - c / 2;
        var rp, gp, bp;
        if (hp >= 0 && hp < 60) {
            _a = [c, x, 0], rp = _a[0], gp = _a[1], bp = _a[2];
        }
        else if (hp >= 60 && hp < 120) {
            _b = [x, c, 0], rp = _b[0], gp = _b[1], bp = _b[2];
        }
        else if (hp >= 120 && hp < 180) {
            _c = [0, c, x], rp = _c[0], gp = _c[1], bp = _c[2];
        }
        else if (hp >= 180 && hp < 240) {
            _d = [0, x, c], rp = _d[0], gp = _d[1], bp = _d[2];
        }
        else if (hp >= 240 && hp < 300) {
            _e = [x, 0, c], rp = _e[0], gp = _e[1], bp = _e[2];
        }
        else {
            _f = [c, 0, x], rp = _f[0], gp = _f[1], bp = _f[2];
        }
        return [(rp + m) * 255, (gp + m) * 255, (bp + m) * 255];
    }
    function rgbToHsv(r, g, b) {
        var rp = constrainRange(r / 255, 0, 1);
        var gp = constrainRange(g / 255, 0, 1);
        var bp = constrainRange(b / 255, 0, 1);
        var cmax = Math.max(rp, gp, bp);
        var cmin = Math.min(rp, gp, bp);
        var d = cmax - cmin;
        var h;
        if (d === 0) {
            h = 0;
        }
        else if (cmax === rp) {
            h = 60 * (((((gp - bp) / d) % 6) + 6) % 6);
        }
        else if (cmax === gp) {
            h = 60 * ((bp - rp) / d + 2);
        }
        else {
            h = 60 * ((rp - gp) / d + 4);
        }
        var s = cmax === 0 ? 0 : d / cmax;
        var v = cmax;
        return [h, s * 100, v * 100];
    }
    /**
     * @hidden
     */
    function hsvToRgb(h, s, v) {
        var _a, _b, _c, _d, _e, _f;
        var hp = loopRange(h, 360);
        var sp = constrainRange(s / 100, 0, 1);
        var vp = constrainRange(v / 100, 0, 1);
        var c = vp * sp;
        var x = c * (1 - Math.abs(((hp / 60) % 2) - 1));
        var m = vp - c;
        var rp, gp, bp;
        if (hp >= 0 && hp < 60) {
            _a = [c, x, 0], rp = _a[0], gp = _a[1], bp = _a[2];
        }
        else if (hp >= 60 && hp < 120) {
            _b = [x, c, 0], rp = _b[0], gp = _b[1], bp = _b[2];
        }
        else if (hp >= 120 && hp < 180) {
            _c = [0, c, x], rp = _c[0], gp = _c[1], bp = _c[2];
        }
        else if (hp >= 180 && hp < 240) {
            _d = [0, x, c], rp = _d[0], gp = _d[1], bp = _d[2];
        }
        else if (hp >= 240 && hp < 300) {
            _e = [x, 0, c], rp = _e[0], gp = _e[1], bp = _e[2];
        }
        else {
            _f = [c, 0, x], rp = _f[0], gp = _f[1], bp = _f[2];
        }
        return [(rp + m) * 255, (gp + m) * 255, (bp + m) * 255];
    }
    /**
     * @hidden
     */
    function removeAlphaComponent(comps) {
        return [comps[0], comps[1], comps[2]];
    }
    /**
     * @hidden
     */
    function appendAlphaComponent(comps, alpha) {
        return [comps[0], comps[1], comps[2], alpha];
    }
    var MODE_CONVERTER_MAP = {
        hsl: {
            hsl: function (h, s, l) { return [h, s, l]; },
            hsv: function (h, s, l) {
                var _a = hslToRgb(h, s, l), r = _a[0], g = _a[1], b = _a[2];
                return rgbToHsv(r, g, b);
            },
            rgb: hslToRgb,
        },
        hsv: {
            hsl: function (h, s, v) {
                var _a = hsvToRgb(h, s, v), r = _a[0], g = _a[1], b = _a[2];
                return rgbToHsl(r, g, b);
            },
            hsv: function (h, s, v) { return [h, s, v]; },
            rgb: hsvToRgb,
        },
        rgb: {
            hsl: rgbToHsl,
            hsv: rgbToHsv,
            rgb: function (r, g, b) { return [r, g, b]; },
        },
    };
    /**
     * @hidden
     */
    function convertColorMode(components, fromMode, toMode) {
        var _a;
        return (_a = MODE_CONVERTER_MAP[fromMode])[toMode].apply(_a, components);
    }

    var CONSTRAINT_MAP = {
        hsl: function (comps) {
            var _a;
            return [
                loopRange(comps[0], 360),
                constrainRange(comps[1], 0, 100),
                constrainRange(comps[2], 0, 100),
                constrainRange((_a = comps[3]) !== null && _a !== void 0 ? _a : 1, 0, 1),
            ];
        },
        hsv: function (comps) {
            var _a;
            return [
                loopRange(comps[0], 360),
                constrainRange(comps[1], 0, 100),
                constrainRange(comps[2], 0, 100),
                constrainRange((_a = comps[3]) !== null && _a !== void 0 ? _a : 1, 0, 1),
            ];
        },
        rgb: function (comps) {
            var _a;
            return [
                constrainRange(comps[0], 0, 255),
                constrainRange(comps[1], 0, 255),
                constrainRange(comps[2], 0, 255),
                constrainRange((_a = comps[3]) !== null && _a !== void 0 ? _a : 1, 0, 1),
            ];
        },
    };
    function isRgbColorComponent(obj, key) {
        if (typeof obj !== 'object' || isEmpty(obj)) {
            return false;
        }
        return key in obj && typeof obj[key] === 'number';
    }
    /**
     * @hidden
     */
    var Color = /** @class */ (function () {
        function Color(comps, mode) {
            this.mode_ = mode;
            this.comps_ = CONSTRAINT_MAP[mode](comps);
        }
        Color.black = function () {
            return new Color([0, 0, 0], 'rgb');
        };
        Color.fromObject = function (obj) {
            var comps = 'a' in obj ? [obj.r, obj.g, obj.b, obj.a] : [obj.r, obj.g, obj.b];
            return new Color(comps, 'rgb');
        };
        Color.toRgbaObject = function (color) {
            return color.toRgbaObject();
        };
        Color.isRgbColorObject = function (obj) {
            return (isRgbColorComponent(obj, 'r') &&
                isRgbColorComponent(obj, 'g') &&
                isRgbColorComponent(obj, 'b'));
        };
        Color.isRgbaColorObject = function (obj) {
            return this.isRgbColorObject(obj) && isRgbColorComponent(obj, 'a');
        };
        Color.isColorObject = function (obj) {
            return this.isRgbColorObject(obj);
        };
        Color.equals = function (v1, v2) {
            if (v1.mode_ !== v2.mode_) {
                return false;
            }
            var comps1 = v1.comps_;
            var comps2 = v2.comps_;
            for (var i = 0; i < comps1.length; i++) {
                if (comps1[i] !== comps2[i]) {
                    return false;
                }
            }
            return true;
        };
        Object.defineProperty(Color.prototype, "mode", {
            get: function () {
                return this.mode_;
            },
            enumerable: false,
            configurable: true
        });
        Color.prototype.getComponents = function (opt_mode) {
            return appendAlphaComponent(convertColorMode(removeAlphaComponent(this.comps_), this.mode_, opt_mode || this.mode_), this.comps_[3]);
        };
        Color.prototype.toRgbaObject = function () {
            var rgbComps = this.getComponents('rgb');
            return {
                r: rgbComps[0],
                g: rgbComps[1],
                b: rgbComps[2],
                a: rgbComps[3],
            };
        };
        return Color;
    }());

    function parseCssNumberOrPercentage(text, maxValue) {
        var m = text.match(/^(.+)%$/);
        if (!m) {
            return Math.min(parseFloat(text), maxValue);
        }
        return Math.min(parseFloat(m[1]) * 0.01 * maxValue, maxValue);
    }
    var ANGLE_TO_DEG_MAP = {
        deg: function (angle) { return angle; },
        grad: function (angle) { return (angle * 360) / 400; },
        rad: function (angle) { return (angle * 360) / (2 * Math.PI); },
        turn: function (angle) { return angle * 360; },
    };
    function parseCssNumberOrAngle(text) {
        var m = text.match(/^([0-9.]+?)(deg|grad|rad|turn)$/);
        if (!m) {
            return parseFloat(text);
        }
        var angle = parseFloat(m[1]);
        var unit = m[2];
        return ANGLE_TO_DEG_MAP[unit](angle);
    }
    var NOTATION_TO_PARSER_MAP = {
        'func.rgb': function (text) {
            var m = text.match(/^rgb\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
            if (!m) {
                return null;
            }
            var comps = [
                parseCssNumberOrPercentage(m[1], 255),
                parseCssNumberOrPercentage(m[2], 255),
                parseCssNumberOrPercentage(m[3], 255),
            ];
            if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
                return null;
            }
            return new Color(comps, 'rgb');
        },
        'func.rgba': function (text) {
            var m = text.match(/^rgba\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
            if (!m) {
                return null;
            }
            var comps = [
                parseCssNumberOrPercentage(m[1], 255),
                parseCssNumberOrPercentage(m[2], 255),
                parseCssNumberOrPercentage(m[3], 255),
                parseCssNumberOrPercentage(m[4], 1),
            ];
            if (isNaN(comps[0]) ||
                isNaN(comps[1]) ||
                isNaN(comps[2]) ||
                isNaN(comps[3])) {
                return null;
            }
            return new Color(comps, 'rgb');
        },
        'func.hsl': function (text) {
            var m = text.match(/^hsl\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
            if (!m) {
                return null;
            }
            var comps = [
                parseCssNumberOrAngle(m[1]),
                parseCssNumberOrPercentage(m[2], 100),
                parseCssNumberOrPercentage(m[3], 100),
            ];
            if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
                return null;
            }
            return new Color(comps, 'hsl');
        },
        'func.hsla': function (text) {
            var m = text.match(/^hsla\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
            if (!m) {
                return null;
            }
            var comps = [
                parseCssNumberOrAngle(m[1]),
                parseCssNumberOrPercentage(m[2], 100),
                parseCssNumberOrPercentage(m[3], 100),
                parseCssNumberOrPercentage(m[4], 1),
            ];
            if (isNaN(comps[0]) ||
                isNaN(comps[1]) ||
                isNaN(comps[2]) ||
                isNaN(comps[3])) {
                return null;
            }
            return new Color(comps, 'hsl');
        },
        'hex.rgb': function (text) {
            var mRrggbb = text.match(/^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
            if (mRrggbb) {
                return new Color([
                    parseInt(mRrggbb[1] + mRrggbb[1], 16),
                    parseInt(mRrggbb[2] + mRrggbb[2], 16),
                    parseInt(mRrggbb[3] + mRrggbb[3], 16),
                ], 'rgb');
            }
            var mRgb = text.match(/^#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
            if (mRgb) {
                return new Color([parseInt(mRgb[1], 16), parseInt(mRgb[2], 16), parseInt(mRgb[3], 16)], 'rgb');
            }
            return null;
        },
        'hex.rgba': function (text) {
            var mRrggbb = text.match(/^#?([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
            if (mRrggbb) {
                return new Color([
                    parseInt(mRrggbb[1] + mRrggbb[1], 16),
                    parseInt(mRrggbb[2] + mRrggbb[2], 16),
                    parseInt(mRrggbb[3] + mRrggbb[3], 16),
                    mapRange(parseInt(mRrggbb[4] + mRrggbb[4], 16), 0, 255, 0, 1),
                ], 'rgb');
            }
            var mRgb = text.match(/^#?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
            if (mRgb) {
                return new Color([
                    parseInt(mRgb[1], 16),
                    parseInt(mRgb[2], 16),
                    parseInt(mRgb[3], 16),
                    mapRange(parseInt(mRgb[4], 16), 0, 255, 0, 1),
                ], 'rgb');
            }
            return null;
        },
    };
    /**
     * @hidden
     */
    function getColorNotation(text) {
        var notations = Object.keys(NOTATION_TO_PARSER_MAP);
        return notations.reduce(function (result, notation) {
            if (result) {
                return result;
            }
            var subparser = NOTATION_TO_PARSER_MAP[notation];
            return subparser(text) ? notation : null;
        }, null);
    }
    /**
     * @hidden
     */
    var CompositeColorParser = function (text) {
        var notation = getColorNotation(text);
        return notation ? NOTATION_TO_PARSER_MAP[notation](text) : null;
    };
    function hasAlphaComponent(notation) {
        return (notation === 'func.hsla' ||
            notation === 'func.rgba' ||
            notation === 'hex.rgba');
    }
    /**
     * @hidden
     */
    function colorFromString(value) {
        if (typeof value === 'string') {
            var cv = CompositeColorParser(value);
            if (cv) {
                return cv;
            }
        }
        return Color.black();
    }
    function zerofill(comp) {
        var hex = constrainRange(Math.floor(comp), 0, 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }
    /**
     * @hidden
     */
    function colorToHexRgbString(value) {
        var hexes = removeAlphaComponent(value.getComponents('rgb'))
            .map(zerofill)
            .join('');
        return "#" + hexes;
    }
    /**
     * @hidden
     */
    function colorToHexRgbaString(value) {
        var rgbaComps = value.getComponents('rgb');
        var hexes = [rgbaComps[0], rgbaComps[1], rgbaComps[2], rgbaComps[3] * 255]
            .map(zerofill)
            .join('');
        return "#" + hexes;
    }
    /**
     * @hidden
     */
    function colorToFunctionalRgbString(value) {
        var formatter = createNumberFormatter(0);
        var comps = removeAlphaComponent(value.getComponents('rgb')).map(function (comp) {
            return formatter(comp);
        });
        return "rgb(" + comps.join(', ') + ")";
    }
    /**
     * @hidden
     */
    function colorToFunctionalRgbaString(value) {
        var aFormatter = createNumberFormatter(2);
        var rgbFormatter = createNumberFormatter(0);
        var comps = value.getComponents('rgb').map(function (comp, index) {
            var formatter = index === 3 ? aFormatter : rgbFormatter;
            return formatter(comp);
        });
        return "rgba(" + comps.join(', ') + ")";
    }
    /**
     * @hidden
     */
    function colorToFunctionalHslString(value) {
        var formatters = [
            createNumberFormatter(0),
            formatPercentage,
            formatPercentage,
        ];
        var comps = removeAlphaComponent(value.getComponents('hsl')).map(function (comp, index) { return formatters[index](comp); });
        return "hsl(" + comps.join(', ') + ")";
    }
    /**
     * @hidden
     */
    function colorToFunctionalHslaString(value) {
        var formatters = [
            createNumberFormatter(0),
            formatPercentage,
            formatPercentage,
            createNumberFormatter(2),
        ];
        var comps = value
            .getComponents('hsl')
            .map(function (comp, index) { return formatters[index](comp); });
        return "hsla(" + comps.join(', ') + ")";
    }
    var NOTATION_TO_STRINGIFIER_MAP = {
        'func.hsl': colorToFunctionalHslString,
        'func.hsla': colorToFunctionalHslaString,
        'func.rgb': colorToFunctionalRgbString,
        'func.rgba': colorToFunctionalRgbaString,
        'hex.rgb': colorToHexRgbString,
        'hex.rgba': colorToHexRgbaString,
    };
    function getColorStringifier(notation) {
        return NOTATION_TO_STRINGIFIER_MAP[notation];
    }

    var className$e = ClassName('clsw');
    /**
     * @hidden
     */
    var ColorSwatchView = /** @class */ (function () {
        function ColorSwatchView(doc, config) {
            this.onValueChange_ = this.onValueChange_.bind(this);
            config.value.emitter.on('change', this.onValueChange_);
            this.value = config.value;
            this.element = doc.createElement('div');
            this.element.classList.add(className$e());
            var swatchElem = doc.createElement('div');
            swatchElem.classList.add(className$e('sw'));
            this.element.appendChild(swatchElem);
            this.swatchElem_ = swatchElem;
            var buttonElem = doc.createElement('button');
            buttonElem.classList.add(className$e('b'));
            this.element.appendChild(buttonElem);
            this.buttonElement = buttonElem;
            var pickerElem = doc.createElement('div');
            pickerElem.classList.add(className$e('p'));
            this.pickerView_ = config.pickerView;
            pickerElem.appendChild(this.pickerView_.element);
            this.element.appendChild(pickerElem);
            this.update();
        }
        ColorSwatchView.prototype.update = function () {
            var value = this.value.rawValue;
            this.swatchElem_.style.backgroundColor = colorToHexRgbaString(value);
        };
        ColorSwatchView.prototype.onValueChange_ = function () {
            this.update();
        };
        return ColorSwatchView;
    }());

    /**
     * A number range constraint.
     */
    var RangeConstraint = /** @class */ (function () {
        function RangeConstraint(config) {
            this.maxValue = config.max;
            this.minValue = config.min;
        }
        RangeConstraint.prototype.constrain = function (value) {
            var result = value;
            if (!isEmpty(this.minValue)) {
                result = Math.max(result, this.minValue);
            }
            if (!isEmpty(this.maxValue)) {
                result = Math.min(result, this.maxValue);
            }
            return result;
        };
        return RangeConstraint;
    }());

    /**
     * @hidden
     */
    var Foldable = /** @class */ (function () {
        function Foldable() {
            this.emitter = new Emitter();
            this.expanded_ = false;
        }
        Object.defineProperty(Foldable.prototype, "expanded", {
            get: function () {
                return this.expanded_;
            },
            set: function (expanded) {
                var changed = this.expanded_ !== expanded;
                if (changed) {
                    this.expanded_ = expanded;
                    this.emitter.emit('change', {
                        sender: this,
                    });
                }
            },
            enumerable: false,
            configurable: true
        });
        return Foldable;
    }());

    /**
     * Synchronizes two values.
     */
    function connectValues(_a) {
        var primary = _a.primary, secondary = _a.secondary, forward = _a.forward, backward = _a.backward;
        // Prevents an event firing loop
        // e.g.
        // primary changed
        // -> applies changes to secondary
        // -> secondary changed
        // -> applies changes to primary
        // -> ...
        var changing = false;
        function preventFeedback(callback) {
            if (changing) {
                return;
            }
            changing = true;
            callback();
            changing = false;
        }
        primary.emitter.on('change', function () {
            preventFeedback(function () {
                secondary.rawValue = forward(primary, secondary);
            });
        });
        secondary.emitter.on('change', function () {
            preventFeedback(function () {
                primary.rawValue = backward(primary, secondary);
            });
        });
        preventFeedback(function () {
            secondary.rawValue = forward(primary, secondary);
        });
    }

    /**
     * @hidden
     */
    function getStepForKey(baseStep, keys) {
        var step = baseStep * (keys.altKey ? 0.1 : 1) * (keys.shiftKey ? 10 : 1);
        if (keys.upKey) {
            return +step;
        }
        else if (keys.downKey) {
            return -step;
        }
        return 0;
    }
    /**
     * @hidden
     */
    function getVerticalStepKeys(ev) {
        return {
            altKey: ev.altKey,
            downKey: ev.keyCode === 40,
            shiftKey: ev.shiftKey,
            upKey: ev.keyCode === 38,
        };
    }
    /**
     * @hidden
     */
    function getHorizontalStepKeys(ev) {
        return {
            altKey: ev.altKey,
            downKey: ev.keyCode === 37,
            shiftKey: ev.shiftKey,
            upKey: ev.keyCode === 39,
        };
    }
    /**
     * @hidden
     */
    function isVerticalArrowKey(keyCode) {
        return keyCode === 38 || keyCode === 40;
    }
    /**
     * @hidden
     */
    function isArrowKey(keyCode) {
        return isVerticalArrowKey(keyCode) || keyCode === 37 || keyCode === 39;
    }

    function computeOffset(ev, elem) {
        // NOTE: OffsetX/Y should be computed from page and window properties to capture mouse events
        var win = elem.ownerDocument.defaultView;
        var rect = elem.getBoundingClientRect();
        return {
            x: ev.pageX - (((win && win.scrollX) || 0) + rect.left),
            y: ev.pageY - (((win && win.scrollY) || 0) + rect.top),
        };
    }
    /**
     * A utility class to handle both mouse and touch events.
     */
    var PointerHandler = /** @class */ (function () {
        function PointerHandler(element) {
            this.onDocumentMouseMove_ = this.onDocumentMouseMove_.bind(this);
            this.onDocumentMouseUp_ = this.onDocumentMouseUp_.bind(this);
            this.onMouseDown_ = this.onMouseDown_.bind(this);
            this.onTouchEnd_ = this.onTouchEnd_.bind(this);
            this.onTouchMove_ = this.onTouchMove_.bind(this);
            this.onTouchStart_ = this.onTouchStart_.bind(this);
            this.element = element;
            this.emitter = new Emitter();
            this.pressed_ = false;
            var doc = this.element.ownerDocument;
            if (supportsTouch(doc)) {
                element.addEventListener('touchstart', this.onTouchStart_);
                element.addEventListener('touchmove', this.onTouchMove_);
                element.addEventListener('touchend', this.onTouchEnd_);
            }
            else {
                element.addEventListener('mousedown', this.onMouseDown_);
                doc.addEventListener('mousemove', this.onDocumentMouseMove_);
                doc.addEventListener('mouseup', this.onDocumentMouseUp_);
            }
        }
        PointerHandler.prototype.computePosition_ = function (offset) {
            var rect = this.element.getBoundingClientRect();
            return {
                bounds: {
                    width: rect.width,
                    height: rect.height,
                },
                point: offset
                    ? {
                        x: offset.x,
                        y: offset.y,
                    }
                    : null,
            };
        };
        PointerHandler.prototype.onMouseDown_ = function (e) {
            var _a;
            // Prevent native text selection
            e.preventDefault();
            (_a = e.currentTarget) === null || _a === void 0 ? void 0 : _a.focus();
            this.pressed_ = true;
            this.emitter.emit('down', {
                data: this.computePosition_(computeOffset(e, this.element)),
                sender: this,
            });
        };
        PointerHandler.prototype.onDocumentMouseMove_ = function (e) {
            if (!this.pressed_) {
                return;
            }
            this.emitter.emit('move', {
                data: this.computePosition_(computeOffset(e, this.element)),
                sender: this,
            });
        };
        PointerHandler.prototype.onDocumentMouseUp_ = function (e) {
            if (!this.pressed_) {
                return;
            }
            this.pressed_ = false;
            this.emitter.emit('up', {
                data: this.computePosition_(computeOffset(e, this.element)),
                sender: this,
            });
        };
        PointerHandler.prototype.onTouchStart_ = function (e) {
            // Prevent native page scroll
            e.preventDefault();
            var touch = e.targetTouches.item(0);
            var rect = this.element.getBoundingClientRect();
            this.emitter.emit('down', {
                data: this.computePosition_(touch
                    ? {
                        x: touch.clientX - rect.left,
                        y: touch.clientY - rect.top,
                    }
                    : undefined),
                sender: this,
            });
        };
        PointerHandler.prototype.onTouchMove_ = function (e) {
            var touch = e.targetTouches.item(0);
            var rect = this.element.getBoundingClientRect();
            this.emitter.emit('move', {
                data: this.computePosition_(touch
                    ? {
                        x: touch.clientX - rect.left,
                        y: touch.clientY - rect.top,
                    }
                    : undefined),
                sender: this,
            });
        };
        PointerHandler.prototype.onTouchEnd_ = function (e) {
            var touch = e.targetTouches.item(0);
            var rect = this.element.getBoundingClientRect();
            this.emitter.emit('up', {
                data: this.computePosition_(touch
                    ? {
                        x: touch.clientX - rect.left,
                        y: touch.clientY - rect.top,
                    }
                    : undefined),
                sender: this,
            });
        };
        return PointerHandler;
    }());

    var className$d = ClassName('txt');
    var NumberTextView = /** @class */ (function (_super) {
        __extends(NumberTextView, _super);
        function NumberTextView(doc, config) {
            var _this = _super.call(this, doc, config) || this;
            _this.element.classList.add(className$d(undefined, 'num'));
            _this.onDraggingChange_ = _this.onDraggingChange_.bind(_this);
            _this.dragging_ = config.dragging;
            _this.draggingScale_ = config.draggingScale;
            _this.dragging_.emitter.on('change', _this.onDraggingChange_);
            _this.element.classList.add(className$d());
            _this.inputElement.classList.add(className$d('i'));
            var knobElem = doc.createElement('div');
            knobElem.classList.add(className$d('k'));
            _this.element.appendChild(knobElem);
            _this.knobElement = knobElem;
            var guideElem = doc.createElementNS(SVG_NS, 'svg');
            guideElem.classList.add(className$d('g'));
            _this.knobElement.appendChild(guideElem);
            var bodyElem = doc.createElementNS(SVG_NS, 'path');
            bodyElem.classList.add(className$d('gb'));
            guideElem.appendChild(bodyElem);
            _this.guideBodyElem_ = bodyElem;
            var headElem = doc.createElementNS(SVG_NS, 'path');
            headElem.classList.add(className$d('gh'));
            guideElem.appendChild(headElem);
            _this.guideHeadElem_ = headElem;
            var tooltipElem = doc.createElement('div');
            tooltipElem.classList.add(ClassName('tt')());
            _this.knobElement.appendChild(tooltipElem);
            _this.tooltipElem_ = tooltipElem;
            return _this;
        }
        NumberTextView.prototype.onDraggingChange_ = function (ev) {
            if (ev.rawValue === null) {
                this.element.classList.remove(className$d(undefined, 'drg'));
                return;
            }
            this.element.classList.add(className$d(undefined, 'drg'));
            var x = ev.rawValue / this.draggingScale_;
            var aox = x + (x > 0 ? -1 : x < 0 ? +1 : 0);
            var adx = constrainRange(-aox, -4, +4);
            this.guideHeadElem_.setAttributeNS(null, 'd', ["M " + (aox + adx) + ",0 L" + aox + ",4 L" + (aox + adx) + ",8", "M " + x + ",-1 L" + x + ",9"].join(' '));
            this.guideBodyElem_.setAttributeNS(null, 'd', "M 0,4 L" + x + ",4");
            this.tooltipElem_.textContent = this.formatter(this.value.rawValue);
            this.tooltipElem_.style.left = x + "px";
        };
        return NumberTextView;
    }(TextView));

    /**
     * @hidden
     */
    var NumberTextController = /** @class */ (function () {
        function NumberTextController(doc, config) {
            this.originRawValue_ = 0;
            this.onInputChange_ = this.onInputChange_.bind(this);
            this.onInputKeyDown_ = this.onInputKeyDown_.bind(this);
            this.onPointerDown_ = this.onPointerDown_.bind(this);
            this.onPointerMove_ = this.onPointerMove_.bind(this);
            this.onPointerUp_ = this.onPointerUp_.bind(this);
            this.parser_ = config.parser;
            this.value = config.value;
            this.baseStep_ = config.baseStep;
            this.draggingScale_ = config.draggingScale;
            this.dragging_ = new Value(null);
            this.view = new NumberTextView(doc, {
                arrayPosition: config.arrayPosition,
                formatter: config.formatter,
                dragging: this.dragging_,
                draggingScale: this.draggingScale_,
                value: this.value,
            });
            this.view.inputElement.addEventListener('change', this.onInputChange_);
            this.view.inputElement.addEventListener('keydown', this.onInputKeyDown_);
            var ph = new PointerHandler(this.view.knobElement);
            ph.emitter.on('down', this.onPointerDown_);
            ph.emitter.on('move', this.onPointerMove_);
            ph.emitter.on('up', this.onPointerUp_);
        }
        NumberTextController.prototype.onInputChange_ = function (e) {
            var inputElem = forceCast(e.currentTarget);
            var value = inputElem.value;
            var parsedValue = this.parser_(value);
            if (!isEmpty(parsedValue)) {
                this.value.rawValue = parsedValue;
            }
            this.view.update();
        };
        NumberTextController.prototype.onInputKeyDown_ = function (e) {
            var step = getStepForKey(this.baseStep_, getVerticalStepKeys(e));
            if (step !== 0) {
                this.value.rawValue += step;
                this.view.update();
            }
        };
        NumberTextController.prototype.onPointerDown_ = function () {
            this.originRawValue_ = this.value.rawValue;
            this.dragging_.rawValue = 0;
        };
        NumberTextController.prototype.onPointerMove_ = function (ev) {
            if (!ev.data.point) {
                return;
            }
            var dx = ev.data.point.x - ev.data.bounds.width / 2;
            this.value.rawValue = this.originRawValue_ + dx * this.draggingScale_;
            this.dragging_.rawValue = this.value.rawValue - this.originRawValue_;
        };
        NumberTextController.prototype.onPointerUp_ = function () {
            this.dragging_.rawValue = null;
        };
        return NumberTextController;
    }());

    var className$c = ClassName('clp');
    /**
     * @hidden
     */
    var ColorPickerView = /** @class */ (function () {
        function ColorPickerView(doc, config) {
            this.alphaViews_ = null;
            this.onFoldableChange_ = this.onFoldableChange_.bind(this);
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.pickedColor = config.pickedColor;
            this.pickedColor.value.emitter.on('change', this.onValueChange_);
            this.foldable = config.foldable;
            this.foldable.emitter.on('change', this.onFoldableChange_);
            this.element = doc.createElement('div');
            this.element.classList.add(className$c());
            var hsvElem = doc.createElement('div');
            hsvElem.classList.add(className$c('hsv'));
            var svElem = doc.createElement('div');
            svElem.classList.add(className$c('sv'));
            this.svPaletteView_ = config.svPaletteView;
            svElem.appendChild(this.svPaletteView_.element);
            hsvElem.appendChild(svElem);
            var hElem = doc.createElement('div');
            hElem.classList.add(className$c('h'));
            this.hPaletteView_ = config.hPaletteView;
            hElem.appendChild(this.hPaletteView_.element);
            hsvElem.appendChild(hElem);
            this.element.appendChild(hsvElem);
            var rgbElem = doc.createElement('div');
            rgbElem.classList.add(className$c('rgb'));
            this.textView_ = config.textView;
            rgbElem.appendChild(this.textView_.element);
            this.element.appendChild(rgbElem);
            if (config.alphaViews) {
                this.alphaViews_ = {
                    palette: config.alphaViews.palette,
                    text: config.alphaViews.text,
                };
                var aElem = doc.createElement('div');
                aElem.classList.add(className$c('a'));
                var apElem = doc.createElement('div');
                apElem.classList.add(className$c('ap'));
                apElem.appendChild(this.alphaViews_.palette.element);
                aElem.appendChild(apElem);
                var atElem = doc.createElement('div');
                atElem.classList.add(className$c('at'));
                atElem.appendChild(this.alphaViews_.text.element);
                aElem.appendChild(atElem);
                this.element.appendChild(aElem);
            }
            this.update();
        }
        Object.defineProperty(ColorPickerView.prototype, "allFocusableElements", {
            get: function () {
                var elems = __spreadArrays([
                    this.svPaletteView_.element,
                    this.hPaletteView_.element
                ], this.textView_.textViews.map(function (v) { return v.inputElement; }));
                if (this.alphaViews_) {
                    elems.push(this.alphaViews_.palette.element, this.alphaViews_.text.inputElement);
                }
                return forceCast(elems);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ColorPickerView.prototype, "value", {
            get: function () {
                return this.pickedColor.value;
            },
            enumerable: false,
            configurable: true
        });
        ColorPickerView.prototype.update = function () {
            if (this.foldable.expanded) {
                this.element.classList.add(className$c(undefined, 'expanded'));
            }
            else {
                this.element.classList.remove(className$c(undefined, 'expanded'));
            }
        };
        ColorPickerView.prototype.onValueChange_ = function () {
            this.update();
        };
        ColorPickerView.prototype.onFoldableChange_ = function () {
            this.update();
        };
        return ColorPickerView;
    }());

    /**
     * @hidden
     */
    function getBaseStepForColor(forAlpha) {
        return forAlpha ? 0.1 : 1;
    }

    var className$b = ClassName('apl');
    /**
     * @hidden
     */
    var APaletteView = /** @class */ (function () {
        function APaletteView(doc, config) {
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.value = config.value;
            this.value.emitter.on('change', this.onValueChange_);
            this.element = doc.createElement('div');
            this.element.classList.add(className$b());
            this.element.tabIndex = 0;
            var barElem = doc.createElement('div');
            barElem.classList.add(className$b('b'));
            this.element.appendChild(barElem);
            var colorElem = doc.createElement('div');
            colorElem.classList.add(className$b('c'));
            barElem.appendChild(colorElem);
            this.colorElem_ = colorElem;
            var markerElem = doc.createElement('div');
            markerElem.classList.add(className$b('m'));
            this.element.appendChild(markerElem);
            this.markerElem_ = markerElem;
            var previewElem = doc.createElement('div');
            previewElem.classList.add(className$b('p'));
            this.markerElem_.appendChild(previewElem);
            this.previewElem_ = previewElem;
            this.update();
        }
        APaletteView.prototype.update = function () {
            var c = this.value.rawValue;
            var rgbaComps = c.getComponents('rgb');
            var leftColor = new Color([rgbaComps[0], rgbaComps[1], rgbaComps[2], 0], 'rgb');
            var rightColor = new Color([rgbaComps[0], rgbaComps[1], rgbaComps[2], 255], 'rgb');
            var gradientComps = [
                'to right',
                colorToFunctionalRgbaString(leftColor),
                colorToFunctionalRgbaString(rightColor),
            ];
            this.colorElem_.style.background = "linear-gradient(" + gradientComps.join(',') + ")";
            this.previewElem_.style.backgroundColor = colorToFunctionalRgbaString(c);
            var left = mapRange(rgbaComps[3], 0, 1, 0, 100);
            this.markerElem_.style.left = left + "%";
        };
        APaletteView.prototype.onValueChange_ = function () {
            this.update();
        };
        return APaletteView;
    }());

    /**
     * @hidden
     */
    var APaletteController = /** @class */ (function () {
        function APaletteController(doc, config) {
            this.onKeyDown_ = this.onKeyDown_.bind(this);
            this.onPointerDown_ = this.onPointerDown_.bind(this);
            this.onPointerMove_ = this.onPointerMove_.bind(this);
            this.onPointerUp_ = this.onPointerUp_.bind(this);
            this.value = config.value;
            this.view = new APaletteView(doc, {
                value: this.value,
            });
            this.ptHandler_ = new PointerHandler(this.view.element);
            this.ptHandler_.emitter.on('down', this.onPointerDown_);
            this.ptHandler_.emitter.on('move', this.onPointerMove_);
            this.ptHandler_.emitter.on('up', this.onPointerUp_);
            this.view.element.addEventListener('keydown', this.onKeyDown_);
        }
        APaletteController.prototype.handlePointerEvent_ = function (d) {
            if (!d.point) {
                return;
            }
            var alpha = d.point.x / d.bounds.width;
            var c = this.value.rawValue;
            var _a = c.getComponents('hsv'), h = _a[0], s = _a[1], v = _a[2];
            this.value.rawValue = new Color([h, s, v, alpha], 'hsv');
            this.view.update();
        };
        APaletteController.prototype.onPointerDown_ = function (ev) {
            this.handlePointerEvent_(ev.data);
        };
        APaletteController.prototype.onPointerMove_ = function (ev) {
            this.handlePointerEvent_(ev.data);
        };
        APaletteController.prototype.onPointerUp_ = function (ev) {
            this.handlePointerEvent_(ev.data);
        };
        APaletteController.prototype.onKeyDown_ = function (ev) {
            var step = getStepForKey(getBaseStepForColor(true), getHorizontalStepKeys(ev));
            var c = this.value.rawValue;
            var _a = c.getComponents('hsv'), h = _a[0], s = _a[1], v = _a[2], a = _a[3];
            this.value.rawValue = new Color([h, s, v, a + step], 'hsv');
        };
        return APaletteController;
    }());

    var className$a = ClassName('cltxt');
    function createModeSelectElement(doc) {
        var selectElem = doc.createElement('select');
        var items = [
            { text: 'RGB', value: 'rgb' },
            { text: 'HSL', value: 'hsl' },
            { text: 'HSV', value: 'hsv' },
        ];
        selectElem.appendChild(items.reduce(function (frag, item) {
            var optElem = doc.createElement('option');
            optElem.textContent = item.text;
            optElem.value = item.value;
            frag.appendChild(optElem);
            return frag;
        }, doc.createDocumentFragment()));
        return selectElem;
    }
    /**
     * @hidden
     */
    var ColorTextView = /** @class */ (function () {
        function ColorTextView(doc, config) {
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.element = doc.createElement('div');
            this.element.classList.add(className$a());
            var modeElem = doc.createElement('div');
            modeElem.classList.add(className$a('m'));
            this.modeElem_ = createModeSelectElement(doc);
            this.modeElem_.classList.add(className$a('ms'));
            modeElem.appendChild(this.modeSelectElement);
            var modeMarkerElem = doc.createElement('div');
            modeMarkerElem.classList.add(className$a('mm'));
            modeMarkerElem.appendChild(createSvgIconElement(doc, 'dropdown'));
            modeElem.appendChild(modeMarkerElem);
            this.element.appendChild(modeElem);
            var textsElem = doc.createElement('div');
            textsElem.classList.add(className$a('w'));
            this.element.appendChild(textsElem);
            this.textsElem_ = textsElem;
            this.textViews_ = config.textViews;
            this.applyTextViews_();
            this.pickedColor = config.pickedColor;
            this.pickedColor.emitter.on('change', this.onValueChange_);
            this.update();
        }
        Object.defineProperty(ColorTextView.prototype, "modeSelectElement", {
            get: function () {
                return this.modeElem_;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ColorTextView.prototype, "textViews", {
            get: function () {
                return this.textViews_;
            },
            set: function (textViews) {
                this.textViews_ = textViews;
                this.applyTextViews_();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ColorTextView.prototype, "value", {
            get: function () {
                return this.pickedColor.value;
            },
            enumerable: false,
            configurable: true
        });
        ColorTextView.prototype.update = function () {
            this.modeElem_.value = this.pickedColor.mode;
        };
        ColorTextView.prototype.applyTextViews_ = function () {
            var _this = this;
            while (this.textsElem_.children.length > 0) {
                this.textsElem_.removeChild(this.textsElem_.children[0]);
            }
            var doc = this.element.ownerDocument;
            this.textViews_.forEach(function (v) {
                var compElem = doc.createElement('div');
                compElem.classList.add(className$a('c'));
                compElem.appendChild(v.element);
                _this.textsElem_.appendChild(compElem);
            });
        };
        ColorTextView.prototype.onValueChange_ = function () {
            this.update();
        };
        return ColorTextView;
    }());

    var FORMATTER = createNumberFormatter(0);
    var MODE_TO_CONSTRAINT_MAP = {
        rgb: function () {
            return new RangeConstraint({ min: 0, max: 255 });
        },
        hsl: function (index) {
            return index === 0
                ? new RangeConstraint({ min: 0, max: 360 })
                : new RangeConstraint({ min: 0, max: 100 });
        },
        hsv: function (index) {
            return index === 0
                ? new RangeConstraint({ min: 0, max: 360 })
                : new RangeConstraint({ min: 0, max: 100 });
        },
    };
    function createComponentController(doc, config, index) {
        return new NumberTextController(doc, {
            arrayPosition: index === 0 ? 'fst' : index === 3 - 1 ? 'lst' : 'mid',
            baseStep: getBaseStepForColor(false),
            draggingScale: 1,
            formatter: FORMATTER,
            parser: config.parser,
            value: new Value(0, {
                constraint: MODE_TO_CONSTRAINT_MAP[config.colorMode](index),
            }),
        });
    }
    /**
     * @hidden
     */
    var ColorTextController = /** @class */ (function () {
        function ColorTextController(doc, config) {
            this.onModeSelectChange_ = this.onModeSelectChange_.bind(this);
            this.parser_ = config.parser;
            this.pickedColor = config.pickedColor;
            this.ccs_ = this.createComponentControllers_(doc);
            this.view = new ColorTextView(doc, {
                pickedColor: this.pickedColor,
                textViews: [this.ccs_[0].view, this.ccs_[1].view, this.ccs_[2].view],
            });
            this.view.modeSelectElement.addEventListener('change', this.onModeSelectChange_);
        }
        Object.defineProperty(ColorTextController.prototype, "value", {
            get: function () {
                return this.pickedColor.value;
            },
            enumerable: false,
            configurable: true
        });
        ColorTextController.prototype.createComponentControllers_ = function (doc) {
            var _this = this;
            var cc = {
                colorMode: this.pickedColor.mode,
                parser: this.parser_,
            };
            var ccs = [
                createComponentController(doc, cc, 0),
                createComponentController(doc, cc, 1),
                createComponentController(doc, cc, 2),
            ];
            ccs.forEach(function (cs, index) {
                connectValues({
                    primary: _this.value,
                    secondary: cs.value,
                    forward: function (p) {
                        return p.rawValue.getComponents(_this.pickedColor.mode)[index];
                    },
                    backward: function (p, s) {
                        var rawMode = p.rawValue.mode;
                        var pickedMode = _this.pickedColor.mode;
                        var comps = p.rawValue.getComponents(pickedMode);
                        comps[index] = s.rawValue;
                        var newComps = convertColorMode(removeAlphaComponent(comps), pickedMode, rawMode);
                        return new Color(appendAlphaComponent(newComps, comps[3]), rawMode);
                    },
                });
            });
            return ccs;
        };
        ColorTextController.prototype.onModeSelectChange_ = function (ev) {
            var selectElem = ev.currentTarget;
            this.pickedColor.mode = selectElem.value;
            this.ccs_ = this.createComponentControllers_(this.view.element.ownerDocument);
            this.view.textViews = [
                this.ccs_[0].view,
                this.ccs_[1].view,
                this.ccs_[2].view,
            ];
        };
        return ColorTextController;
    }());

    var className$9 = ClassName('hpl');
    /**
     * @hidden
     */
    var HPaletteView = /** @class */ (function () {
        function HPaletteView(doc, config) {
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.value = config.value;
            this.value.emitter.on('change', this.onValueChange_);
            this.element = doc.createElement('div');
            this.element.classList.add(className$9());
            this.element.tabIndex = 0;
            var colorElem = doc.createElement('div');
            colorElem.classList.add(className$9('c'));
            this.element.appendChild(colorElem);
            var markerElem = doc.createElement('div');
            markerElem.classList.add(className$9('m'));
            this.element.appendChild(markerElem);
            this.markerElem_ = markerElem;
            this.update();
        }
        HPaletteView.prototype.update = function () {
            var c = this.value.rawValue;
            var h = c.getComponents('hsv')[0];
            this.markerElem_.style.backgroundColor = colorToFunctionalRgbString(new Color([h, 100, 100], 'hsv'));
            var left = mapRange(h, 0, 360, 0, 100);
            this.markerElem_.style.left = left + "%";
        };
        HPaletteView.prototype.onValueChange_ = function () {
            this.update();
        };
        return HPaletteView;
    }());

    /**
     * @hidden
     */
    var HPaletteController = /** @class */ (function () {
        function HPaletteController(doc, config) {
            this.onKeyDown_ = this.onKeyDown_.bind(this);
            this.onPointerDown_ = this.onPointerDown_.bind(this);
            this.onPointerMove_ = this.onPointerMove_.bind(this);
            this.onPointerUp_ = this.onPointerUp_.bind(this);
            this.value = config.value;
            this.view = new HPaletteView(doc, {
                value: this.value,
            });
            this.ptHandler_ = new PointerHandler(this.view.element);
            this.ptHandler_.emitter.on('down', this.onPointerDown_);
            this.ptHandler_.emitter.on('move', this.onPointerMove_);
            this.ptHandler_.emitter.on('up', this.onPointerUp_);
            this.view.element.addEventListener('keydown', this.onKeyDown_);
        }
        HPaletteController.prototype.handlePointerEvent_ = function (d) {
            if (!d.point) {
                return;
            }
            var hue = mapRange(d.point.x, 0, d.bounds.width, 0, 360);
            var c = this.value.rawValue;
            var _a = c.getComponents('hsv'), s = _a[1], v = _a[2], a = _a[3];
            this.value.rawValue = new Color([hue, s, v, a], 'hsv');
            this.view.update();
        };
        HPaletteController.prototype.onPointerDown_ = function (ev) {
            this.handlePointerEvent_(ev.data);
        };
        HPaletteController.prototype.onPointerMove_ = function (ev) {
            this.handlePointerEvent_(ev.data);
        };
        HPaletteController.prototype.onPointerUp_ = function (ev) {
            this.handlePointerEvent_(ev.data);
        };
        HPaletteController.prototype.onKeyDown_ = function (ev) {
            var step = getStepForKey(getBaseStepForColor(false), getHorizontalStepKeys(ev));
            var c = this.value.rawValue;
            var _a = c.getComponents('hsv'), h = _a[0], s = _a[1], v = _a[2], a = _a[3];
            this.value.rawValue = new Color([h + step, s, v, a], 'hsv');
        };
        return HPaletteController;
    }());

    var className$8 = ClassName('svp');
    var CANVAS_RESOL = 64;
    /**
     * @hidden
     */
    var SvPaletteView = /** @class */ (function () {
        function SvPaletteView(doc, config) {
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.value = config.value;
            this.value.emitter.on('change', this.onValueChange_);
            this.element = doc.createElement('div');
            this.element.classList.add(className$8());
            this.element.tabIndex = 0;
            var canvasElem = doc.createElement('canvas');
            canvasElem.height = CANVAS_RESOL;
            canvasElem.width = CANVAS_RESOL;
            canvasElem.classList.add(className$8('c'));
            this.element.appendChild(canvasElem);
            this.canvasElement = canvasElem;
            var markerElem = doc.createElement('div');
            markerElem.classList.add(className$8('m'));
            this.element.appendChild(markerElem);
            this.markerElem_ = markerElem;
            this.update();
        }
        SvPaletteView.prototype.update = function () {
            var ctx = getCanvasContext(this.canvasElement);
            if (!ctx) {
                return;
            }
            var c = this.value.rawValue;
            var hsvComps = c.getComponents('hsv');
            var width = this.canvasElement.width;
            var height = this.canvasElement.height;
            var imgData = ctx.getImageData(0, 0, width, height);
            var data = imgData.data;
            for (var iy = 0; iy < height; iy++) {
                for (var ix = 0; ix < width; ix++) {
                    var s = mapRange(ix, 0, width, 0, 100);
                    var v = mapRange(iy, 0, height, 100, 0);
                    var rgbComps = hsvToRgb(hsvComps[0], s, v);
                    var i = (iy * width + ix) * 4;
                    data[i] = rgbComps[0];
                    data[i + 1] = rgbComps[1];
                    data[i + 2] = rgbComps[2];
                    data[i + 3] = 255;
                }
            }
            ctx.putImageData(imgData, 0, 0);
            var left = mapRange(hsvComps[1], 0, 100, 0, 100);
            this.markerElem_.style.left = left + "%";
            var top = mapRange(hsvComps[2], 0, 100, 100, 0);
            this.markerElem_.style.top = top + "%";
        };
        SvPaletteView.prototype.onValueChange_ = function () {
            this.update();
        };
        return SvPaletteView;
    }());

    /**
     * @hidden
     */
    var SvPaletteController = /** @class */ (function () {
        function SvPaletteController(doc, config) {
            this.onKeyDown_ = this.onKeyDown_.bind(this);
            this.onPointerDown_ = this.onPointerDown_.bind(this);
            this.onPointerMove_ = this.onPointerMove_.bind(this);
            this.onPointerUp_ = this.onPointerUp_.bind(this);
            this.value = config.value;
            this.view = new SvPaletteView(doc, {
                value: this.value,
            });
            this.ptHandler_ = new PointerHandler(this.view.element);
            this.ptHandler_.emitter.on('down', this.onPointerDown_);
            this.ptHandler_.emitter.on('move', this.onPointerMove_);
            this.ptHandler_.emitter.on('up', this.onPointerUp_);
            this.view.element.addEventListener('keydown', this.onKeyDown_);
        }
        SvPaletteController.prototype.handlePointerEvent_ = function (d) {
            if (!d.point) {
                return;
            }
            var saturation = mapRange(d.point.x, 0, d.bounds.width, 0, 100);
            var value = mapRange(d.point.y, 0, d.bounds.height, 100, 0);
            var _a = this.value.rawValue.getComponents('hsv'), h = _a[0], a = _a[3];
            this.value.rawValue = new Color([h, saturation, value, a], 'hsv');
            this.view.update();
        };
        SvPaletteController.prototype.onPointerDown_ = function (ev) {
            this.handlePointerEvent_(ev.data);
        };
        SvPaletteController.prototype.onPointerMove_ = function (ev) {
            this.handlePointerEvent_(ev.data);
        };
        SvPaletteController.prototype.onPointerUp_ = function (ev) {
            this.handlePointerEvent_(ev.data);
        };
        SvPaletteController.prototype.onKeyDown_ = function (ev) {
            if (isArrowKey(ev.keyCode)) {
                ev.preventDefault();
            }
            var _a = this.value.rawValue.getComponents('hsv'), h = _a[0], s = _a[1], v = _a[2], a = _a[3];
            var baseStep = getBaseStepForColor(false);
            this.value.rawValue = new Color([
                h,
                s + getStepForKey(baseStep, getHorizontalStepKeys(ev)),
                v + getStepForKey(baseStep, getVerticalStepKeys(ev)),
                a,
            ], 'hsv');
        };
        return SvPaletteController;
    }());

    /**
     * @hidden
     */
    var ColorPickerController = /** @class */ (function () {
        function ColorPickerController(doc, config) {
            var _this = this;
            this.triggerElement = null;
            this.onFocusableElementBlur_ = this.onFocusableElementBlur_.bind(this);
            this.onKeyDown_ = this.onKeyDown_.bind(this);
            this.pickedColor = config.pickedColor;
            this.foldable = new Foldable();
            this.hPaletteIc_ = new HPaletteController(doc, {
                value: this.pickedColor.value,
            });
            this.svPaletteIc_ = new SvPaletteController(doc, {
                value: this.pickedColor.value,
            });
            this.alphaIcs_ = config.supportsAlpha
                ? {
                    palette: new APaletteController(doc, {
                        value: this.pickedColor.value,
                    }),
                    text: new NumberTextController(doc, {
                        draggingScale: 0.01,
                        formatter: createNumberFormatter(2),
                        parser: parseNumber,
                        baseStep: 0.1,
                        value: new Value(0, {
                            constraint: new RangeConstraint({ min: 0, max: 1 }),
                        }),
                    }),
                }
                : null;
            if (this.alphaIcs_) {
                connectValues({
                    primary: this.pickedColor.value,
                    secondary: this.alphaIcs_.text.value,
                    forward: function (p) {
                        return p.rawValue.getComponents()[3];
                    },
                    backward: function (p, s) {
                        var comps = p.rawValue.getComponents();
                        comps[3] = s.rawValue;
                        return new Color(comps, p.rawValue.mode);
                    },
                });
            }
            this.textIc_ = new ColorTextController(doc, {
                parser: parseNumber,
                pickedColor: this.pickedColor,
            });
            this.view = new ColorPickerView(doc, {
                alphaViews: this.alphaIcs_
                    ? {
                        palette: this.alphaIcs_.palette.view,
                        text: this.alphaIcs_.text.view,
                    }
                    : null,
                foldable: this.foldable,
                hPaletteView: this.hPaletteIc_.view,
                pickedColor: this.pickedColor,
                supportsAlpha: config.supportsAlpha,
                svPaletteView: this.svPaletteIc_.view,
                textView: this.textIc_.view,
            });
            this.view.element.addEventListener('keydown', this.onKeyDown_);
            this.view.allFocusableElements.forEach(function (elem) {
                elem.addEventListener('blur', _this.onFocusableElementBlur_);
            });
        }
        Object.defineProperty(ColorPickerController.prototype, "value", {
            get: function () {
                return this.pickedColor.value;
            },
            enumerable: false,
            configurable: true
        });
        ColorPickerController.prototype.onFocusableElementBlur_ = function (ev) {
            var elem = this.view.element;
            var nextTarget = findNextTarget(ev);
            if (nextTarget && elem.contains(nextTarget)) {
                // Next target is in the picker
                return;
            }
            if (nextTarget &&
                nextTarget === this.triggerElement &&
                !supportsTouch(elem.ownerDocument)) {
                // Next target is the trigger button
                return;
            }
            this.foldable.expanded = false;
        };
        ColorPickerController.prototype.onKeyDown_ = function (ev) {
            if (ev.keyCode === 27) {
                this.foldable.expanded = false;
            }
        };
        return ColorPickerController;
    }());

    /**
     * @hidden
     */
    var ColorSwatchController = /** @class */ (function () {
        function ColorSwatchController(doc, config) {
            this.onButtonBlur_ = this.onButtonBlur_.bind(this);
            this.onButtonClick_ = this.onButtonClick_.bind(this);
            this.value = config.value;
            this.pickerIc_ = new ColorPickerController(doc, {
                pickedColor: new PickedColor(this.value),
                supportsAlpha: config.supportsAlpha,
            });
            this.view = new ColorSwatchView(doc, {
                pickerView: this.pickerIc_.view,
                value: this.value,
            });
            this.view.buttonElement.addEventListener('blur', this.onButtonBlur_);
            this.view.buttonElement.addEventListener('click', this.onButtonClick_);
            this.pickerIc_.triggerElement = this.view.buttonElement;
        }
        ColorSwatchController.prototype.onButtonBlur_ = function (e) {
            var elem = this.view.element;
            var nextTarget = forceCast(e.relatedTarget);
            if (!nextTarget || !elem.contains(nextTarget)) {
                this.pickerIc_.foldable.expanded = false;
            }
        };
        ColorSwatchController.prototype.onButtonClick_ = function () {
            this.pickerIc_.foldable.expanded = !this.pickerIc_.foldable.expanded;
            if (this.pickerIc_.foldable.expanded) {
                this.pickerIc_.view.allFocusableElements[0].focus();
            }
        };
        return ColorSwatchController;
    }());

    /**
     * @hidden
     */
    var ColorSwatchTextController = /** @class */ (function () {
        function ColorSwatchTextController(doc, config) {
            this.value = config.value;
            this.swatchIc_ = new ColorSwatchController(doc, {
                supportsAlpha: config.supportsAlpha,
                value: this.value,
            });
            this.textIc_ = new TextController(doc, {
                formatter: config.formatter,
                parser: config.parser,
                value: this.value,
            });
            this.view = new ColorSwatchTextView(doc, {
                swatchView: this.swatchIc_.view,
                textView: this.textIc_.view,
            });
        }
        return ColorSwatchTextController;
    }());

    /**
     * @hidden
     */
    function colorFromObject(value) {
        if (Color.isColorObject(value)) {
            return Color.fromObject(value);
        }
        return Color.black();
    }
    /**
     * @hidden
     */
    function colorToRgbNumber(value) {
        return removeAlphaComponent(value.getComponents('rgb')).reduce(function (result, comp) {
            return (result << 8) | (Math.floor(comp) & 0xff);
        }, 0);
    }
    /**
     * @hidden
     */
    function colorToRgbaNumber(value) {
        return (value.getComponents('rgb').reduce(function (result, comp, index) {
            var hex = Math.floor(index === 3 ? comp * 255 : comp) & 0xff;
            return (result << 8) | hex;
        }, 0) >>> 0);
    }
    /**
     * @hidden
     */
    function numberToRgbColor(num) {
        return new Color([(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff], 'rgb');
    }
    /**
     * @hidden
     */
    function numberToRgbaColor(num) {
        return new Color([
            (num >> 24) & 0xff,
            (num >> 16) & 0xff,
            (num >> 8) & 0xff,
            mapRange(num & 0xff, 0, 255, 0, 1),
        ], 'rgb');
    }
    /**
     * @hidden
     */
    function colorFromRgbNumber(value) {
        if (typeof value !== 'number') {
            return Color.black();
        }
        return numberToRgbColor(value);
    }
    /**
     * @hidden
     */
    function colorFromRgbaNumber(value) {
        if (typeof value !== 'number') {
            return Color.black();
        }
        return numberToRgbaColor(value);
    }

    function createColorStringWriter(notation) {
        var stringify = getColorStringifier(notation);
        return function (target, value) {
            writePrimitive(target, stringify(value));
        };
    }
    function createColorNumberWriter(supportsAlpha) {
        var colorToNumber = supportsAlpha ? colorToRgbaNumber : colorToRgbNumber;
        return function (target, value) {
            writePrimitive(target, colorToNumber(value));
        };
    }
    function writeRgbaColorObject(target, value) {
        var obj = value.toRgbaObject();
        target.writeProperty('r', obj.r);
        target.writeProperty('g', obj.g);
        target.writeProperty('b', obj.b);
        target.writeProperty('a', obj.a);
    }
    function writeRgbColorObject(target, value) {
        var obj = value.toRgbaObject();
        target.writeProperty('r', obj.r);
        target.writeProperty('g', obj.g);
        target.writeProperty('b', obj.b);
    }
    function createColorObjectWriter(supportsAlpha) {
        return supportsAlpha ? writeRgbaColorObject : writeRgbColorObject;
    }

    function shouldSupportAlpha$1(inputParams) {
        return 'input' in inputParams && inputParams.input === 'color.rgba';
    }
    /**
     * @hidden
     */
    var NumberColorInputPlugin = {
        id: 'input-color-number',
        accept: function (value, params) {
            if (typeof value !== 'number') {
                return null;
            }
            if (!('input' in params)) {
                return null;
            }
            if (params.input !== 'color' &&
                params.input !== 'color.rgb' &&
                params.input !== 'color.rgba') {
                return null;
            }
            return value;
        },
        binding: {
            reader: function (args) {
                return shouldSupportAlpha$1(args.params)
                    ? colorFromRgbaNumber
                    : colorFromRgbNumber;
            },
            equals: Color.equals,
            writer: function (args) {
                return createColorNumberWriter(shouldSupportAlpha$1(args.params));
            },
        },
        controller: function (args) {
            var supportsAlpha = shouldSupportAlpha$1(args.params);
            var formatter = supportsAlpha
                ? colorToHexRgbaString
                : colorToHexRgbString;
            return new ColorSwatchTextController(args.document, {
                formatter: formatter,
                parser: CompositeColorParser,
                supportsAlpha: supportsAlpha,
                value: args.value,
            });
        },
    };

    function shouldSupportAlpha(initialValue) {
        return Color.isRgbaColorObject(initialValue);
    }
    /**
     * @hidden
     */
    var ObjectColorInputPlugin = {
        id: 'input-color-object',
        accept: function (value, _params) { return (Color.isColorObject(value) ? value : null); },
        binding: {
            reader: function (_args) { return colorFromObject; },
            equals: Color.equals,
            writer: function (args) {
                return createColorObjectWriter(shouldSupportAlpha(args.initialValue));
            },
        },
        controller: function (args) {
            var supportsAlpha = Color.isRgbaColorObject(args.initialValue);
            var formatter = supportsAlpha
                ? colorToHexRgbaString
                : colorToHexRgbString;
            return new ColorSwatchTextController(args.document, {
                formatter: formatter,
                parser: CompositeColorParser,
                supportsAlpha: supportsAlpha,
                value: args.value,
            });
        },
    };

    /**
     * @hidden
     */
    var StringColorInputPlugin = {
        id: 'input-color-string',
        accept: function (value, params) {
            if (typeof value !== 'string') {
                return null;
            }
            if ('input' in params && params.input === 'string') {
                return null;
            }
            var notation = getColorNotation(value);
            if (!notation) {
                return null;
            }
            return value;
        },
        binding: {
            reader: function (_args) { return colorFromString; },
            equals: Color.equals,
            writer: function (args) {
                var notation = getColorNotation(args.initialValue);
                if (!notation) {
                    throw TpError.shouldNeverHappen();
                }
                return createColorStringWriter(notation);
            },
        },
        controller: function (args) {
            var notation = getColorNotation(args.initialValue);
            if (!notation) {
                throw TpError.shouldNeverHappen();
            }
            var stringifier = getColorStringifier(notation);
            return new ColorSwatchTextController(args.document, {
                formatter: stringifier,
                parser: CompositeColorParser,
                supportsAlpha: hasAlphaComponent(notation),
                value: args.value,
            });
        },
    };

    var className$7 = ClassName('sldtxt');
    /**
     * @hidden
     */
    var SliderTextView = /** @class */ (function () {
        function SliderTextView(doc, config) {
            this.element = doc.createElement('div');
            this.element.classList.add(className$7());
            var sliderElem = doc.createElement('div');
            sliderElem.classList.add(className$7('s'));
            this.sliderView_ = config.sliderView;
            sliderElem.appendChild(this.sliderView_.element);
            this.element.appendChild(sliderElem);
            var textElem = doc.createElement('div');
            textElem.classList.add(className$7('t'));
            this.textView_ = config.textView;
            textElem.appendChild(this.textView_.element);
            this.element.appendChild(textElem);
        }
        Object.defineProperty(SliderTextView.prototype, "value", {
            get: function () {
                return this.sliderView_.value;
            },
            enumerable: false,
            configurable: true
        });
        SliderTextView.prototype.update = function () {
            this.sliderView_.update();
            this.textView_.update();
        };
        return SliderTextView;
    }());

    var className$6 = ClassName('sld');
    /**
     * @hidden
     */
    var SliderView = /** @class */ (function () {
        function SliderView(doc, config) {
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.minValue_ = config.minValue;
            this.maxValue_ = config.maxValue;
            this.element = doc.createElement('div');
            this.element.classList.add(className$6());
            var trackElem = doc.createElement('div');
            trackElem.classList.add(className$6('t'));
            trackElem.tabIndex = 0;
            this.element.appendChild(trackElem);
            this.trackElement = trackElem;
            var knobElem = doc.createElement('div');
            knobElem.classList.add(className$6('k'));
            this.trackElement.appendChild(knobElem);
            this.knobElement = knobElem;
            config.value.emitter.on('change', this.onValueChange_);
            this.value = config.value;
            this.update();
        }
        SliderView.prototype.update = function () {
            var p = constrainRange(mapRange(this.value.rawValue, this.minValue_, this.maxValue_, 0, 100), 0, 100);
            this.knobElement.style.width = p + "%";
        };
        SliderView.prototype.onValueChange_ = function () {
            this.update();
        };
        return SliderView;
    }());

    function findRange(value) {
        var c = value.constraint
            ? findConstraint(value.constraint, RangeConstraint)
            : null;
        if (!c) {
            return [undefined, undefined];
        }
        return [c.minValue, c.maxValue];
    }
    function estimateSuitableRange(value) {
        var _a = findRange(value), min = _a[0], max = _a[1];
        return [min !== null && min !== void 0 ? min : 0, max !== null && max !== void 0 ? max : 100];
    }
    /**
     * @hidden
     */
    var SliderController = /** @class */ (function () {
        function SliderController(doc, config) {
            this.onKeyDown_ = this.onKeyDown_.bind(this);
            this.onPointerDown_ = this.onPointerDown_.bind(this);
            this.onPointerMove_ = this.onPointerMove_.bind(this);
            this.onPointerUp_ = this.onPointerUp_.bind(this);
            this.value = config.value;
            this.baseStep_ = config.baseStep;
            var _a = estimateSuitableRange(this.value), min = _a[0], max = _a[1];
            this.minValue_ = min;
            this.maxValue_ = max;
            this.view = new SliderView(doc, {
                maxValue: this.maxValue_,
                minValue: this.minValue_,
                value: this.value,
            });
            this.ptHandler_ = new PointerHandler(this.view.trackElement);
            this.ptHandler_.emitter.on('down', this.onPointerDown_);
            this.ptHandler_.emitter.on('move', this.onPointerMove_);
            this.ptHandler_.emitter.on('up', this.onPointerUp_);
            this.view.trackElement.addEventListener('keydown', this.onKeyDown_);
        }
        SliderController.prototype.handlePointerEvent_ = function (d) {
            if (!d.point) {
                return;
            }
            this.value.rawValue = mapRange(d.point.x, 0, d.bounds.width, this.minValue_, this.maxValue_);
        };
        SliderController.prototype.onPointerDown_ = function (ev) {
            this.handlePointerEvent_(ev.data);
        };
        SliderController.prototype.onPointerMove_ = function (ev) {
            this.handlePointerEvent_(ev.data);
        };
        SliderController.prototype.onPointerUp_ = function (ev) {
            this.handlePointerEvent_(ev.data);
        };
        SliderController.prototype.onKeyDown_ = function (ev) {
            this.value.rawValue += getStepForKey(this.baseStep_, getHorizontalStepKeys(ev));
        };
        return SliderController;
    }());

    /**
     * @hidden
     */
    var SliderTextController = /** @class */ (function () {
        function SliderTextController(doc, config) {
            this.value = config.value;
            this.sliderIc_ = new SliderController(doc, {
                baseStep: config.baseStep,
                value: config.value,
            });
            this.textIc_ = new NumberTextController(doc, {
                baseStep: config.baseStep,
                draggingScale: config.draggingScale,
                formatter: config.formatter,
                parser: config.parser,
                value: config.value,
            });
            this.view = new SliderTextView(doc, {
                sliderView: this.sliderIc_.view,
                textView: this.textIc_.view,
            });
        }
        return SliderTextController;
    }());

    /**
     * Tries to create a step constraint.
     * @param params The input parameters object.
     * @return A constraint or null if not found.
     */
    function createStepConstraint(params) {
        if ('step' in params && !isEmpty(params.step)) {
            return new StepConstraint(params.step);
        }
        return null;
    }
    /**
     * Tries to create a range constraint.
     * @param params The input parameters object.
     * @return A constraint or null if not found.
     */
    function createRangeConstraint(params) {
        if (('max' in params && !isEmpty(params.max)) ||
            ('min' in params && !isEmpty(params.min))) {
            return new RangeConstraint({
                max: params.max,
                min: params.min,
            });
        }
        return null;
    }
    function createConstraint$4(params) {
        var constraints = [];
        var sc = createStepConstraint(params);
        if (sc) {
            constraints.push(sc);
        }
        var rc = createRangeConstraint(params);
        if (rc) {
            constraints.push(rc);
        }
        var lc = createListConstraint(params, numberFromUnknown);
        if (lc) {
            constraints.push(lc);
        }
        return new CompositeConstraint(constraints);
    }
    function createController$4(doc, value) {
        var _a;
        var c = value.constraint;
        if (c && findConstraint(c, ListConstraint)) {
            return new ListController(doc, {
                listItems: (_a = findListItems(c)) !== null && _a !== void 0 ? _a : [],
                stringifyValue: numberToString,
                value: value,
            });
        }
        if (c && findConstraint(c, RangeConstraint)) {
            return new SliderTextController(doc, {
                baseStep: getBaseStep(c),
                draggingScale: getSuitableDraggingScale(value.constraint, value.rawValue),
                formatter: createNumberFormatter(getSuitableDecimalDigits(value.constraint, value.rawValue)),
                parser: parseNumber,
                value: value,
            });
        }
        return new NumberTextController(doc, {
            baseStep: getBaseStep(c),
            draggingScale: getSuitableDraggingScale(value.constraint, value.rawValue),
            formatter: createNumberFormatter(getSuitableDecimalDigits(value.constraint, value.rawValue)),
            parser: parseNumber,
            value: value,
        });
    }
    /**
     * @hidden
     */
    var NumberInputPlugin = {
        id: 'input-number',
        accept: function (value) { return (typeof value === 'number' ? value : null); },
        binding: {
            reader: function (_args) { return numberFromUnknown; },
            constraint: function (args) { return createConstraint$4(args.params); },
            equals: equalsPrimitive,
            writer: function (_args) { return writePrimitive; },
        },
        controller: function (args) {
            return createController$4(args.document, args.value);
        },
    };

    /**
     * @hidden
     */
    var PointNdConstraint = /** @class */ (function () {
        function PointNdConstraint(config) {
            this.components = config.components;
            this.asm_ = config.assembly;
        }
        PointNdConstraint.prototype.constrain = function (value) {
            var _this = this;
            var comps = this.asm_
                .toComponents(value)
                .map(function (comp, index) { var _a, _b; return (_b = (_a = _this.components[index]) === null || _a === void 0 ? void 0 : _a.constrain(comp)) !== null && _b !== void 0 ? _b : comp; });
            return this.asm_.fromComponents(comps);
        };
        return PointNdConstraint;
    }());

    var className$5 = ClassName('p2dtxt');
    /**
     * @hidden
     */
    var PointNdTextView = /** @class */ (function () {
        function PointNdTextView(doc, config) {
            var _this = this;
            this.textViews = config.textViews;
            this.element = doc.createElement('div');
            this.element.classList.add(className$5());
            this.textViews.forEach(function (v) {
                var axisElem = doc.createElement('div');
                axisElem.classList.add(className$5('a'));
                axisElem.appendChild(v.element);
                _this.element.appendChild(axisElem);
            });
            this.value = config.value;
        }
        PointNdTextView.prototype.update = function () {
            // Each text view will be connected by ValueSync, so nothing to do here
        };
        return PointNdTextView;
    }());

    function findAxisConstraint(config, index) {
        var pc = config.value.constraint;
        if (!(pc instanceof PointNdConstraint)) {
            return undefined;
        }
        return pc.components[index];
    }
    function createAxisController(doc, config, index) {
        return new NumberTextController(doc, {
            arrayPosition: index === 0 ? 'fst' : index === config.axes.length - 1 ? 'lst' : 'mid',
            baseStep: config.axes[index].baseStep,
            formatter: config.axes[index].formatter,
            draggingScale: config.axes[index].draggingScale,
            parser: config.parser,
            value: new Value(0, {
                constraint: findAxisConstraint(config, index),
            }),
        });
    }
    /**
     * @hidden
     */
    var PointNdTextController = /** @class */ (function () {
        function PointNdTextController(doc, config) {
            var _this = this;
            this.value = config.value;
            this.acs_ = config.axes.map(function (_, index) {
                return createAxisController(doc, config, index);
            });
            this.acs_.forEach(function (c, index) {
                connectValues({
                    primary: _this.value,
                    secondary: c.value,
                    forward: function (p) {
                        return config.assembly.toComponents(p.rawValue)[index];
                    },
                    backward: function (p, s) {
                        var comps = config.assembly.toComponents(p.rawValue);
                        comps[index] = s.rawValue;
                        return config.assembly.fromComponents(comps);
                    },
                });
            });
            this.view = new PointNdTextView(doc, {
                textViews: this.acs_.map(function (ac) { return ac.view; }),
                value: this.value,
            });
        }
        return PointNdTextController;
    }());

    var Point2d = /** @class */ (function () {
        function Point2d(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Point2d.prototype.getComponents = function () {
            return [this.x, this.y];
        };
        Point2d.isObject = function (obj) {
            if (isEmpty(obj)) {
                return false;
            }
            var x = obj.x;
            var y = obj.y;
            if (typeof x !== 'number' || typeof y !== 'number') {
                return false;
            }
            return true;
        };
        Point2d.equals = function (v1, v2) {
            return v1.x === v2.x && v1.y === v2.y;
        };
        Point2d.prototype.toObject = function () {
            return {
                x: this.x,
                y: this.y,
            };
        };
        return Point2d;
    }());
    var Point2dAssembly = {
        toComponents: function (p) { return p.getComponents(); },
        fromComponents: function (comps) { return new (Point2d.bind.apply(Point2d, __spreadArrays([void 0], comps)))(); },
    };

    var className$4 = ClassName('p2dpadtxt');
    /**
     * @hidden
     */
    var Point2dPadTextView = /** @class */ (function () {
        function Point2dPadTextView(doc, config) {
            this.element = doc.createElement('div');
            this.element.classList.add(className$4());
            var padWrapperElem = doc.createElement('div');
            padWrapperElem.classList.add(className$4('w'));
            this.element.appendChild(padWrapperElem);
            var buttonElem = doc.createElement('button');
            buttonElem.classList.add(className$4('b'));
            buttonElem.appendChild(createSvgIconElement(doc, 'p2dpad'));
            padWrapperElem.appendChild(buttonElem);
            this.padButtonElem_ = buttonElem;
            var padElem = doc.createElement('div');
            padElem.classList.add(className$4('p'));
            padWrapperElem.appendChild(padElem);
            this.padView_ = config.padView;
            padElem.appendChild(this.padView_.element);
            var textElem = doc.createElement('div');
            textElem.classList.add(className$4('t'));
            this.textView_ = config.textView;
            textElem.appendChild(this.textView_.element);
            this.element.appendChild(textElem);
        }
        Object.defineProperty(Point2dPadTextView.prototype, "value", {
            get: function () {
                return this.textView_.value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Point2dPadTextView.prototype, "padButtonElement", {
            get: function () {
                return this.padButtonElem_;
            },
            enumerable: false,
            configurable: true
        });
        Point2dPadTextView.prototype.update = function () {
            this.padView_.update();
            this.textView_.update();
        };
        return Point2dPadTextView;
    }());

    var className$3 = ClassName('p2dpad');
    /**
     * @hidden
     */
    var Point2dPadView = /** @class */ (function () {
        function Point2dPadView(doc, config) {
            this.onFoldableChange_ = this.onFoldableChange_.bind(this);
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.foldable = config.foldable;
            this.foldable.emitter.on('change', this.onFoldableChange_);
            this.invertsY_ = config.invertsY;
            this.maxValue_ = config.maxValue;
            this.element = doc.createElement('div');
            this.element.classList.add(className$3());
            var padElem = doc.createElement('div');
            padElem.tabIndex = 0;
            padElem.classList.add(className$3('p'));
            this.element.appendChild(padElem);
            this.padElement = padElem;
            var svgElem = doc.createElementNS(SVG_NS, 'svg');
            svgElem.classList.add(className$3('g'));
            this.padElement.appendChild(svgElem);
            this.svgElem_ = svgElem;
            var xAxisElem = doc.createElementNS(SVG_NS, 'line');
            xAxisElem.classList.add(className$3('ax'));
            xAxisElem.setAttributeNS(null, 'x1', '0');
            xAxisElem.setAttributeNS(null, 'y1', '50%');
            xAxisElem.setAttributeNS(null, 'x2', '100%');
            xAxisElem.setAttributeNS(null, 'y2', '50%');
            this.svgElem_.appendChild(xAxisElem);
            var yAxisElem = doc.createElementNS(SVG_NS, 'line');
            yAxisElem.classList.add(className$3('ax'));
            yAxisElem.setAttributeNS(null, 'x1', '50%');
            yAxisElem.setAttributeNS(null, 'y1', '0');
            yAxisElem.setAttributeNS(null, 'x2', '50%');
            yAxisElem.setAttributeNS(null, 'y2', '100%');
            this.svgElem_.appendChild(yAxisElem);
            var lineElem = doc.createElementNS(SVG_NS, 'line');
            lineElem.classList.add(className$3('l'));
            lineElem.setAttributeNS(null, 'x1', '50%');
            lineElem.setAttributeNS(null, 'y1', '50%');
            this.svgElem_.appendChild(lineElem);
            this.lineElem_ = lineElem;
            var markerElem = doc.createElementNS(SVG_NS, 'circle');
            markerElem.classList.add(className$3('m'));
            markerElem.setAttributeNS(null, 'r', '2px');
            this.svgElem_.appendChild(markerElem);
            this.markerElem_ = markerElem;
            config.value.emitter.on('change', this.onValueChange_);
            this.value = config.value;
            this.update();
        }
        Object.defineProperty(Point2dPadView.prototype, "allFocusableElements", {
            get: function () {
                return [this.padElement];
            },
            enumerable: false,
            configurable: true
        });
        Point2dPadView.prototype.update = function () {
            if (this.foldable.expanded) {
                this.element.classList.add(className$3(undefined, 'expanded'));
            }
            else {
                this.element.classList.remove(className$3(undefined, 'expanded'));
            }
            var _a = this.value.rawValue.getComponents(), x = _a[0], y = _a[1];
            var max = this.maxValue_;
            var px = mapRange(x, -max, +max, 0, 100);
            var py = mapRange(y, -max, +max, 0, 100);
            var ipy = this.invertsY_ ? 100 - py : py;
            this.lineElem_.setAttributeNS(null, 'x2', px + "%");
            this.lineElem_.setAttributeNS(null, 'y2', ipy + "%");
            this.markerElem_.setAttributeNS(null, 'cx', px + "%");
            this.markerElem_.setAttributeNS(null, 'cy', ipy + "%");
        };
        Point2dPadView.prototype.onValueChange_ = function () {
            this.update();
        };
        Point2dPadView.prototype.onFoldableChange_ = function () {
            this.update();
        };
        return Point2dPadView;
    }());

    /**
     * @hidden
     */
    var Point2dPadController = /** @class */ (function () {
        function Point2dPadController(doc, config) {
            var _this = this;
            this.triggerElement = null;
            this.onFocusableElementBlur_ = this.onFocusableElementBlur_.bind(this);
            this.onKeyDown_ = this.onKeyDown_.bind(this);
            this.onPadKeyDown_ = this.onPadKeyDown_.bind(this);
            this.onPointerDown_ = this.onPointerDown_.bind(this);
            this.onPointerMove_ = this.onPointerMove_.bind(this);
            this.onPointerUp_ = this.onPointerUp_.bind(this);
            this.value = config.value;
            this.foldable = new Foldable();
            this.baseSteps_ = config.baseSteps;
            this.maxValue_ = config.maxValue;
            this.invertsY_ = config.invertsY;
            this.view = new Point2dPadView(doc, {
                foldable: this.foldable,
                invertsY: this.invertsY_,
                maxValue: this.maxValue_,
                value: this.value,
            });
            this.ptHandler_ = new PointerHandler(this.view.padElement);
            this.ptHandler_.emitter.on('down', this.onPointerDown_);
            this.ptHandler_.emitter.on('move', this.onPointerMove_);
            this.ptHandler_.emitter.on('up', this.onPointerUp_);
            this.view.padElement.addEventListener('keydown', this.onPadKeyDown_);
            this.view.element.addEventListener('keydown', this.onKeyDown_);
            this.view.allFocusableElements.forEach(function (elem) {
                elem.addEventListener('blur', _this.onFocusableElementBlur_);
            });
        }
        Point2dPadController.prototype.handlePointerEvent_ = function (d) {
            if (!d.point) {
                return;
            }
            var max = this.maxValue_;
            var px = mapRange(d.point.x, 0, d.bounds.width, -max, +max);
            var py = mapRange(this.invertsY_ ? d.bounds.height - d.point.y : d.point.y, 0, d.bounds.height, -max, +max);
            this.value.rawValue = new Point2d(px, py);
            this.view.update();
        };
        Point2dPadController.prototype.onPointerDown_ = function (ev) {
            this.handlePointerEvent_(ev.data);
        };
        Point2dPadController.prototype.onPointerMove_ = function (ev) {
            this.handlePointerEvent_(ev.data);
        };
        Point2dPadController.prototype.onPointerUp_ = function (ev) {
            this.handlePointerEvent_(ev.data);
        };
        Point2dPadController.prototype.onPadKeyDown_ = function (ev) {
            if (isArrowKey(ev.keyCode)) {
                ev.preventDefault();
            }
            this.value.rawValue = new Point2d(this.value.rawValue.x +
                getStepForKey(this.baseSteps_[0], getHorizontalStepKeys(ev)), this.value.rawValue.y +
                getStepForKey(this.baseSteps_[1], getVerticalStepKeys(ev)) *
                    (this.invertsY_ ? 1 : -1));
        };
        Point2dPadController.prototype.onFocusableElementBlur_ = function (ev) {
            var elem = this.view.element;
            var nextTarget = findNextTarget(ev);
            if (nextTarget && elem.contains(nextTarget)) {
                // Next target is in the picker
                return;
            }
            if (nextTarget &&
                nextTarget === this.triggerElement &&
                !supportsTouch(elem.ownerDocument)) {
                // Next target is the trigger button
                return;
            }
            this.foldable.expanded = false;
        };
        Point2dPadController.prototype.onKeyDown_ = function (ev) {
            if (ev.keyCode === 27) {
                this.foldable.expanded = false;
            }
        };
        return Point2dPadController;
    }());

    /**
     * @hidden
     */
    var Point2dPadTextController = /** @class */ (function () {
        function Point2dPadTextController(doc, config) {
            this.onPadButtonBlur_ = this.onPadButtonBlur_.bind(this);
            this.onPadButtonClick_ = this.onPadButtonClick_.bind(this);
            this.value = config.value;
            this.padIc_ = new Point2dPadController(doc, {
                baseSteps: [config.axes[0].baseStep, config.axes[1].baseStep],
                invertsY: config.invertsY,
                maxValue: config.maxValue,
                value: this.value,
            });
            this.textIc_ = new PointNdTextController(doc, {
                assembly: Point2dAssembly,
                axes: config.axes,
                parser: config.parser,
                value: this.value,
            });
            this.view = new Point2dPadTextView(doc, {
                padView: this.padIc_.view,
                textView: this.textIc_.view,
            });
            this.view.padButtonElement.addEventListener('blur', this.onPadButtonBlur_);
            this.view.padButtonElement.addEventListener('click', this.onPadButtonClick_);
            this.padIc_.triggerElement = this.view.padButtonElement;
        }
        Point2dPadTextController.prototype.onPadButtonBlur_ = function (e) {
            var elem = this.view.element;
            var nextTarget = forceCast(e.relatedTarget);
            if (!nextTarget || !elem.contains(nextTarget)) {
                this.padIc_.foldable.expanded = false;
            }
        };
        Point2dPadTextController.prototype.onPadButtonClick_ = function () {
            this.padIc_.foldable.expanded = !this.padIc_.foldable.expanded;
            if (this.padIc_.foldable.expanded) {
                this.padIc_.view.allFocusableElements[0].focus();
            }
        };
        return Point2dPadTextController;
    }());

    function point2dFromUnknown(value) {
        return Point2d.isObject(value)
            ? new Point2d(value.x, value.y)
            : new Point2d();
    }
    function writePoint2d(target, value) {
        target.writeProperty('x', value.x);
        target.writeProperty('y', value.y);
    }

    function createDimensionConstraint$2(params) {
        if (!params) {
            return undefined;
        }
        var constraints = [];
        if (!isEmpty(params.step)) {
            constraints.push(new StepConstraint(params.step));
        }
        if (!isEmpty(params.max) || !isEmpty(params.min)) {
            constraints.push(new RangeConstraint({
                max: params.max,
                min: params.min,
            }));
        }
        return new CompositeConstraint(constraints);
    }
    function createConstraint$3(params) {
        return new PointNdConstraint({
            assembly: Point2dAssembly,
            components: [
                createDimensionConstraint$2('x' in params ? params.x : undefined),
                createDimensionConstraint$2('y' in params ? params.y : undefined),
            ],
        });
    }
    function getSuitableMaxDimensionValue(constraint, rawValue) {
        var rc = constraint && findConstraint(constraint, RangeConstraint);
        if (rc) {
            return Math.max(Math.abs(rc.minValue || 0), Math.abs(rc.maxValue || 0));
        }
        var step = getBaseStep(constraint);
        return Math.max(Math.abs(step) * 10, Math.abs(rawValue) * 10);
    }
    /**
     * @hidden
     */
    function getSuitableMaxValue(initialValue, constraint) {
        var xc = constraint instanceof PointNdConstraint
            ? constraint.components[0]
            : undefined;
        var yc = constraint instanceof PointNdConstraint
            ? constraint.components[1]
            : undefined;
        var xr = getSuitableMaxDimensionValue(xc, initialValue.x);
        var yr = getSuitableMaxDimensionValue(yc, initialValue.y);
        return Math.max(xr, yr);
    }
    function createAxis$2(initialValue, constraint) {
        return {
            baseStep: getBaseStep(constraint),
            draggingScale: getSuitableDraggingScale(constraint, initialValue),
            formatter: createNumberFormatter(getSuitableDecimalDigits(constraint, initialValue)),
        };
    }
    function createController$3(document, value, invertsY) {
        var c = value.constraint;
        if (!(c instanceof PointNdConstraint)) {
            throw TpError.shouldNeverHappen();
        }
        return new Point2dPadTextController(document, {
            axes: [
                createAxis$2(value.rawValue.x, c.components[0]),
                createAxis$2(value.rawValue.y, c.components[1]),
            ],
            invertsY: invertsY,
            maxValue: getSuitableMaxValue(value.rawValue, value.constraint),
            parser: parseNumber,
            value: value,
        });
    }
    function shouldInvertY(params) {
        if (!('y' in params)) {
            return false;
        }
        var yParams = params.y;
        if (!yParams) {
            return false;
        }
        return 'inverted' in yParams ? !!yParams.inverted : false;
    }
    /**
     * @hidden
     */
    var Point2dInputPlugin = {
        id: 'input-point2d',
        accept: function (value, _params) { return (Point2d.isObject(value) ? value : null); },
        binding: {
            reader: function (_args) { return point2dFromUnknown; },
            constraint: function (args) { return createConstraint$3(args.params); },
            equals: Point2d.equals,
            writer: function (_args) { return writePoint2d; },
        },
        controller: function (args) {
            return createController$3(args.document, args.value, shouldInvertY(args.params));
        },
    };

    var Point3d = /** @class */ (function () {
        function Point3d(x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            this.x = x;
            this.y = y;
            this.z = z;
        }
        Point3d.prototype.getComponents = function () {
            return [this.x, this.y, this.z];
        };
        Point3d.isObject = function (obj) {
            if (isEmpty(obj)) {
                return false;
            }
            var x = obj.x;
            var y = obj.y;
            var z = obj.z;
            if (typeof x !== 'number' ||
                typeof y !== 'number' ||
                typeof z !== 'number') {
                return false;
            }
            return true;
        };
        Point3d.equals = function (v1, v2) {
            return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
        };
        Point3d.prototype.toObject = function () {
            return {
                x: this.x,
                y: this.y,
                z: this.z,
            };
        };
        return Point3d;
    }());
    var Point3dAssembly = {
        toComponents: function (p) { return p.getComponents(); },
        fromComponents: function (comps) { return new (Point3d.bind.apply(Point3d, __spreadArrays([void 0], comps)))(); },
    };

    /**
     * @hidden
     */
    function point3dFromUnknown(value) {
        return Point3d.isObject(value)
            ? new Point3d(value.x, value.y, value.z)
            : new Point3d();
    }
    function writePoint3d(target, value) {
        target.writeProperty('x', value.x);
        target.writeProperty('y', value.y);
        target.writeProperty('z', value.z);
    }

    function createDimensionConstraint$1(params) {
        if (!params) {
            return undefined;
        }
        var constraints = [];
        if (!isEmpty(params.step)) {
            constraints.push(new StepConstraint(params.step));
        }
        if (!isEmpty(params.max) || !isEmpty(params.min)) {
            constraints.push(new RangeConstraint({
                max: params.max,
                min: params.min,
            }));
        }
        return new CompositeConstraint(constraints);
    }
    function createConstraint$2(params) {
        return new PointNdConstraint({
            assembly: Point3dAssembly,
            components: [
                createDimensionConstraint$1('x' in params ? params.x : undefined),
                createDimensionConstraint$1('y' in params ? params.y : undefined),
                createDimensionConstraint$1('z' in params ? params.z : undefined),
            ],
        });
    }
    function createAxis$1(initialValue, constraint) {
        return {
            baseStep: getBaseStep(constraint),
            draggingScale: getSuitableDraggingScale(constraint, initialValue),
            formatter: createNumberFormatter(getSuitableDecimalDigits(constraint, initialValue)),
        };
    }
    function createController$2(document, value) {
        var c = value.constraint;
        if (!(c instanceof PointNdConstraint)) {
            throw TpError.shouldNeverHappen();
        }
        return new PointNdTextController(document, {
            assembly: Point3dAssembly,
            axes: [
                createAxis$1(value.rawValue.x, c.components[0]),
                createAxis$1(value.rawValue.y, c.components[1]),
                createAxis$1(value.rawValue.z, c.components[2]),
            ],
            parser: parseNumber,
            value: value,
        });
    }
    /**
     * @hidden
     */
    var Point3dInputPlugin = {
        id: 'input-point3d',
        accept: function (value, _params) { return (Point3d.isObject(value) ? value : null); },
        binding: {
            reader: function (_args) { return point3dFromUnknown; },
            constraint: function (args) { return createConstraint$2(args.params); },
            equals: Point3d.equals,
            writer: function (_args) { return writePoint3d; },
        },
        controller: function (args) {
            return createController$2(args.document, args.value);
        },
    };

    var Point4d = /** @class */ (function () {
        function Point4d(x, y, z, w) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            if (w === void 0) { w = 0; }
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        Point4d.prototype.getComponents = function () {
            return [this.x, this.y, this.z, this.w];
        };
        Point4d.isObject = function (obj) {
            if (isEmpty(obj)) {
                return false;
            }
            var x = obj.x;
            var y = obj.y;
            var z = obj.z;
            var w = obj.w;
            if (typeof x !== 'number' ||
                typeof y !== 'number' ||
                typeof z !== 'number' ||
                typeof w !== 'number') {
                return false;
            }
            return true;
        };
        Point4d.equals = function (v1, v2) {
            return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z && v1.w === v2.w;
        };
        Point4d.prototype.toObject = function () {
            return {
                x: this.x,
                y: this.y,
                z: this.z,
                w: this.w,
            };
        };
        return Point4d;
    }());
    var Point4dAssembly = {
        toComponents: function (p) { return p.getComponents(); },
        fromComponents: function (comps) { return new (Point4d.bind.apply(Point4d, __spreadArrays([void 0], comps)))(); },
    };

    /**
     * @hidden
     */
    function point4dFromUnknown(value) {
        return Point4d.isObject(value)
            ? new Point4d(value.x, value.y, value.z, value.w)
            : new Point4d();
    }
    function writePoint4d(target, value) {
        target.writeProperty('x', value.x);
        target.writeProperty('y', value.y);
        target.writeProperty('z', value.z);
        target.writeProperty('w', value.w);
    }

    function createDimensionConstraint(params) {
        if (!params) {
            return undefined;
        }
        var constraints = [];
        if (!isEmpty(params.step)) {
            constraints.push(new StepConstraint(params.step));
        }
        if (!isEmpty(params.max) || !isEmpty(params.min)) {
            constraints.push(new RangeConstraint({
                max: params.max,
                min: params.min,
            }));
        }
        return new CompositeConstraint(constraints);
    }
    function createConstraint$1(params) {
        return new PointNdConstraint({
            assembly: Point4dAssembly,
            components: [
                createDimensionConstraint('x' in params ? params.x : undefined),
                createDimensionConstraint('y' in params ? params.y : undefined),
                createDimensionConstraint('z' in params ? params.z : undefined),
                createDimensionConstraint('w' in params ? params.w : undefined),
            ],
        });
    }
    function createAxis(initialValue, constraint) {
        return {
            baseStep: getBaseStep(constraint),
            draggingScale: getSuitableDraggingScale(constraint, initialValue),
            formatter: createNumberFormatter(getSuitableDecimalDigits(constraint, initialValue)),
        };
    }
    function createController$1(document, value) {
        var c = value.constraint;
        if (!(c instanceof PointNdConstraint)) {
            throw TpError.shouldNeverHappen();
        }
        return new PointNdTextController(document, {
            assembly: Point4dAssembly,
            axes: value.rawValue
                .getComponents()
                .map(function (comp, index) { return createAxis(comp, c.components[index]); }),
            parser: parseNumber,
            value: value,
        });
    }
    /**
     * @hidden
     */
    var Point4dInputPlugin = {
        id: 'input-point4d',
        accept: function (value, _params) { return (Point4d.isObject(value) ? value : null); },
        binding: {
            reader: function (_args) { return point4dFromUnknown; },
            constraint: function (args) { return createConstraint$1(args.params); },
            equals: Point4d.equals,
            writer: function (_args) { return writePoint4d; },
        },
        controller: function (args) {
            return createController$1(args.document, args.value);
        },
    };

    /**
     * @hidden
     */
    function stringFromUnknown(value) {
        return String(value);
    }
    /**
     * @hidden
     */
    function formatString(value) {
        return value;
    }

    function createConstraint(params) {
        var constraints = [];
        var lc = createListConstraint(params, stringFromUnknown);
        if (lc) {
            constraints.push(lc);
        }
        return new CompositeConstraint(constraints);
    }
    function createController(doc, value) {
        var _a;
        var c = value.constraint;
        if (c && findConstraint(c, ListConstraint)) {
            return new ListController(doc, {
                listItems: (_a = findListItems(c)) !== null && _a !== void 0 ? _a : [],
                stringifyValue: function (v) { return v; },
                value: value,
            });
        }
        return new TextController(doc, {
            formatter: formatString,
            parser: function (v) { return v; },
            value: value,
        });
    }
    /**
     * @hidden
     */
    var StringInputPlugin = {
        id: 'input-string',
        accept: function (value, _params) { return (typeof value === 'string' ? value : null); },
        binding: {
            reader: function (_args) { return stringFromUnknown; },
            constraint: function (args) { return createConstraint(args.params); },
            equals: equalsPrimitive,
            writer: function (_args) { return writePrimitive; },
        },
        controller: function (params) {
            return createController(params.document, params.value);
        },
    };

    var className$2 = ClassName('mll');
    /**
     * @hidden
     */
    var MultiLogView = /** @class */ (function () {
        function MultiLogView(doc, config) {
            this.onValueUpdate_ = this.onValueUpdate_.bind(this);
            this.formatter_ = config.formatter;
            this.element = doc.createElement('div');
            this.element.classList.add(className$2());
            var textareaElem = doc.createElement('textarea');
            textareaElem.classList.add(className$2('i'));
            textareaElem.style.height = "calc(var(--unit-size) * " + config.lineCount + ")";
            textareaElem.readOnly = true;
            this.element.appendChild(textareaElem);
            this.textareaElem_ = textareaElem;
            config.value.emitter.on('change', this.onValueUpdate_);
            this.value = config.value;
            this.update();
        }
        MultiLogView.prototype.update = function () {
            var _this = this;
            var elem = this.textareaElem_;
            var shouldScroll = elem.scrollTop === elem.scrollHeight - elem.clientHeight;
            var lines = [];
            this.value.rawValue.forEach(function (value) {
                if (value !== undefined) {
                    lines.push(_this.formatter_(value));
                }
            });
            elem.textContent = lines.join('\n');
            if (shouldScroll) {
                elem.scrollTop = elem.scrollHeight;
            }
        };
        MultiLogView.prototype.onValueUpdate_ = function () {
            this.update();
        };
        return MultiLogView;
    }());

    /**
     * @hidden
     */
    var MultiLogController = /** @class */ (function () {
        function MultiLogController(doc, config) {
            this.value = config.value;
            this.view = new MultiLogView(doc, {
                formatter: config.formatter,
                lineCount: config.lineCount,
                value: this.value,
            });
        }
        return MultiLogController;
    }());

    var className$1 = ClassName('sgl');
    /**
     * @hidden
     */
    var SingleLogView = /** @class */ (function () {
        function SingleLogView(doc, config) {
            this.onValueUpdate_ = this.onValueUpdate_.bind(this);
            this.formatter_ = config.formatter;
            this.element = doc.createElement('div');
            this.element.classList.add(className$1());
            var inputElem = doc.createElement('input');
            inputElem.classList.add(className$1('i'));
            inputElem.readOnly = true;
            inputElem.type = 'text';
            this.element.appendChild(inputElem);
            this.inputElem_ = inputElem;
            config.value.emitter.on('change', this.onValueUpdate_);
            this.value = config.value;
            this.update();
        }
        SingleLogView.prototype.update = function () {
            var values = this.value.rawValue;
            var lastValue = values[values.length - 1];
            this.inputElem_.value =
                lastValue !== undefined ? this.formatter_(lastValue) : '';
        };
        SingleLogView.prototype.onValueUpdate_ = function () {
            this.update();
        };
        return SingleLogView;
    }());

    /**
     * @hidden
     */
    var SingleLogMonitorController = /** @class */ (function () {
        function SingleLogMonitorController(doc, config) {
            this.value = config.value;
            this.view = new SingleLogView(doc, {
                formatter: config.formatter,
                value: this.value,
            });
        }
        return SingleLogMonitorController;
    }());

    /**
     * @hidden
     */
    var BooleanMonitorPlugin = {
        id: 'monitor-bool',
        accept: function (value, _params) { return (typeof value === 'boolean' ? value : null); },
        binding: {
            reader: function (_args) { return boolFromUnknown; },
        },
        controller: function (args) {
            var _a;
            if (args.value.rawValue.length === 1) {
                return new SingleLogMonitorController(args.document, {
                    formatter: BooleanFormatter,
                    value: args.value,
                });
            }
            return new MultiLogController(args.document, {
                formatter: BooleanFormatter,
                lineCount: (_a = args.params.lineCount) !== null && _a !== void 0 ? _a : Constants.monitor.defaultLineCount,
                value: args.value,
            });
        },
    };

    /**
     * @hidden
     */
    var GraphCursor = /** @class */ (function () {
        function GraphCursor() {
            this.emitter = new Emitter();
            this.index_ = -1;
        }
        Object.defineProperty(GraphCursor.prototype, "index", {
            get: function () {
                return this.index_;
            },
            set: function (index) {
                var changed = this.index_ !== index;
                if (changed) {
                    this.index_ = index;
                    this.emitter.emit('change', {
                        index: index,
                        sender: this,
                    });
                }
            },
            enumerable: false,
            configurable: true
        });
        return GraphCursor;
    }());

    var className = ClassName('grl');
    /**
     * @hidden
     */
    var GraphLogView = /** @class */ (function () {
        function GraphLogView(doc, config) {
            this.onCursorChange_ = this.onCursorChange_.bind(this);
            this.onValueUpdate_ = this.onValueUpdate_.bind(this);
            this.element = doc.createElement('div');
            this.element.classList.add(className());
            this.formatter_ = config.formatter;
            this.minValue_ = config.minValue;
            this.maxValue_ = config.maxValue;
            this.cursor_ = config.cursor;
            this.cursor_.emitter.on('change', this.onCursorChange_);
            var svgElem = doc.createElementNS(SVG_NS, 'svg');
            svgElem.classList.add(className('g'));
            svgElem.style.height = "calc(var(--unit-size) * " + config.lineCount + ")";
            this.element.appendChild(svgElem);
            this.svgElem_ = svgElem;
            var lineElem = doc.createElementNS(SVG_NS, 'polyline');
            this.svgElem_.appendChild(lineElem);
            this.lineElem_ = lineElem;
            var tooltipElem = doc.createElement('div');
            tooltipElem.classList.add(className('t'), ClassName('tt')());
            this.element.appendChild(tooltipElem);
            this.tooltipElem_ = tooltipElem;
            config.value.emitter.on('change', this.onValueUpdate_);
            this.value = config.value;
            this.update();
        }
        Object.defineProperty(GraphLogView.prototype, "graphElement", {
            get: function () {
                return this.svgElem_;
            },
            enumerable: false,
            configurable: true
        });
        GraphLogView.prototype.update = function () {
            var bounds = this.svgElem_.getBoundingClientRect();
            // Graph
            var maxIndex = this.value.rawValue.length - 1;
            var min = this.minValue_;
            var max = this.maxValue_;
            var points = [];
            this.value.rawValue.forEach(function (v, index) {
                if (v === undefined) {
                    return;
                }
                var x = mapRange(index, 0, maxIndex, 0, bounds.width);
                var y = mapRange(v, min, max, bounds.height, 0);
                points.push([x, y].join(','));
            });
            this.lineElem_.setAttributeNS(null, 'points', points.join(' '));
            // Cursor
            var tooltipElem = this.tooltipElem_;
            var value = this.value.rawValue[this.cursor_.index];
            if (value === undefined) {
                tooltipElem.classList.remove(className('t', 'a'));
                return;
            }
            var tx = mapRange(this.cursor_.index, 0, maxIndex, 0, bounds.width);
            var ty = mapRange(value, min, max, bounds.height, 0);
            tooltipElem.style.left = tx + "px";
            tooltipElem.style.top = ty + "px";
            tooltipElem.textContent = "" + this.formatter_(value);
            if (!tooltipElem.classList.contains(className('t', 'a'))) {
                // Suppresses unwanted initial transition
                tooltipElem.classList.add(className('t', 'a'), className('t', 'in'));
                forceReflow(tooltipElem);
                tooltipElem.classList.remove(className('t', 'in'));
            }
        };
        GraphLogView.prototype.onValueUpdate_ = function () {
            this.update();
        };
        GraphLogView.prototype.onCursorChange_ = function () {
            this.update();
        };
        return GraphLogView;
    }());

    /**
     * @hidden
     */
    var GraphLogController = /** @class */ (function () {
        function GraphLogController(doc, config) {
            this.onGraphMouseMove_ = this.onGraphMouseMove_.bind(this);
            this.onGraphMouseLeave_ = this.onGraphMouseLeave_.bind(this);
            this.onGraphPointerDown_ = this.onGraphPointerDown_.bind(this);
            this.onGraphPointerMove_ = this.onGraphPointerMove_.bind(this);
            this.onGraphPointerUp_ = this.onGraphPointerUp_.bind(this);
            this.value = config.value;
            this.cursor_ = new GraphCursor();
            this.view = new GraphLogView(doc, {
                cursor: this.cursor_,
                formatter: config.formatter,
                lineCount: config.lineCount,
                maxValue: config.maxValue,
                minValue: config.minValue,
                value: this.value,
            });
            if (!supportsTouch(doc)) {
                this.view.element.addEventListener('mousemove', this.onGraphMouseMove_);
                this.view.element.addEventListener('mouseleave', this.onGraphMouseLeave_);
            }
            else {
                var ph = new PointerHandler(this.view.element);
                ph.emitter.on('down', this.onGraphPointerDown_);
                ph.emitter.on('move', this.onGraphPointerMove_);
                ph.emitter.on('up', this.onGraphPointerUp_);
            }
        }
        GraphLogController.prototype.onGraphMouseLeave_ = function () {
            this.cursor_.index = -1;
        };
        GraphLogController.prototype.onGraphMouseMove_ = function (ev) {
            var bounds = this.view.element.getBoundingClientRect();
            this.cursor_.index = Math.floor(mapRange(ev.offsetX, 0, bounds.width, 0, this.value.rawValue.length));
        };
        GraphLogController.prototype.onGraphPointerDown_ = function (ev) {
            this.onGraphPointerMove_(ev);
        };
        GraphLogController.prototype.onGraphPointerMove_ = function (ev) {
            if (!ev.data.point) {
                this.cursor_.index = -1;
                return;
            }
            this.cursor_.index = Math.floor(mapRange(ev.data.point.x, 0, ev.data.bounds.width, 0, this.value.rawValue.length));
        };
        GraphLogController.prototype.onGraphPointerUp_ = function () {
            this.cursor_.index = -1;
        };
        return GraphLogController;
    }());

    function createFormatter() {
        // TODO: formatter precision
        return createNumberFormatter(2);
    }
    function createTextMonitor(_a) {
        var _b;
        var document = _a.document, params = _a.params, value = _a.value;
        if (value.rawValue.length === 1) {
            return new SingleLogMonitorController(document, {
                formatter: createFormatter(),
                value: value,
            });
        }
        return new MultiLogController(document, {
            formatter: createFormatter(),
            lineCount: (_b = params.lineCount) !== null && _b !== void 0 ? _b : Constants.monitor.defaultLineCount,
            value: value,
        });
    }
    function createGraphMonitor(_a) {
        var _b, _c, _d;
        var document = _a.document, params = _a.params, value = _a.value;
        return new GraphLogController(document, {
            formatter: createFormatter(),
            lineCount: (_b = params.lineCount) !== null && _b !== void 0 ? _b : Constants.monitor.defaultLineCount,
            maxValue: (_c = ('max' in params ? params.max : null)) !== null && _c !== void 0 ? _c : 100,
            minValue: (_d = ('min' in params ? params.min : null)) !== null && _d !== void 0 ? _d : 0,
            value: value,
        });
    }
    function shouldShowGraph(params) {
        return 'view' in params && params.view === 'graph';
    }
    /**
     * @hidden
     */
    var NumberMonitorPlugin = {
        id: 'monitor-number',
        accept: function (value, _params) { return (typeof value === 'number' ? value : null); },
        binding: {
            defaultBufferSize: function (params) { return (shouldShowGraph(params) ? 64 : 1); },
            reader: function (_args) { return numberFromUnknown; },
        },
        controller: function (args) {
            if (shouldShowGraph(args.params)) {
                return createGraphMonitor(args);
            }
            return createTextMonitor(args);
        },
    };

    /**
     * @hidden
     */
    var StringMonitorPlugin = {
        id: 'monitor-string',
        accept: function (value, _params) { return (typeof value === 'string' ? value : null); },
        binding: {
            reader: function (_args) { return stringFromUnknown; },
        },
        controller: function (args) {
            var _a;
            var value = args.value;
            var multiline = value.rawValue.length > 1 ||
                ('multiline' in args.params && args.params.multiline);
            if (multiline) {
                return new MultiLogController(args.document, {
                    formatter: formatString,
                    lineCount: (_a = args.params.lineCount) !== null && _a !== void 0 ? _a : Constants.monitor.defaultLineCount,
                    value: value,
                });
            }
            return new SingleLogMonitorController(args.document, {
                formatter: formatString,
                value: value,
            });
        },
    };

    function createDefaultWrapperElement(doc) {
        var elem = doc.createElement('div');
        elem.classList.add(ClassName('dfw')());
        if (doc.body) {
            doc.body.appendChild(elem);
        }
        return elem;
    }
    function embedStyle(doc, id, css) {
        if (doc.querySelector("style[data-tp-style=" + id + "]")) {
            return;
        }
        var styleElem = doc.createElement('style');
        styleElem.dataset.tpStyle = id;
        styleElem.textContent = css;
        doc.head.appendChild(styleElem);
    }
    function embedDefaultStyleIfNeeded(doc) {
        embedStyle(doc, 'default', '.tp-lstv_s,.tp-btnv_b,.tp-p2dpadtxtv_b,.tp-fldv_t,.tp-rotv_t,.tp-clswv_sw,.tp-p2dpadv_p,.tp-txtv_i,.tp-grlv_g,.tp-sglv_i,.tp-mllv_i,.tp-ckbv_i,.tp-cltxtv_ms{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0}.tp-lstv_s,.tp-btnv_b,.tp-p2dpadtxtv_b{background-color:var(--button-background-color);border-radius:2px;color:var(--button-foreground-color);cursor:pointer;display:block;font-weight:bold;height:var(--unit-size);line-height:var(--unit-size);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tp-lstv_s:hover,.tp-btnv_b:hover,.tp-p2dpadtxtv_b:hover{background-color:var(--button-background-color-hover)}.tp-lstv_s:focus,.tp-btnv_b:focus,.tp-p2dpadtxtv_b:focus{background-color:var(--button-background-color-focus)}.tp-lstv_s:active,.tp-btnv_b:active,.tp-p2dpadtxtv_b:active{background-color:var(--button-background-color-active)}.tp-fldv_t,.tp-rotv_t{background-color:var(--folder-background-color);color:var(--folder-foreground-color);cursor:pointer;display:block;height:calc(var(--unit-size) + 4px);line-height:calc(var(--unit-size) + 4px);overflow:hidden;padding-left:28px;position:relative;text-align:left;text-overflow:ellipsis;white-space:nowrap;width:100%;transition:border-radius .2s ease-in-out .2s}.tp-fldv_t:hover,.tp-rotv_t:hover{background-color:var(--folder-background-color-hover)}.tp-fldv_t:focus,.tp-rotv_t:focus{background-color:var(--folder-background-color-focus)}.tp-fldv_t:active,.tp-rotv_t:active{background-color:var(--folder-background-color-active)}.tp-fldv_m,.tp-rotv_m{background:linear-gradient(to left, var(--folder-foreground-color), var(--folder-foreground-color) 2px, transparent 2px, transparent 4px, var(--folder-foreground-color) 4px);border-radius:2px;bottom:0;content:\'\';display:block;height:6px;left:13px;margin:auto;opacity:0.5;position:absolute;top:0;transform:rotate(90deg);transition:transform .2s ease-in-out;width:6px}.tp-fldv.tp-fldv-expanded>.tp-fldv_t>.tp-fldv_m,.tp-rotv.tp-rotv-expanded .tp-rotv_m{transform:none}.tp-fldv_c,.tp-rotv_c{box-sizing:border-box;height:0;opacity:0;overflow:hidden;padding-bottom:0;padding-top:0;position:relative;transition:height .2s ease-in-out,opacity .2s linear,padding .2s ease-in-out}.tp-fldv_c>.tp-fldv.tp-v-first,.tp-rotv_c>.tp-fldv.tp-v-first{margin-top:-4px}.tp-fldv_c>.tp-fldv.tp-v-last,.tp-rotv_c>.tp-fldv.tp-v-last{margin-bottom:-4px}.tp-fldv_c>*:not(.tp-v-first),.tp-rotv_c>*:not(.tp-v-first){margin-top:4px}.tp-fldv_c>.tp-fldv:not(.tp-v-hidden)+.tp-fldv,.tp-rotv_c>.tp-fldv:not(.tp-v-hidden)+.tp-fldv{margin-top:0}.tp-fldv_c>.tp-sptv:not(.tp-v-hidden)+.tp-sptv,.tp-rotv_c>.tp-sptv:not(.tp-v-hidden)+.tp-sptv{margin-top:0}.tp-fldv.tp-fldv-expanded>.tp-fldv_c,.tp-rotv.tp-rotv-expanded .tp-rotv_c{opacity:1;padding-bottom:4px;padding-top:4px;transform:none;overflow:visible;transition:height .2s ease-in-out,opacity .2s linear .2s,padding .2s ease-in-out}.tp-clswv_sw,.tp-p2dpadv_p,.tp-txtv_i{background-color:var(--input-background-color);border-radius:2px;box-sizing:border-box;color:var(--input-foreground-color);font-family:inherit;height:var(--unit-size);line-height:var(--unit-size);min-width:0;width:100%}.tp-clswv_sw:hover,.tp-p2dpadv_p:hover,.tp-txtv_i:hover{background-color:var(--input-background-color-hover)}.tp-clswv_sw:focus,.tp-p2dpadv_p:focus,.tp-txtv_i:focus{background-color:var(--input-background-color-focus)}.tp-clswv_sw:active,.tp-p2dpadv_p:active,.tp-txtv_i:active{background-color:var(--input-background-color-active)}.tp-cltxtv_m,.tp-lstv{position:relative}.tp-lstv_s{padding:0 20px 0 4px;width:100%}.tp-cltxtv_mm,.tp-lstv_m{bottom:0;margin:auto;pointer-events:none;position:absolute;right:2px;top:0}.tp-cltxtv_mm svg,.tp-lstv_m svg{bottom:0;height:16px;margin:auto;position:absolute;right:0;top:0;width:16px}.tp-cltxtv_mm svg path,.tp-lstv_m svg path{fill:currentColor}.tp-grlv_g,.tp-sglv_i,.tp-mllv_i{background-color:var(--monitor-background-color);border-radius:2px;box-sizing:border-box;color:var(--monitor-foreground-color);height:var(--unit-size);width:100%}.tp-clpv,.tp-p2dpadv{background-color:var(--base-background-color);border-radius:6px;box-shadow:0 2px 4px var(--base-shadow-color);display:none;max-width:168px;padding:4px;position:relative;visibility:hidden;z-index:1000}.tp-clpv.tp-clpv-expanded,.tp-p2dpadv.tp-p2dpadv-expanded{display:block;visibility:visible}.tp-cltxtv_w,.tp-p2dtxtv,.tp-p3dtxtv{display:flex}.tp-cltxtv_c,.tp-p2dtxtv_a,.tp-p3dtxtv_a{width:100%}.tp-cltxtv_c+.tp-cltxtv_c,.tp-p2dtxtv_a+.tp-cltxtv_c,.tp-p3dtxtv_a+.tp-cltxtv_c,.tp-cltxtv_c+.tp-p2dtxtv_a,.tp-p2dtxtv_a+.tp-p2dtxtv_a,.tp-p3dtxtv_a+.tp-p2dtxtv_a,.tp-cltxtv_c+.tp-p3dtxtv_a,.tp-p2dtxtv_a+.tp-p3dtxtv_a,.tp-p3dtxtv_a+.tp-p3dtxtv_a{margin-left:2px}.tp-btnv_b{width:100%}.tp-ckbv_l{display:block;position:relative}.tp-ckbv_i{left:0;opacity:0;position:absolute;top:0}.tp-ckbv_w{background-color:var(--input-background-color);border-radius:2px;cursor:pointer;display:block;height:var(--unit-size);position:relative;width:var(--unit-size)}.tp-ckbv_w svg{bottom:0;display:block;height:16px;left:0;margin:auto;opacity:0;position:absolute;right:0;top:0;width:16px}.tp-ckbv_w svg path{fill:none;stroke:var(--input-foreground-color);stroke-width:2}.tp-ckbv_i:hover+.tp-ckbv_w{background-color:var(--input-background-color-hover)}.tp-ckbv_i:focus+.tp-ckbv_w{background-color:var(--input-background-color-focus)}.tp-ckbv_i:active+.tp-ckbv_w{background-color:var(--input-background-color-active)}.tp-ckbv_i:checked+.tp-ckbv_w svg{opacity:1}.tp-clpv_h,.tp-clpv_ap{margin-left:6px;margin-right:6px}.tp-clpv_h{margin-top:4px}.tp-clpv_rgb{display:flex;margin-top:4px;width:100%}.tp-clpv_a{display:flex;margin-top:4px;padding-top:8px;position:relative}.tp-clpv_a:before{background-color:var(--separator-color);content:\'\';height:4px;left:-4px;position:absolute;right:-4px;top:0}.tp-clpv_ap{align-items:center;display:flex;flex:3}.tp-clpv_at{flex:1;margin-left:4px}.tp-svpv{border-radius:2px;outline:none;overflow:hidden;position:relative}.tp-svpv_c{cursor:crosshair;display:block;height:80px;width:100%}.tp-svpv_m{border-radius:100%;border:rgba(255,255,255,0.75) solid 2px;box-sizing:border-box;filter:drop-shadow(0 0 1px rgba(0,0,0,0.3));height:12px;margin-left:-6px;margin-top:-6px;pointer-events:none;position:absolute;width:12px}.tp-svpv:focus .tp-svpv_m{border-color:#fff}.tp-hplv{cursor:pointer;height:var(--unit-size);outline:none;position:relative}.tp-hplv_c{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAABCAYAAABubagXAAAAQ0lEQVQoU2P8z8Dwn0GCgQEDi2OK/RBgYHjBgIpfovFh8j8YBIgzFGQxuqEgPhaDOT5gOhPkdCxOZeBg+IDFZZiGAgCaSSMYtcRHLgAAAABJRU5ErkJggg==);background-position:left top;background-repeat:no-repeat;background-size:100% 100%;border-radius:2px;display:block;height:4px;left:0;margin-top:-2px;position:absolute;top:50%;width:100%}.tp-hplv_m{border-radius:2px;border:rgba(255,255,255,0.75) solid 2px;box-shadow:0 0 2px rgba(0,0,0,0.1);box-sizing:border-box;height:12px;left:50%;margin-left:-6px;margin-top:-6px;pointer-events:none;position:absolute;top:50%;width:12px}.tp-hplv:focus .tp-hplv_m{border-color:#fff}.tp-aplv{cursor:pointer;height:var(--unit-size);outline:none;position:relative;width:100%}.tp-aplv_b{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:4px 4px;background-position:0 0,2px 2px;border-radius:2px;display:block;height:4px;left:0;margin-top:-2px;overflow:hidden;position:absolute;top:50%;width:100%}.tp-aplv_c{bottom:0;left:0;position:absolute;right:0;top:0}.tp-aplv_m{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:12px 12px;background-position:0 0,6px 6px;border-radius:2px;box-shadow:0 0 2px rgba(0,0,0,0.1);height:12px;left:50%;margin-left:-6px;margin-top:-6px;overflow:hidden;pointer-events:none;position:absolute;top:50%;width:12px}.tp-aplv_p{border-radius:2px;border:rgba(255,255,255,0.75) solid 2px;box-sizing:border-box;bottom:0;left:0;position:absolute;right:0;top:0}.tp-aplv:focus .tp-aplv_p{border-color:#fff}.tp-clswv{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:10px 10px;background-position:0 0,5px 5px;border-radius:2px}.tp-clswv_b{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;border-width:0;cursor:pointer;display:block;height:var(--unit-size);left:0;margin:0;outline:none;padding:0;position:absolute;top:0;width:var(--unit-size)}.tp-clswv_b:focus::after{border:rgba(255,255,255,0.75) solid 2px;border-radius:2px;bottom:0;content:\'\';display:block;left:0;position:absolute;right:0;top:0}.tp-clswv_p{left:-4px;position:absolute;right:-4px;top:var(--unit-size)}.tp-clswtxtv{display:flex;position:relative}.tp-clswtxtv_s{flex-grow:0;flex-shrink:0;width:var(--unit-size)}.tp-clswtxtv_t{flex:1;margin-left:4px}.tp-cltxtv{display:flex;width:100%}.tp-cltxtv_m{margin-right:4px}.tp-cltxtv_ms{border-radius:2px;color:var(--label-foreground-color);cursor:pointer;height:var(--unit-size);line-height:var(--unit-size);padding:0 18px 0 4px}.tp-cltxtv_ms:hover{background-color:var(--input-background-color-hover)}.tp-cltxtv_ms:focus{background-color:var(--input-background-color-focus)}.tp-cltxtv_ms:active{background-color:var(--input-background-color-active)}.tp-cltxtv_mm{color:var(--label-foreground-color)}.tp-cltxtv_w{flex:1}.tp-dfwv{position:absolute;top:8px;right:8px;width:256px}.tp-fldv.tp-fldv-expanded .tp-fldv_t{transition:border-radius 0s}.tp-fldv_c{border-left:var(--folder-background-color) solid 4px}.tp-fldv_t:hover+.tp-fldv_c{border-left-color:var(--folder-background-color-hover)}.tp-fldv_t:focus+.tp-fldv_c{border-left-color:var(--folder-background-color-focus)}.tp-fldv_t:active+.tp-fldv_c{border-left-color:var(--folder-background-color-active)}.tp-fldv_c>.tp-fldv{margin-left:4px}.tp-fldv_c>.tp-fldv>.tp-fldv_t{border-top-left-radius:2px;border-bottom-left-radius:2px}.tp-fldv_c>.tp-fldv.tp-fldv-expanded>.tp-fldv_t{border-bottom-left-radius:0}.tp-fldv_c .tp-fldv>.tp-fldv_c{border-bottom-left-radius:2px}.tp-grlv{position:relative}.tp-grlv_g{display:block;height:calc(var(--unit-size) * 3)}.tp-grlv_g polyline{fill:none;stroke:var(--monitor-foreground-color);stroke-linejoin:round}.tp-grlv_t{margin-top:-4px;transition:left 0.05s, top 0.05s;visibility:hidden}.tp-grlv_t.tp-grlv_t-a{visibility:visible}.tp-grlv_t.tp-grlv_t-in{transition:none}.tp-grlv .tp-ttv{background-color:var(--monitor-foreground-color)}.tp-grlv .tp-ttv::before{border-top-color:var(--monitor-foreground-color)}.tp-lblv{align-items:center;display:flex;line-height:1.3;padding-left:4px;padding-right:4px}.tp-lblv.tp-lblv-nol{display:block}.tp-lblv_l{color:var(--label-foreground-color);flex:1;-webkit-hyphens:auto;-ms-hyphens:auto;hyphens:auto;overflow:hidden;padding-left:4px;padding-right:16px}.tp-lblv_v{align-self:flex-start;flex-grow:0;flex-shrink:0;width:var(--value-width)}.tp-lblv.tp-lblv-nol .tp-lblv_v{width:100%}.tp-lstv_s{padding:0 20px 0 4px;width:100%}.tp-lstv_m{color:var(--button-foreground-color)}.tp-sglv_i{padding:0 4px}.tp-mllv_i{display:block;height:calc(var(--unit-size) * 3);line-height:var(--unit-size);padding:0 4px;resize:none;white-space:pre}.tp-p2dpadv{padding-left:calc(4px * 2 + var(--unit-size))}.tp-p2dpadv_p{cursor:crosshair;height:0;overflow:hidden;padding-bottom:100%;position:relative}.tp-p2dpadv_g{display:block;height:100%;left:0;pointer-events:none;position:absolute;top:0;width:100%}.tp-p2dpadv_ax{stroke:var(--input-guide-color)}.tp-p2dpadv_l{stroke:var(--input-foreground-color);stroke-dasharray:2px 2px}.tp-p2dpadv_m{fill:var(--input-foreground-color)}.tp-p2dpadtxtv{display:flex;position:relative}.tp-p2dpadtxtv_b{height:var(--unit-size);position:relative;width:var(--unit-size)}.tp-p2dpadtxtv_b svg{display:block;height:16px;left:50%;margin-left:-8px;margin-top:-8px;position:absolute;top:50%;width:16px}.tp-p2dpadtxtv_b svg path{stroke:currentColor;stroke-width:2}.tp-p2dpadtxtv_b svg circle{fill:currentColor}.tp-p2dpadtxtv_p{left:-4px;position:absolute;right:-4px;top:var(--unit-size)}.tp-p2dpadtxtv_t{margin-left:4px}.tp-rotv{--font-family: var(--tp-font-family, Roboto Mono,Source Code Pro,Menlo,Courier,monospace);--unit-size: var(--tp-unit-size, 20px);--value-width: var(--tp-value-width, 160px);--base-background-color: var(--tp-base-background-color, #2f3137);--base-shadow-color: var(--tp-base-shadow-color, rgba(0,0,0,0.2));--button-background-color: var(--tp-button-background-color, #adafb8);--button-background-color-active: var(--tp-button-background-color-active, #d6d7db);--button-background-color-focus: var(--tp-button-background-color-focus, #c8cad0);--button-background-color-hover: var(--tp-button-background-color-hover, #bbbcc4);--button-foreground-color: var(--tp-button-foreground-color, #2f3137);--folder-background-color: var(--tp-folder-background-color, rgba(200,202,208,0.1));--folder-background-color-active: var(--tp-folder-background-color-active, rgba(200,202,208,0.25));--folder-background-color-focus: var(--tp-folder-background-color-focus, rgba(200,202,208,0.2));--folder-background-color-hover: var(--tp-folder-background-color-hover, rgba(200,202,208,0.15));--folder-foreground-color: var(--tp-folder-foreground-color, #c8cad0);--input-background-color: var(--tp-input-background-color, rgba(200,202,208,0.1));--input-background-color-active: var(--tp-input-background-color-active, rgba(200,202,208,0.25));--input-background-color-focus: var(--tp-input-background-color-focus, rgba(200,202,208,0.2));--input-background-color-hover: var(--tp-input-background-color-hover, rgba(200,202,208,0.15));--input-foreground-color: var(--tp-input-foreground-color, #c8cad0);--input-guide-color: var(--tp-input-guide-color, rgba(0,0,0,0.2));--label-foreground-color: var(--tp-label-foreground-color, rgba(200,202,208,0.7));--monitor-background-color: var(--tp-monitor-background-color, rgba(0,0,0,0.2));--monitor-foreground-color: var(--tp-monitor-foreground-color, rgba(200,202,208,0.7));--separator-color: var(--tp-separator-color, rgba(0,0,0,0.2))}.tp-rotv{background-color:var(--base-background-color);border-radius:6px;box-shadow:0 2px 4px var(--base-shadow-color);font-family:var(--font-family);font-size:11px;font-weight:500;line-height:1;text-align:left}.tp-rotv_t{border-bottom-left-radius:6px;border-bottom-right-radius:6px;border-top-left-radius:6px;border-top-right-radius:6px;padding-right:28px;text-align:center}.tp-rotv.tp-rotv-expanded .tp-rotv_t{border-bottom-left-radius:0;border-bottom-right-radius:0}.tp-rotv_m{transition:none}.tp-rotv_c>.tp-fldv:last-child>.tp-fldv_c{border-bottom-left-radius:6px;border-bottom-right-radius:6px}.tp-rotv_c>.tp-fldv:last-child:not(.tp-fldv-expanded)>.tp-fldv_t{border-bottom-left-radius:6px;border-bottom-right-radius:6px}.tp-rotv_c>.tp-fldv:first-child>.tp-fldv_t{border-top-left-radius:6px;border-top-right-radius:6px}.tp-rotv.tp-v-hidden,.tp-rotv .tp-v-hidden{display:none}.tp-sptv_r{background-color:var(--separator-color);border-width:0;display:block;height:4px;margin:0;width:100%}.tp-sldv_t{box-sizing:border-box;cursor:pointer;height:var(--unit-size);margin:0 6px;outline:none;position:relative}.tp-sldv_t::before{background-color:var(--input-background-color);border-radius:1px;bottom:0;content:\'\';display:block;height:2px;left:0;margin:auto;position:absolute;right:0;top:0}.tp-sldv_k{height:100%;left:0;position:absolute;top:0}.tp-sldv_k::before{background-color:var(--input-foreground-color);border-radius:1px;bottom:0;content:\'\';display:block;height:2px;left:0;margin-bottom:auto;margin-top:auto;position:absolute;right:0;top:0}.tp-sldv_k::after{background-color:var(--button-background-color);border-radius:2px;bottom:0;content:\'\';display:block;height:12px;margin-bottom:auto;margin-top:auto;position:absolute;right:-6px;top:0;width:12px}.tp-sldv_t:hover .tp-sldv_k::after{background-color:var(--button-background-color-hover)}.tp-sldv_t:focus .tp-sldv_k::after{background-color:var(--button-background-color-focus)}.tp-sldv_t:active .tp-sldv_k::after{background-color:var(--button-background-color-active)}.tp-sldtxtv{display:flex}.tp-sldtxtv_s{flex:2}.tp-sldtxtv_t{flex:1;margin-left:4px}.tp-txtv{position:relative}.tp-txtv_i{padding:0 4px}.tp-txtv.tp-txtv-fst .tp-txtv_i{border-bottom-right-radius:0;border-top-right-radius:0}.tp-txtv.tp-txtv-mid .tp-txtv_i{border-radius:0}.tp-txtv.tp-txtv-lst .tp-txtv_i{border-bottom-left-radius:0;border-top-left-radius:0}.tp-txtv.tp-txtv-num .tp-txtv_i{text-align:right}.tp-txtv.tp-txtv-drg .tp-txtv_i{opacity:0.3}.tp-txtv_k{cursor:pointer;height:100%;left:-4px;position:absolute;top:0;width:12px}.tp-txtv_k::before{background-color:var(--input-foreground-color);border-radius:2px 0 0 2px;bottom:0;content:\'\';height:var(--unit-size);left:50%;margin-bottom:auto;margin-left:-2px;margin-top:auto;opacity:0.1;position:absolute;top:0;transition:height 0.1s;width:4px}.tp-txtv.tp-txtv-mid .tp-txtv_k::before,.tp-txtv.tp-txtv-lst .tp-txtv_k::before{border-bottom-left-radius:0;border-top-left-radius:0}.tp-txtv_k:hover::before,.tp-txtv.tp-txtv-drg .tp-txtv_k::before{opacity:1}.tp-txtv.tp-txtv-drg .tp-txtv_k::before{border-radius:2px;height:4px}.tp-txtv.tp-txtv-drg.tp-txtv-mid .tp-txtv_k::before,.tp-txtv.tp-txtv-drg.tp-txtv-list .tp-txtv_k::before{border-bottom-left-radius:2px;border-top-left-radius:2px}.tp-txtv_g{bottom:0;display:block;height:8px;left:50%;margin:auto;overflow:visible;pointer-events:none;position:absolute;top:0;visibility:hidden;width:100%}.tp-txtv.tp-txtv-drg .tp-txtv_g{visibility:visible}.tp-txtv_gb{fill:none;stroke:var(--input-foreground-color);stroke-dasharray:2px 2px}.tp-txtv_gh{fill:none;stroke:var(--input-foreground-color)}.tp-txtv .tp-ttv{margin-left:6px;visibility:hidden}.tp-txtv.tp-txtv-drg .tp-ttv{visibility:visible}.tp-ttv{background-color:var(--input-foreground-color);border-radius:2px;color:var(--base-background-color);padding:2px 4px;pointer-events:none;position:absolute;transform:translate(-50%, -100%)}.tp-ttv::before{border-color:var(--input-foreground-color) transparent transparent transparent;border-style:solid;border-width:2px;box-sizing:border-box;content:\'\';font-size:0.9em;height:4px;left:50%;margin-left:-2px;position:absolute;top:100%;width:4px}');
        getAllPlugins().forEach(function (plugin) {
            if (plugin.css) {
                embedStyle(doc, "plugin-" + plugin.id, plugin.css);
            }
        });
    }
    var Tweakpane = /** @class */ (function (_super) {
        __extends(Tweakpane, _super);
        function Tweakpane(opt_config) {
            var _a;
            var _this = this;
            var config = opt_config || {};
            var doc = (_a = config.document) !== null && _a !== void 0 ? _a : getWindowDocument();
            var rootController = new RootController(doc, {
                expanded: config.expanded,
                blade: new Blade(),
                title: config.title,
            });
            _this = _super.call(this, rootController) || this;
            _this.containerElem_ = config.container || createDefaultWrapperElement(doc);
            _this.containerElem_.appendChild(_this.element);
            _this.doc_ = doc;
            _this.usesDefaultWrapper_ = !config.container;
            embedDefaultStyleIfNeeded(_this.document);
            return _this;
        }
        Object.defineProperty(Tweakpane.prototype, "document", {
            get: function () {
                if (!this.doc_) {
                    throw TpError.alreadyDisposed();
                }
                return this.doc_;
            },
            enumerable: false,
            configurable: true
        });
        Tweakpane.prototype.dispose = function () {
            var containerElem = this.containerElem_;
            if (!containerElem) {
                throw TpError.alreadyDisposed();
            }
            if (this.usesDefaultWrapper_) {
                var parentElem = containerElem.parentElement;
                if (parentElem) {
                    parentElem.removeChild(containerElem);
                }
            }
            this.containerElem_ = null;
            this.doc_ = null;
            _super.prototype.dispose.call(this);
        };
        Tweakpane.version = new Semver('2.1.1');
        return Tweakpane;
    }(RootApi));
    function registerDefaultPlugins() {
        [
            Point2dInputPlugin,
            Point3dInputPlugin,
            Point4dInputPlugin,
            StringInputPlugin,
            NumberInputPlugin,
            StringColorInputPlugin,
            ObjectColorInputPlugin,
            NumberColorInputPlugin,
            BooleanInputPlugin,
        ].forEach(function (p) {
            RootApi.registerPlugin({
                type: 'input',
                plugin: p,
            });
        });
        [BooleanMonitorPlugin, StringMonitorPlugin, NumberMonitorPlugin].forEach(function (p) {
            RootApi.registerPlugin({
                type: 'monitor',
                plugin: p,
            });
        });
    }
    registerDefaultPlugins();

    return Tweakpane;

})));

},{}],"js/gui.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
let gui;

class Tweakpane {
  constructor() {
    const Tweakpane = require("tweakpane");

    this.gui = new Tweakpane({
      title: "GUI"
    });
  }

}

const GUI = () => {
  return gui || (gui = new Tweakpane());
};

var _default = GUI;
exports.default = _default;
},{"tweakpane":"node_modules/tweakpane/dist/tweakpane.js"}],"js/picture.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ogl = require("ogl");

var _gsap = _interopRequireDefault(require("gsap"));

var _webgl = _interopRequireDefault(require("~/js/webgl"));

var _viewport = _interopRequireDefault(require("./viewport"));

var _raf = _interopRequireDefault(require("./raf"));

var _gui = _interopRequireDefault(require("~/js/gui"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const vertex = `
                attribute vec3 position;
                attribute vec3 normal;
                attribute vec2 uv;
                uniform mat4 modelViewMatrix;
                uniform mat4 projectionMatrix;
                uniform mat3 normalMatrix;
                varying vec3 vNormal;
                varying vec2 vUv;

                void main() {
                    vNormal = normalize(normalMatrix * normal);

                    vUv = uv;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `;
const fragment = `
                precision highp float;
                varying vec3 vNormal;
                varying vec2 vUv;

                uniform vec2 uImageSizes;
                uniform float uProgress;
                uniform float uOffsetY;
                uniform float uOffsetX;
                uniform vec2 uPlaneSizes;
                uniform sampler2D tMap;

                float delay = 3.0;

                vec2 resizedUv(vec2 inital_uv, vec2 aspect_ratio) {
                    vec2 ratio = vec2(
                        min((uPlaneSizes.x / uPlaneSizes.y) / (aspect_ratio.x / aspect_ratio.y), 1.0),
                        min((uPlaneSizes.y / uPlaneSizes.x) / (aspect_ratio.y / aspect_ratio.x), 1.0)
                    );

                    vec2 new_uv = vec2(
                        inital_uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
                        inital_uv.y * ratio.y + (1.0 - ratio.y) * 0.5
                    );

	                return new_uv;
                }

                vec4 getTexture2D(vec2 uv) {
                    return texture2D(tMap, uv);
                }

                vec4 wavyEffect(vec2 p) {
                    float phase = uProgress*uProgress + uProgress + 0.0;
                    float shifty = uOffsetY*uProgress*cos(uOffsetX*(uProgress+p.x));

                    vec2 offset = vec2(0, shifty);

                    return mix(
                      getTexture2D(p + offset), 
                      vec4(1.0, 1.0, 1.0, 1.0), 
                      uProgress
                    );
                }

                void main() {
                    vec2 uv = resizedUv(vUv, uImageSizes);
                    vec3 normal = normalize(vNormal);

                    // vec3 tex = getTexture2D(uv).rgb;
                    vec3 texture = wavyEffect(uv).rgb;

                    float lighting = dot(normal, normalize(vec3(-0.3, 0.8, 0.6)));

                    gl_FragColor.rgb = texture + lighting * 0.1;
                    gl_FragColor.a = 1.0;
                }
            `;

class Picture {
  constructor({
    element
  }) {
    this.element = element;
    this.image = this.element.querySelector("img");
    this.createShader();
    this.createMesh();
    this.createBounds();
    this.initGUI();
    this.onResize(); // this.runProgress();

    _raf.default.add(`image-'${this.mesh.id}`, this.update.bind(this), 0);
  }

  initGUI() {
    const {
      gui
    } = (0, _gui.default)();
    this.gui = gui.addFolder({
      title: `Image ${this.mesh.id}`
    });
    this.gui.addButton({
      title: "PLAY"
    }).on("click", this.runProgress.bind(this));
    this.gui.addInput(this.program.uniforms.uOffsetY, "value", {
      min: 0,
      max: 1,
      step: 0.01,
      label: "Y Offset"
    }).on("change", payload => this.program.uniforms.uOffsetY.value = payload.value);
    this.gui.addInput(this.program.uniforms.uOffsetX, "value", {
      min: 0,
      max: 50,
      step: 1,
      label: "X Offset"
    }).on("change", payload => this.program.uniforms.uOffsetX.value = payload.value);
  }

  runProgress() {
    this.tProgress?.kill();
    this.tProgress = _gsap.default.to(this.program.uniforms.uProgress, {
      value: 0,
      duration: 2,
      repeat: -1,
      ease: "power2.out"
    });
  }

  createShader() {
    const {
      gl
    } = (0, _webgl.default)();
    this.texture = new _ogl.Texture(gl, {
      generateMipmaps: false
    });
    this.program = new _ogl.Program(gl, {
      depthTest: false,
      depthWrite: false,
      fragment,
      vertex,
      uniforms: {
        tMap: {
          value: this.texture
        },
        uPlaneSizes: {
          value: [0, 0]
        },
        uImageSizes: {
          value: [0, 0]
        },
        uOffsetY: {
          value: 0.2
        },
        uOffsetX: {
          value: 10.0
        },
        uProgress: {
          value: 1.0
        },
        uViewportSizes: {
          value: [_viewport.default.width, _viewport.default.height]
        },
        uSpeed: {
          value: 0
        },
        uTime: {
          value: 100 * Math.random()
        }
      },
      transparent: true
    });
    const image = new Image();
    image.src = this.image.src;

    image.onload = _ => {
      this.texture.image = image;
      this.program.uniforms.uImageSizes.value = [image.naturalWidth, image.naturalHeight];
    };
  }

  createMesh() {
    const {
      gl,
      scene
    } = (0, _webgl.default)();
    this.geometry = new _ogl.Plane(gl, {
      width: 1,
      height: 1,
      heightSegments: 50,
      widthSegments: 100
    });
    this.mesh = new _ogl.Mesh(gl, {
      geometry: this.geometry,
      program: this.program
    });
    this.mesh.setParent(scene);
  }

  createBounds() {
    const {
      viewportRenderer
    } = (0, _webgl.default)();
    this.bounds = this.element.getBoundingClientRect();
    this.mesh.scale.x = viewportRenderer.width * this.bounds.width / _viewport.default.width;
    this.mesh.scale.y = viewportRenderer.height * this.bounds.height / _viewport.default.height;
    this.mesh.program.uniforms.uViewportSizes.value = [viewportRenderer.width, viewportRenderer.height];
    this.mesh.program.uniforms.uPlaneSizes.value = [this.mesh.scale.x, this.mesh.scale.y];
  }

  onResize() {
    this.resizeObserver = new ResizeObserver(entries => {
      this.createBounds();
    });
    this.resizeObserver.observe(this.element);
  }

  updatePosition(x = 0, y = 0) {
    const {
      viewportRenderer
    } = (0, _webgl.default)();
    this.mesh.position.x = -(viewportRenderer.width / 2) + this.mesh.scale.x / 2 + (this.bounds.left - x) / _viewport.default.width * viewportRenderer.width;
    this.mesh.position.y = viewportRenderer.height / 2 - this.mesh.scale.y / 2 - (this.bounds.top - y) / _viewport.default.height * viewportRenderer.height;
  }

  update() {
    this.updatePosition();
  }

}

exports.default = Picture;
},{"ogl":"node_modules/ogl/src/index.mjs","gsap":"node_modules/gsap/index.js","~/js/webgl":"js/webgl.js","./viewport":"js/viewport.js","./raf":"js/raf.js","~/js/gui":"js/gui.js"}],"index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./index.css");

var _webgl = _interopRequireDefault(require("~/js/webgl"));

var _picture = _interopRequireDefault(require("~/js/picture"));

var _gui = _interopRequireDefault(require("~/js/gui"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class App {
  constructor() {
    this.paused = false;
    this.createMedias();
    (0, _webgl.default)();
    (0, _gui.default)(); // const { gui } = GUI();
    // this.gui = gui.addFolder({ title: "RAF" });
    // this.gui.addInput(this, "paused", {
    //   label: "Pause",
    // });
  }

  createMedias() {
    this.mediasElements = document.querySelectorAll("[data-webgl-picture]");
    this.medias = Object.values(this.mediasElements).map(element => {
      const picture = new _picture.default({
        element
      });
      return picture;
    });
    console.log(this.medias);
  }

}

var _default = new App();

exports.default = _default;
},{"./index.css":"index.css","~/js/webgl":"js/webgl.js","~/js/picture":"js/picture.js","~/js/gui":"js/gui.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49901" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/dreamy-wavy-effect.e31bb0bc.js.map