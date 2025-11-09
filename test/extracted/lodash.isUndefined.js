/**
 * Extracted from: test/test.js
 * Module: lodash.isUndefined
 * Original lines: 11888-11944
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var args = require('../utils/helpers.js').args;
var falsey = require('../utils/fixtures.js').falsey;
var realm = require('../utils/helpers.js').realm;
var skipAssert = require('../utils/helpers.js').skipAssert;
var symbol = require('../utils/es6.js').symbol;

QUnit.module('lodash.isUndefined');

  (function() {
    QUnit.test('should return `true` for `undefined` values', function(assert) {
      assert.expect(2);

      assert.strictEqual(_.isUndefined(), true);
      assert.strictEqual(_.isUndefined(undefined), true);
    });

    QUnit.test('should return `false` for non `undefined` values', function(assert) {
      assert.expect(13);

      var expected = lodashStable.map(falsey, function(value) {
        return value === undefined;
      });

      var actual = lodashStable.map(falsey, function(value, index) {
        return index ? _.isUndefined(value) : _.isUndefined();
      });

      assert.deepEqual(actual, expected);

      assert.strictEqual(_.isUndefined(args), false);
      assert.strictEqual(_.isUndefined([1, 2, 3]), false);
      assert.strictEqual(_.isUndefined(true), false);
      assert.strictEqual(_.isUndefined(new Date), false);
      assert.strictEqual(_.isUndefined(new Error), false);
      assert.strictEqual(_.isUndefined(_), false);
      assert.strictEqual(_.isUndefined(Array.prototype.slice), false);
      assert.strictEqual(_.isUndefined({ 'a': 1 }), false);
      assert.strictEqual(_.isUndefined(1), false);
      assert.strictEqual(_.isUndefined(/x/), false);
      assert.strictEqual(_.isUndefined('a'), false);

      if (Symbol) {
        assert.strictEqual(_.isUndefined(symbol), false);
      }
      else {
        skipAssert(assert);
      }
    });

    QUnit.test('should work with `undefined` from another realm', function(assert) {
      assert.expect(1);

      if (realm.object) {
        assert.strictEqual(_.isUndefined(realm.undefined), true);
      }
      else {
        skipAssert(assert);
      }
    });
  }());

  /*--------------------------------------------------------------------------*/
