/**
 * Extracted from: test/test.js
 * Module: lodash.isFinite
 * Original lines: 10579-10634
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var args = require('../utils/helpers.js').args;
var stubTrue = require('../utils/stubs.js').stubTrue;
var stubFalse = require('../utils/stubs.js').stubFalse;
var symbol = require('../utils/es6.js').symbol;

QUnit.module('lodash.isFinite');

(function () {
  QUnit.test('should return `true` for finite values', function (assert) {
    assert.expect(1);

    var values = [0, 1, 3.14, -1],
      expected = lodashStable.map(values, stubTrue),
      actual = lodashStable.map(values, _.isFinite);

    assert.deepEqual(actual, expected);
  });

  QUnit.test('should return `false` for non-finite values', function (assert) {
    assert.expect(1);

    var values = [NaN, Infinity, -Infinity, Object(1)],
      expected = lodashStable.map(values, stubFalse),
      actual = lodashStable.map(values, _.isFinite);

    assert.deepEqual(actual, expected);
  });

  QUnit.test('should return `false` for non-numeric values', function (assert) {
    assert.expect(10);

    var values = [undefined, [], true, '', ' ', '2px'],
      expected = lodashStable.map(values, stubFalse),
      actual = lodashStable.map(values, _.isFinite);

    assert.deepEqual(actual, expected);

    assert.strictEqual(_.isFinite(args), false);
    assert.strictEqual(_.isFinite([1, 2, 3]), false);
    assert.strictEqual(_.isFinite(true), false);
    assert.strictEqual(_.isFinite(new Date()), false);
    assert.strictEqual(_.isFinite(new Error()), false);
    assert.strictEqual(_.isFinite({ a: 1 }), false);
    assert.strictEqual(_.isFinite(/x/), false);
    assert.strictEqual(_.isFinite('a'), false);
    assert.strictEqual(_.isFinite(symbol), false);
  });

  QUnit.test('should return `false` for numeric string values', function (assert) {
    assert.expect(1);

    var values = ['2', '0', '08'],
      expected = lodashStable.map(values, stubFalse),
      actual = lodashStable.map(values, _.isFinite);

    assert.deepEqual(actual, expected);
  });
})();

/*--------------------------------------------------------------------------*/
