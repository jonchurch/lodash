/**
 * Extracted from: test/test.js
 * Module: lodash(...).push
 * Original lines: 26251-26292
 */

var isNpm = require('../utils/environment.js').isNpm;

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var falsey = require('../utils/fixtures.js').falsey;
var stubTrue = require('../utils/stubs.js').stubTrue;
var skipAssert = require('../utils/helpers.js').skipAssert;

QUnit.module('lodash(...).push');

  (function() {
    QUnit.test('should append elements to `array`', function(assert) {
      assert.expect(2);

      if (!isNpm) {
        var array = [1],
            wrapped = _(array).push(2, 3),
            actual = wrapped.value();

        assert.strictEqual(actual, array);
        assert.deepEqual(actual, [1, 2, 3]);
      }
      else {
        skipAssert(assert, 2);
      }
    });

    QUnit.test('should accept falsey arguments', function(assert) {
      assert.expect(1);

      if (!isNpm) {
        var expected = lodashStable.map(falsey, stubTrue);

        var actual = lodashStable.map(falsey, function(value, index) {
          try {
            var result = index ? _(value).push(1).value() : _().push(1).value();
            return lodashStable.eq(result, value);
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
