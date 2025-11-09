/**
 * Extracted from: test/test.js
 * Module: lodash.mean
 * Original lines: 14598-14619
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var empties = require('../utils/fixtures.js').empties;
var stubNaN = require('../utils/stubs.js').stubNaN;

QUnit.module('lodash.mean');

(function () {
  QUnit.test('should return the mean of an array of numbers', function (assert) {
    assert.expect(1);

    var array = [4, 2, 8, 6];
    assert.strictEqual(_.mean(array), 5);
  });

  QUnit.test('should return `NaN` when passing empty `array` values', function (assert) {
    assert.expect(1);

    var expected = lodashStable.map(empties, stubNaN),
      actual = lodashStable.map(empties, _.mean);

    assert.deepEqual(actual, expected);
  });
})();

/*--------------------------------------------------------------------------*/
