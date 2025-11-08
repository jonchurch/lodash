/**
 * Extracted from: test/test.js
 * Module: lodash.isNaN
 * Original lines: 11032-11083
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var falsey = require('../utils/fixtures.js').falsey;
var args = require('../utils/helpers.js').args;
var slice = require('../utils/helpers.js').slice;
var symbol = require('../utils/es6.js').symbol;
var skipAssert = require('../utils/helpers.js').skipAssert;
var realm = require('../utils/helpers.js').realm;

QUnit.module('lodash.isNaN');

  (function() {
    QUnit.test('should return `true` for NaNs', function(assert) {
      assert.expect(2);

      assert.strictEqual(_.isNaN(NaN), true);
      assert.strictEqual(_.isNaN(Object(NaN)), true);
    });

    QUnit.test('should return `false` for non-NaNs', function(assert) {
      assert.expect(14);

      var expected = lodashStable.map(falsey, function(value) {
        return value !== value;
      });

      var actual = lodashStable.map(falsey, function(value, index) {
        return index ? _.isNaN(value) : _.isNaN();
      });

      assert.deepEqual(actual, expected);

      assert.strictEqual(_.isNaN(args), false);
      assert.strictEqual(_.isNaN([1, 2, 3]), false);
      assert.strictEqual(_.isNaN(true), false);
      assert.strictEqual(_.isNaN(new Date), false);
      assert.strictEqual(_.isNaN(new Error), false);
      assert.strictEqual(_.isNaN(_), false);
      assert.strictEqual(_.isNaN(slice), false);
      assert.strictEqual(_.isNaN({ 'a': 1 }), false);
      assert.strictEqual(_.isNaN(1), false);
      assert.strictEqual(_.isNaN(Object(1)), false);
      assert.strictEqual(_.isNaN(/x/), false);
      assert.strictEqual(_.isNaN('a'), false);
      assert.strictEqual(_.isNaN(symbol), false);
    });

    QUnit.test('should work with `NaN` from another realm', function(assert) {
      assert.expect(1);

      if (realm.object) {
        assert.strictEqual(_.isNaN(realm.nan), true);
      }
      else {
        skipAssert(assert);
      }
    });
  }());

  /*--------------------------------------------------------------------------*/
