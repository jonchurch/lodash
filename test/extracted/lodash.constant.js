/**
 * Extracted from: test/test.js
 * Module: lodash.constant
 * Original lines: 3576-3627
 */

var isNpm = require('../utils/environment.js').isNpm;

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var empties = require('../utils/fixtures.js').empties;
var falsey = require('../utils/fixtures.js').falsey;
var stubTrue = require('../utils/stubs.js').stubTrue;
var skipAssert = require('../utils/helpers.js').skipAssert;

QUnit.module('lodash.constant');

(function () {
  QUnit.test('should create a function that returns `value`', function (assert) {
    assert.expect(1);

    var object = { a: 1 },
      values = Array(2).concat(empties, true, 1, 'a'),
      constant = _.constant(object);

    var results = lodashStable.map(values, function (value, index) {
      if (index < 2) {
        return index ? constant.call({}) : constant();
      }
      return constant(value);
    });

    assert.ok(
      lodashStable.every(results, function (result) {
        return result === object;
      })
    );
  });

  QUnit.test('should work with falsey values', function (assert) {
    assert.expect(1);

    var expected = lodashStable.map(falsey, stubTrue);

    var actual = lodashStable.map(falsey, function (value, index) {
      var constant = index ? _.constant(value) : _.constant(),
        result = constant();

      return result === value || (result !== result && value !== value);
    });

    assert.deepEqual(actual, expected);
  });

  QUnit.test('should return a wrapped value when chaining', function (assert) {
    assert.expect(1);

    if (!isNpm) {
      var wrapped = _(true).constant();
      assert.ok(wrapped instanceof _);
    } else {
      skipAssert(assert);
    }
  });
})();

/*--------------------------------------------------------------------------*/
