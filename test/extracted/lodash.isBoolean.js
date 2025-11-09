/**
 * Extracted from: test/test.js
 * Module: lodash.isBoolean
 * Original lines: 9154-9205
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var falsey = require('../utils/fixtures.js').falsey;
var args = require('../utils/helpers.js').args;
var symbol = require('../utils/es6.js').symbol;
var realm = require('../utils/helpers.js').realm;
var skipAssert = require('../utils/helpers.js').skipAssert;

QUnit.module('lodash.isBoolean');

  (function() {
    QUnit.test('should return `true` for booleans', function(assert) {
      assert.expect(4);

      assert.strictEqual(_.isBoolean(true), true);
      assert.strictEqual(_.isBoolean(false), true);
      assert.strictEqual(_.isBoolean(Object(true)), true);
      assert.strictEqual(_.isBoolean(Object(false)), true);
    });

    QUnit.test('should return `false` for non-booleans', function(assert) {
      assert.expect(12);

      var expected = lodashStable.map(falsey, function(value) {
        return value === false;
      });

      var actual = lodashStable.map(falsey, function(value, index) {
        return index ? _.isBoolean(value) : _.isBoolean();
      });

      assert.deepEqual(actual, expected);

      assert.strictEqual(_.isBoolean(args), false);
      assert.strictEqual(_.isBoolean([1, 2, 3]), false);
      assert.strictEqual(_.isBoolean(new Date), false);
      assert.strictEqual(_.isBoolean(new Error), false);
      assert.strictEqual(_.isBoolean(_), false);
      assert.strictEqual(_.isBoolean(Array.prototype.slice), false);
      assert.strictEqual(_.isBoolean({ 'a': 1 }), false);
      assert.strictEqual(_.isBoolean(1), false);
      assert.strictEqual(_.isBoolean(/x/), false);
      assert.strictEqual(_.isBoolean('a'), false);
      assert.strictEqual(_.isBoolean(symbol), false);
    });

    QUnit.test('should work with a boolean from another realm', function(assert) {
      assert.expect(1);

      if (realm.boolean) {
        assert.strictEqual(_.isBoolean(realm.boolean), true);
      }
      else {
        skipAssert(assert);
      }
    });
  }());

  /*--------------------------------------------------------------------------*/
