/**
 * Extracted from: test/test.js
 * Module: lodash.startsWith
 * Original lines: 21240-21300
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var falsey = require('../utils/fixtures.js').falsey;
var stubTrue = require('../utils/stubs.js').stubTrue;
var MAX_SAFE_INTEGER = require('../utils/constants.js').MAX_SAFE_INTEGER;

QUnit.module('lodash.startsWith');

(function () {
  var string = 'abc';

  QUnit.test('should return `true` if a string starts with `target`', function (assert) {
    assert.expect(1);

    assert.strictEqual(_.startsWith(string, 'a'), true);
  });

  QUnit.test('should return `false` if a string does not start with `target`', function (assert) {
    assert.expect(1);

    assert.strictEqual(_.startsWith(string, 'b'), false);
  });

  QUnit.test('should work with a `position`', function (assert) {
    assert.expect(1);

    assert.strictEqual(_.startsWith(string, 'b', 1), true);
  });

  QUnit.test('should work with `position` >= `length`', function (assert) {
    assert.expect(4);

    lodashStable.each([3, 5, MAX_SAFE_INTEGER, Infinity], function (position) {
      assert.strictEqual(_.startsWith(string, 'a', position), false);
    });
  });

  QUnit.test('should treat falsey `position` values as `0`', function (assert) {
    assert.expect(1);

    var expected = lodashStable.map(falsey, stubTrue);

    var actual = lodashStable.map(falsey, function (position) {
      return _.startsWith(string, 'a', position);
    });

    assert.deepEqual(actual, expected);
  });

  QUnit.test('should treat a negative `position` as `0`', function (assert) {
    assert.expect(6);

    lodashStable.each([-1, -3, -Infinity], function (position) {
      assert.strictEqual(_.startsWith(string, 'a', position), true);
      assert.strictEqual(_.startsWith(string, 'b', position), false);
    });
  });

  QUnit.test('should coerce `position` to an integer', function (assert) {
    assert.expect(1);

    assert.strictEqual(_.startsWith(string, 'bc', 1.2), true);
  });
})();

/*--------------------------------------------------------------------------*/
