/**
 * Extracted from: test/test.js
 * Module: lodash.isSet
 * Original lines: 11650-11716
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var falsey = require('../utils/fixtures.js').falsey;
var stubFalse = require('../utils/stubs.js').stubFalse;
var skipAssert = require('../utils/helpers.js').skipAssert;
var args = require('../utils/helpers.js').args;
var symbol = require('../utils/es6.js').symbol;
var set = require('../utils/es6.js').set;
var weakSet = require('../utils/es6.js').weakSet;
var realm = require('../utils/helpers.js').realm;

QUnit.module('lodash.isSet');

  (function() {
    QUnit.test('should return `true` for sets', function(assert) {
      assert.expect(1);

      if (Set) {
        assert.strictEqual(_.isSet(set), true);
      }
      else {
        skipAssert(assert);
      }
    });

    QUnit.test('should return `false` for non-sets', function(assert) {
      assert.expect(14);

      var expected = lodashStable.map(falsey, stubFalse);

      var actual = lodashStable.map(falsey, function(value, index) {
        return index ? _.isSet(value) : _.isSet();
      });

      assert.deepEqual(actual, expected);

      assert.strictEqual(_.isSet(args), false);
      assert.strictEqual(_.isSet([1, 2, 3]), false);
      assert.strictEqual(_.isSet(true), false);
      assert.strictEqual(_.isSet(new Date), false);
      assert.strictEqual(_.isSet(new Error), false);
      assert.strictEqual(_.isSet(_), false);
      assert.strictEqual(_.isSet(slice), false);
      assert.strictEqual(_.isSet({ 'a': 1 }), false);
      assert.strictEqual(_.isSet(1), false);
      assert.strictEqual(_.isSet(/x/), false);
      assert.strictEqual(_.isSet('a'), false);
      assert.strictEqual(_.isSet(symbol), false);
      assert.strictEqual(_.isSet(weakSet), false);
    });

    QUnit.test('should work for objects with a non-function `constructor` (test in IE 11)', function(assert) {
      assert.expect(1);

      var values = [false, true],
          expected = lodashStable.map(values, stubFalse);

      var actual = lodashStable.map(values, function(value) {
        return _.isSet({ 'constructor': value });
      });

      assert.deepEqual(actual, expected);
    });

    QUnit.test('should work with weak sets from another realm', function(assert) {
      assert.expect(1);

      if (realm.set) {
        assert.strictEqual(_.isSet(realm.set), true);
      }
      else {
        skipAssert(assert);
      }
    });
  }());

  /*--------------------------------------------------------------------------*/
