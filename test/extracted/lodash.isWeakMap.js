/**
 * Extracted from: test/test.js
 * Module: lodash.isWeakMap
 * Original lines: 11945-12011
 */

var realm = require('../utils/environment.js').realm;

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var falsey = require('../utils/fixtures.js').falsey;
var stubFalse = require('../utils/stubs.js').stubFalse;
var args = require('../utils/helpers.js').args;
var skipAssert = require('../utils/helpers.js').skipAssert;
var weakMap = require('../utils/es6.js').weakMap;
var symbol = require('../utils/es6.js').symbol;
var map = require('../utils/es6.js').map;

QUnit.module('lodash.isWeakMap');

  (function() {
    QUnit.test('should return `true` for weak maps', function(assert) {
      assert.expect(1);

      if (WeakMap) {
        assert.strictEqual(_.isWeakMap(weakMap), true);
      }
      else {
        skipAssert(assert);
      }
    });

    QUnit.test('should return `false` for non weak maps', function(assert) {
      assert.expect(14);

      var expected = lodashStable.map(falsey, stubFalse);

      var actual = lodashStable.map(falsey, function(value, index) {
        return index ? _.isWeakMap(value) : _.isWeakMap();
      });

      assert.deepEqual(actual, expected);

      assert.strictEqual(_.isWeakMap(args), false);
      assert.strictEqual(_.isWeakMap([1, 2, 3]), false);
      assert.strictEqual(_.isWeakMap(true), false);
      assert.strictEqual(_.isWeakMap(new Date), false);
      assert.strictEqual(_.isWeakMap(new Error), false);
      assert.strictEqual(_.isWeakMap(_), false);
      assert.strictEqual(_.isWeakMap(Array.prototype.slice), false);
      assert.strictEqual(_.isWeakMap({ 'a': 1 }), false);
      assert.strictEqual(_.isWeakMap(map), false);
      assert.strictEqual(_.isWeakMap(1), false);
      assert.strictEqual(_.isWeakMap(/x/), false);
      assert.strictEqual(_.isWeakMap('a'), false);
      assert.strictEqual(_.isWeakMap(symbol), false);
    });

    QUnit.test('should work for objects with a non-function `constructor` (test in IE 11)', function(assert) {
      assert.expect(1);

      var values = [false, true],
          expected = lodashStable.map(values, stubFalse);

      var actual = lodashStable.map(values, function(value) {
        return _.isWeakMap({ 'constructor': value });
      });

      assert.deepEqual(actual, expected);
    });

    QUnit.test('should work with weak maps from another realm', function(assert) {
      assert.expect(1);

      if (realm.weakMap) {
        assert.strictEqual(_.isWeakMap(realm.weakMap), true);
      }
      else {
        skipAssert(assert);
      }
    });
  }());

  /*--------------------------------------------------------------------------*/
