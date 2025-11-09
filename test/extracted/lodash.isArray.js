/**
 * Extracted from: test/test.js
 * Module: lodash.isArray
 * Original lines: 8997-9043
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var falsey = require('../utils/fixtures.js').falsey;
var stubFalse = require('../utils/stubs.js').stubFalse;
var args = require('../utils/helpers.js').args;
var symbol = require('../utils/es6.js').symbol;
var skipAssert = require('../utils/helpers.js').skipAssert;
var realm = require('../utils/environment.js').realm;

QUnit.module('lodash.isArray');

  (function() {
    QUnit.test('should return `true` for arrays', function(assert) {
      assert.expect(1);

      assert.strictEqual(_.isArray([1, 2, 3]), true);
    });

    QUnit.test('should return `false` for non-arrays', function(assert) {
      assert.expect(12);

      var expected = lodashStable.map(falsey, stubFalse);

      var actual = lodashStable.map(falsey, function(value, index) {
        return index ? _.isArray(value) : _.isArray();
      });

      assert.deepEqual(actual, expected);

      assert.strictEqual(_.isArray(args), false);
      assert.strictEqual(_.isArray(true), false);
      assert.strictEqual(_.isArray(new Date), false);
      assert.strictEqual(_.isArray(new Error), false);
      assert.strictEqual(_.isArray(_), false);
      assert.strictEqual(_.isArray(Array.prototype.slice), false);
      assert.strictEqual(_.isArray({ '0': 1, 'length': 1 }), false);
      assert.strictEqual(_.isArray(1), false);
      assert.strictEqual(_.isArray(/x/), false);
      assert.strictEqual(_.isArray('a'), false);
      assert.strictEqual(_.isArray(symbol), false);
    });

    QUnit.test('should work with an array from another realm', function(assert) {
      assert.expect(1);

      if (realm.array) {
        assert.strictEqual(_.isArray(realm.array), true);
      }
      else {
        skipAssert(assert);
      }
    });
  }());

  /*--------------------------------------------------------------------------*/
