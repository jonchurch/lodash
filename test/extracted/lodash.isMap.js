/**
 * Extracted from: test/test.js
 * Module: lodash.isMap
 * Original lines: 10812-10878
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var args = require('../utils/helpers.js').args;
var skipAssert = require('../utils/helpers.js').skipAssert;
var falsey = require('../utils/fixtures.js').falsey;
var stubFalse = require('../utils/stubs.js').stubFalse;
var map = require('../utils/es6.js').map;
var symbol = require('../utils/es6.js').symbol;
var weakMap = require('../utils/es6.js').weakMap;
var realm = require('../utils/environment.js').realm;
var slice = Array.prototype.slice;

QUnit.module('lodash.isMap');

(function() {
  QUnit.test('should return `true` for maps', function(assert) {
    assert.expect(1);

    if (Map) {
      assert.strictEqual(_.isMap(map), true);
    }
    else {
      skipAssert(assert);
    }
  });

  QUnit.test('should return `false` for non-maps', function(assert) {
    assert.expect(14);

    var expected = lodashStable.map(falsey, stubFalse);

    var actual = lodashStable.map(falsey, function(value, index) {
      return index ? _.isMap(value) : _.isMap();
    });

    assert.deepEqual(actual, expected);

    assert.strictEqual(_.isMap(args), false);
    assert.strictEqual(_.isMap([1, 2, 3]), false);
    assert.strictEqual(_.isMap(true), false);
    assert.strictEqual(_.isMap(new Date), false);
    assert.strictEqual(_.isMap(new Error), false);
    assert.strictEqual(_.isMap(_), false);
    assert.strictEqual(_.isMap(Array.prototype.slice), false);
    assert.strictEqual(_.isMap({ 'a': 1 }), false);
    assert.strictEqual(_.isMap(1), false);
    assert.strictEqual(_.isMap(/x/), false);
    assert.strictEqual(_.isMap('a'), false);
    assert.strictEqual(_.isMap(symbol), false);
    assert.strictEqual(_.isMap(weakMap), false);
  });

  QUnit.test('should work for objects with a non-function `constructor` (test in IE 11)', function(assert) {
    assert.expect(1);

    var values = [false, true],
        expected = lodashStable.map(values, stubFalse);

    var actual = lodashStable.map(values, function(value) {
      return _.isMap({ 'constructor': value });
    });

    assert.deepEqual(actual, expected);
  });

  QUnit.test('should work with maps from another realm', function(assert) {
    assert.expect(1);

    if (realm.map) {
      assert.strictEqual(_.isMap(realm.map), true);
    }
    else {
      skipAssert(assert);
    }
  });
}());

  /*--------------------------------------------------------------------------*/
