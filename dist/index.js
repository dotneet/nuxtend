'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var genActions = require('./genactions');

function bindContext(methods, context) {
  var target = { '$store': context.store, '$axios': context.$axios };
  var result = {};
  for (var key in methods) {
    result[key] = methods[key].bind(target);
  }
  return result;
}

function createAsyncDataFunction(component, originalAsyncData, methods) {
  var _this = this;

  return function _callee(context) {
    var data, idx, mixin, _r, target, r;

    return _regenerator2.default.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = {};
            _context.t0 = _regenerator2.default.keys(component.mixins);

          case 2:
            if ((_context.t1 = _context.t0()).done) {
              _context.next = 12;
              break;
            }

            idx = _context.t1.value;
            mixin = component.mixins[idx];

            if (!(typeof mixin.asyncData !== 'undefined')) {
              _context.next = 10;
              break;
            }

            _context.next = 8;
            return _regenerator2.default.awrap(mixin.asyncData(context));

          case 8:
            _r = _context.sent;

            Object.assign(data, _r);

          case 10:
            _context.next = 2;
            break;

          case 12:
            target = {};

            Object.assign(target, bindContext(methods, context));
            _context.next = 16;
            return _regenerator2.default.awrap(originalAsyncData.apply(target, [context]));

          case 16:
            r = _context.sent;

            Object.assign(data, r);
            return _context.abrupt('return', data);

          case 19:
          case 'end':
            return _context.stop();
        }
      }
    }, null, _this);
  };
}

function createFetchFunction(component, originalFetch, methods) {
  var _this2 = this;

  return function _callee2(context) {
    var idx, mixin, target;
    return _regenerator2.default.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.t0 = _regenerator2.default.keys(component.mixins);

          case 1:
            if ((_context2.t1 = _context2.t0()).done) {
              _context2.next = 9;
              break;
            }

            idx = _context2.t1.value;
            mixin = component.mixins[idx];

            if (!(typeof mixin.fetch !== 'undefined')) {
              _context2.next = 7;
              break;
            }

            _context2.next = 7;
            return _regenerator2.default.awrap(mixin.fetch(context));

          case 7:
            _context2.next = 1;
            break;

          case 9:
            target = {};

            Object.assign(target, bindContext(methods, context));
            _context2.next = 13;
            return _regenerator2.default.awrap(originalFetch.apply(target, [context]));

          case 13:
          case 'end':
            return _context2.stop();
        }
      }
    }, null, _this2);
  };
}

function mergeMethods(component) {
  var methods = {};
  if (component.mixins) {
    component.mixins.forEach(function (mixin) {
      if (mixin.methods) {
        Object.assign(methods, mixin.methods);
      }
    });
  }
  if (component.methods) {
    Object.assign(methods, component.methods);
  }
  if (component.nuxtend && component.nuxtend.actions) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = component.nuxtend.actions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var act = _step.value;

        var funcs = genActions({}, act);
        for (var name in funcs) {
          if (typeof methods[name] === 'undefined') {
            methods[name] = funcs[name];
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
  return methods;
}

module.exports = function (component) {
  var com = Object.assign(component);
  var asyncData = com.asyncData,
      fetch = com.fetch;

  var methods = mergeMethods(com);
  if (fetch) {
    com.fetch = createFetchFunction(com, fetch, methods);
  }
  if (asyncData) {
    com.asyncData = createAsyncDataFunction(com, asyncData, methods);
  }
  com.methods = methods;
  return com;
};
//# sourceMappingURL=index.js.map