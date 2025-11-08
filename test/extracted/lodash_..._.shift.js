/**
 * Extracted from: test/test.js
 * Module: lodash(...).shift
 * Original lines: 26293-26338
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var falsey = require('../utils/fixtures.js').falsey;
var stubTrue = require('../utils/stubs.js').stubTrue;
var skipAssert = require('../utils/helpers.js').skipAssert;

QUnit.module('lodash(...).shift');

  (function() {
    QUnit.test('should remove elements from the front of `array`', function(assert) {
      assert.expect(5);

      if (!isNpm) {
        var array = [1, 2],
            wrapped = _(array);

        assert.strictEqual(wrapped.shift(), 1);
        assert.deepEqual(wrapped.value(), [2]);
        assert.strictEqual(wrapped.shift(), 2);

        var actual = wrapped.value();
        assert.strictEqual(actual, array);
        assert.deepEqual(actual, []);
      }
      else {
        skipAssert(assert, 5);
      }
    });

    QUnit.test('should accept falsey arguments', function(assert) {
      assert.expect(1);

      if (!isNpm) {
        var expected = lodashStable.map(falsey, stubTrue);

        var actual = lodashStable.map(falsey, function(value, index) {
          try {
            var result = index ? _(value).shift() : _().shift();
            return result === undefined;
          } catch (e) {}
        });

        assert.deepEqual(actual, expected);
      }
      else {
        skipAssert(assert);
      }
    });
  }());

  /*--------------------------------------------------------------------------*/
