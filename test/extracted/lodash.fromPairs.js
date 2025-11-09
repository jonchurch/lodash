/**
 * Extracted from: test/test.js
 * Module: lodash.fromPairs
 * Original lines: 7601-7661
 */

var isNpm = require('../utils/environment.js').isNpm;

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var falsey = require('../utils/fixtures.js').falsey;
var stubObject = require('../utils/stubs.js').stubObject;
var LARGE_ARRAY_SIZE = require('../utils/constants.js').LARGE_ARRAY_SIZE;
var isEven = require('../utils/stubs.js').isEven;
var square = require('../utils/stubs.js').square;
var skipAssert = require('../utils/helpers.js').skipAssert;

QUnit.module('lodash.fromPairs');

(function () {
  QUnit.test('should accept a two dimensional array', function (assert) {
    assert.expect(1);

    var array = [
        ['a', 1],
        ['b', 2],
      ],
      object = { a: 1, b: 2 },
      actual = _.fromPairs(array);

    assert.deepEqual(actual, object);
  });

  QUnit.test('should accept a falsey `array`', function (assert) {
    assert.expect(1);

    var expected = lodashStable.map(falsey, stubObject);

    var actual = lodashStable.map(falsey, function (array, index) {
      try {
        return index ? _.fromPairs(array) : _.fromPairs();
      } catch (e) {}
    });

    assert.deepEqual(actual, expected);
  });

  QUnit.test('should not support deep paths', function (assert) {
    assert.expect(1);

    var actual = _.fromPairs([['a.b', 1]]);
    assert.deepEqual(actual, { 'a.b': 1 });
  });

  QUnit.test('should support consuming the return value of `_.toPairs`', function (assert) {
    assert.expect(1);

    var object = { 'a.b': 1 };
    assert.deepEqual(_.fromPairs(_.toPairs(object)), object);
  });

  QUnit.test('should work in a lazy sequence', function (assert) {
    assert.expect(1);

    if (!isNpm) {
      var array = lodashStable.times(LARGE_ARRAY_SIZE, function (index) {
        return ['key' + index, index];
      });

      var actual = _(array).fromPairs().map(square).filter(isEven).take().value();

      assert.deepEqual(actual, _.take(_.filter(_.map(_.fromPairs(array), square), isEven)));
    } else {
      skipAssert(assert);
    }
  });
})();

/*--------------------------------------------------------------------------*/
