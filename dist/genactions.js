'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pluralize = require('pluralize');
var objectAssign = require('object-assign');

var _require = require('./utils'),
    capitalize = _require.capitalize,
    snakeToCamel = _require.snakeToCamel;

module.exports = function (context, actionObj) {
  if (!context) {
    console.warn('[nuxtend] genactions: conext is not passed.');
    return {};
  }
  var action = '';
  var alias = null;
  var funcNameBase = '';
  if (typeof actionObj === 'string') {
    action = actionObj;
  } else {
    action = actionObj.name;
    if (actionObj.alias) {
      alias = actionObj.alias;
    }
  }
  if (!action) {
    console.warn('[nuxtend] genactions: action is not passed.');
    return {};
  }
  var pathPrefix = '';
  var lastSlashPos = action.lastIndexOf('/');
  if (lastSlashPos === -1) {
    funcNameBase = action;
  } else {
    pathPrefix = action.substr(0, lastSlashPos + 1);
    funcNameBase = action.substr(lastSlashPos + 1);
  }
  var capitalizedAction = capitalize(snakeToCamel(funcNameBase));
  var pluralizedAction = pluralize.plural(funcNameBase);
  var funcs = {};

  // usage example: this.getUser(123) or this.getUser({id: 123, params: {status=sleeping}})
  funcs['get' + capitalizedAction] = function (arg) {
    var fullQualifiedActionName = '' + pathPrefix + pluralizedAction + '/get';
    if (typeof this.$store._actions[fullQualifiedActionName] !== 'undefined') {
      return this.$store.dispatch(fullQualifiedActionName, arg);
    } else {
      var id = arg;
      var params = null;
      if ((typeof arg === 'undefined' ? 'undefined' : (0, _typeof3.default)(arg)) === 'object') {
        id = arg.id;
        params = arg.params;
      }
      return this.$axios.get('/' + pathPrefix + pluralizedAction + '/' + id, { params: params });
    }
  };

  funcs['get' + capitalizedAction + 'List'] = function (config) {
    var fullQualifiedActionName = '' + pathPrefix + pluralizedAction + '/getList';
    if (typeof this.$store._actions[fullQualifiedActionName] !== 'undefined') {
      return this.$store.dispatch(fullQualifiedActionName, config);
    } else {
      return this.$axios.get('/' + pathPrefix + pluralizedAction, config);
    }
  };

  funcs['post' + capitalizedAction] = function (arg, config) {
    var fullQualifiedActionName = '' + pathPrefix + pluralizedAction + '/create';
    if (typeof this.$store._actions[fullQualifiedActionName] !== 'undefined') {
      var payload = objectAssign({}, arg, { config: config });
      return this.$store.dispatch(fullQualifiedActionName, payload);
    } else {
      return this.$axios.post('/' + pathPrefix + pluralizedAction, arg, config);
    }
  };

  funcs['put' + capitalizedAction] = function (arg, config) {
    var fullQualifiedActionName = '' + pathPrefix + pluralizedAction + '/update';
    if (typeof this.$store._actions[fullQualifiedActionName] !== 'undefined') {
      var payload = objectAssign({}, arg, { config: config });
      return this.$store.dispatch(fullQualifiedActionName, payload);
    } else {
      var id = arg;
      var params = null;
      var _config = null;
      if ((typeof arg === 'undefined' ? 'undefined' : (0, _typeof3.default)(arg)) === 'object') {
        id = arg.id;
        params = arg;
      }
      return this.$axios.put('/' + pathPrefix + pluralizedAction + '/' + id, params, _config);
    }
  };

  funcs['delete' + capitalizedAction] = function (arg, config) {
    var fullQualifiedActionName = '' + pathPrefix + pluralizedAction + '/delete';
    if (typeof this.$store._actions[fullQualifiedActionName] !== 'undefined') {
      var payload = objectAssign({}, arg, { config: config });
      return this.$store.dispatch(fullQualifiedActionName, payload);
    } else {
      var id = arg;
      var params = null;
      if ((typeof arg === 'undefined' ? 'undefined' : (0, _typeof3.default)(arg)) === 'object') {
        id = arg.id;
      }
      return this.$axios.delete('/' + pathPrefix + pluralizedAction + '/' + id, config);
    }
  };

  return funcs;
};
//# sourceMappingURL=genactions.js.map