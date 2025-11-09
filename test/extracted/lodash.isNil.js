/**
 * Extracted from: test/test.js
 * Module: lodash.isNil
 * Original lines: 11183-11241
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var falsey = require('../utils/fixtures.js').falsey;
var args = require('../utils/helpers.js').args;
var symbol = require('../utils/es6.js').symbol;
var skipAssert = require('../utils/helpers.js').skipAssert;
var realm = require('../utils/environment.js').realm;

QUnit.module('lodash.isNil');

(function () {
  QUnit.test('should return `true` for nullish values', function (assert) {
    assert.expect(3);

    assert.strictEqual(_.isNil(null), true);
    assert.strictEqual(_.isNil(), true);
    assert.strictEqual(_.isNil(undefined), true);
  });

  QUnit.test('should return `false` for non-nullish values', function (assert) {
    assert.expect(13);

    var expected = lodashStable.map(falsey, function (value) {
      return value == null;
    });

    var actual = lodashStable.map(falsey, function (value, index) {
      return index ? _.isNil(value) : _.isNil();
    });

    assert.deepEqual(actual, expected);

    assert.strictEqual(_.isNil(args), false);
    assert.strictEqual(_.isNil([1, 2, 3]), false);
    assert.strictEqual(_.isNil(true), false);
    assert.strictEqual(_.isNil(new Date()), false);
    assert.strictEqual(_.isNil(new Error()), false);
    assert.strictEqual(_.isNil(_), false);
    assert.strictEqual(_.isNil(Array.prototype.slice), false);
    assert.strictEqual(_.isNil({ a: 1 }), false);
    assert.strictEqual(_.isNil(1), false);
    assert.strictEqual(_.isNil(/x/), false);
    assert.strictEqual(_.isNil('a'), false);

    if (Symbol) {
      assert.strictEqual(_.isNil(symbol), false);
    } else {
      skipAssert(assert);
    }
  });

  QUnit.test('should work with nils from another realm', function (assert) {
    assert.expect(2);

    if (realm.object) {
      assert.strictEqual(_.isNil(realm.null), true);
      assert.strictEqual(_.isNil(realm.undefined), true);
    } else {
      skipAssert(assert, 2);
    }
  });
})();

/*--------------------------------------------------------------------------*/
