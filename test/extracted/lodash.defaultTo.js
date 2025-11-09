/**
 * Extracted from: test/test.js
 * Module: lodash.defaultTo
 * Original lines: 4730-4749
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var falsey = require('../utils/fixtures.js').falsey;

QUnit.module('lodash.defaultTo');

(function () {
  QUnit.test('should return a default value if `value` is `NaN` or nullish', function (assert) {
    assert.expect(1);

    var expected = lodashStable.map(falsey, function (value) {
      return value == null || value !== value ? 1 : value;
    });

    var actual = lodashStable.map(falsey, function (value) {
      return _.defaultTo(value, 1);
    });

    assert.deepEqual(actual, expected);
  });
})();

/*--------------------------------------------------------------------------*/
