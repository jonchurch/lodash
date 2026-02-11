#!/usr/bin/env node
// Standalone reimplementation of lib/fp/build-modules.js from main.
// That version depends on lodash, async, glob, and fs-extra via lib/common/*,
// which makes it non-portable to dist branches. This script has zero external
// deps and produces identical output.
'use strict';

var fs = require('fs');
var path = require('path');

var root = path.resolve(__dirname, '..');
var fpDir = path.join(root, 'fp');
var mapping = require(path.join(fpDir, '_mapping'));

var categories = [
  'array', 'collection', 'date', 'function', 'lang',
  'math', 'number', 'object', 'seq', 'string', 'util'
];

var ignored = [
  /^_/, /^core\./, /^fp\./, /^index\./, /^lodash\./
];

var aryMethods = [].concat(
  mapping.aryMethod['1'],
  mapping.aryMethod['2'],
  mapping.aryMethod['3'],
  mapping.aryMethod['4']
);

// Collect module names from root *.js files.
var moduleNames = fs.readdirSync(root)
  .filter(function(f) {
    return f.endsWith('.js') && !ignored.some(function(re) { return re.test(f); });
  })
  .map(function(f) { return f.replace(/\.js$/, ''); });

// Add aliases and remaps not already present.
[mapping.aliasToReal, mapping.remap].forEach(function(map) {
  Object.keys(map).forEach(function(name) {
    if (moduleNames.indexOf(name) === -1) {
      moduleNames.push(name);
    }
  });
});

moduleNames.sort();

var hasOwn = Object.prototype.hasOwnProperty;

function has(obj, key) {
  return hasOwn.call(obj, key);
}

function get(obj, key, fallback) {
  return has(obj, key) ? obj[key] : fallback;
}

function getContent(moduleName) {
  var realName = get(mapping.aliasToReal, moduleName, moduleName);
  var remapped = get(mapping.remap, moduleName, moduleName);

  if (has(mapping.aliasToReal, moduleName)) {
    return "module.exports = require('./" + realName + "');\n";
  }
  if (categories.indexOf(moduleName) !== -1) {
    return "var convert = require('./convert');\n" +
           "module.exports = convert(require('../" + moduleName + "'));\n";
  }
  if (aryMethods.indexOf(moduleName) === -1) {
    return "var convert = require('./convert'),\n" +
           "    func = convert('" + moduleName + "', require('../" + remapped + "'), require('./_falseOptions'));\n" +
           "\n" +
           "func.placeholder = require('./placeholder');\n" +
           "module.exports = func;\n";
  }
  return "var convert = require('./convert'),\n" +
         "    func = convert('" + moduleName + "', require('../" + remapped + "'));\n" +
         "\n" +
         "func.placeholder = require('./placeholder');\n" +
         "module.exports = func;\n";
}

// Ensure fp/ exists.
if (!fs.existsSync(fpDir)) {
  fs.mkdirSync(fpDir);
}

// Write wrapper files.
moduleNames.forEach(function(name) {
  fs.writeFileSync(path.join(fpDir, name + '.js'), getContent(name));
});

// Write static files.
fs.writeFileSync(path.join(fpDir, '_falseOptions.js'),
  "module.exports = {\n" +
  "  'cap': false,\n" +
  "  'curry': false,\n" +
  "  'fixed': false,\n" +
  "  'immutable': false,\n" +
  "  'rearg': false\n" +
  "};\n");

fs.writeFileSync(path.join(fpDir, '_util.js'),
  "module.exports = {\n" +
  "  'ary': require('../ary'),\n" +
  "  'assign': require('../_baseAssign'),\n" +
  "  'clone': require('../clone'),\n" +
  "  'curry': require('../curry'),\n" +
  "  'forEach': require('../_arrayEach'),\n" +
  "  'isArray': require('../isArray'),\n" +
  "  'isError': require('../isError'),\n" +
  "  'isFunction': require('../isFunction'),\n" +
  "  'isWeakMap': require('../isWeakMap'),\n" +
  "  'iteratee': require('../iteratee'),\n" +
  "  'keys': require('../_baseKeys'),\n" +
  "  'rearg': require('../rearg'),\n" +
  "  'toInteger': require('../toInteger'),\n" +
  "  'toPath': require('../toPath')\n" +
  "};\n");

fs.writeFileSync(path.join(fpDir, 'convert.js'),
  "var baseConvert = require('./_baseConvert'),\n" +
  "    util = require('./_util');\n" +
  "\n" +
  "/**\n" +
  " * Converts `func` of `name` to an immutable auto-curried iteratee-first data-last\n" +
  " * version with conversion `options` applied. If `name` is an object its methods\n" +
  " * will be converted.\n" +
  " *\n" +
  " * @param {string} name The name of the function to wrap.\n" +
  " * @param {Function} [func] The function to wrap.\n" +
  " * @param {Object} [options] The options object. See `baseConvert` for more details.\n" +
  " * @returns {Function|Object} Returns the converted function or object.\n" +
  " */\n" +
  "function convert(name, func, options) {\n" +
  "  return baseConvert(util, name, func, options);\n" +
  "}\n" +
  "\n" +
  "module.exports = convert;\n");

fs.writeFileSync(path.join(root, 'fp.js'),
  "var _ = require('./lodash.min').runInContext();\n" +
  "module.exports = require('./fp/_baseConvert')(_, _);\n");

console.log('Built ' + moduleNames.length + ' FP modules in fp/');
