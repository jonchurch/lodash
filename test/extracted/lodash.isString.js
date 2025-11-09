/**
 * Extracted from: test/test.js
 * Module: lodash.isString
 * Original lines: 11717-11766
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var falsey = require('../utils/fixtures.js').falsey;
var args = require('../utils/helpers.js').args;
var symbol = require('../utils/es6.js').symbol;
var realm = require('../utils/realm.js');
var skipAssert = require('../utils/helpers.js').skipAssert;

QUnit.module('lodash.isString');

  (function() {
    QUnit.test('should return `true` for strings', function(assert) {
      assert.expect(2);

      assert.strictEqual(_.isString('a'), true);
      assert.strictEqual(_.isString(Object('a')), true);
    });

    QUnit.test('should return `false` for non-strings', function(assert) {
      assert.expect(12);

      var expected = lodashStable.map(falsey, function(value) {
        return value === '';
      });

      var actual = lodashStable.map(falsey, function(value, index) {
        return index ? _.isString(value) : _.isString();
      });

      assert.deepEqual(actual, expected);

      assert.strictEqual(_.isString(args), false);
      assert.strictEqual(_.isString([1, 2, 3]), false);
      assert.strictEqual(_.isString(true), false);
      assert.strictEqual(_.isString(new Date), false);
      assert.strictEqual(_.isString(new Error), false);
      assert.strictEqual(_.isString(_), false);
      assert.strictEqual(_.isString(Array.prototype.slice), false);
      assert.strictEqual(_.isString({ '0': 1, 'length': 1 }), false);
      assert.strictEqual(_.isString(1), false);
      assert.strictEqual(_.isString(/x/), false);
      assert.strictEqual(_.isString(symbol), false);
    });

    QUnit.test('should work with strings from another realm', function(assert) {
      assert.expect(1);

      if (realm.string) {
        assert.strictEqual(_.isString(realm.string), true);
      }
      else {
        skipAssert(assert);
      }
    });
  }());

  /*--------------------------------------------------------------------------*/
