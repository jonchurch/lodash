/**
 * Extracted from: test/test.js
 * Module: lodash.castArray
 * Original lines: 2404-2432
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var falsey = require('../utils/fixtures.js').falsey;

QUnit.module('lodash.castArray');

  (function() {
    QUnit.test('should wrap non-array items in an array', function(assert) {
      assert.expect(1);

      var values = falsey.concat(true, 1, 'a', { 'a': 1 }),
          expected = lodashStable.map(values, function(value) { return [value]; }),
          actual = lodashStable.map(values, _.castArray);

      assert.deepEqual(actual, expected);
    });

    QUnit.test('should return array values by reference', function(assert) {
      assert.expect(1);

      var array = [1];
      assert.strictEqual(_.castArray(array), array);
    });

    QUnit.test('should return an empty array when no arguments are given', function(assert) {
      assert.expect(1);

      assert.deepEqual(_.castArray(), []);
    });
  }());

  /*--------------------------------------------------------------------------*/
