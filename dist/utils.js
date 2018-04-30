"use strict";

exports.capitalize = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
exports.snakeToCamel = function (str) {
  return str.replace(/_\w/g, function (m) {
    return m[1].toUpperCase();
  });
};
//# sourceMappingURL=utils.js.map