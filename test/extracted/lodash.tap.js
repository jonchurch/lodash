/**
 * Extracted from: test/test.js
 * Module: lodash.tap
 * Original lines: 22082-22128
 */

var isNpm = require('../utils/environment.js').isNpm;

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var skipAssert = require('../utils/helpers.js').skipAssert;

QUnit.module('lodash.tap');

(function () {
  QUnit.test('should intercept and return the given value', function (assert) {
    assert.expect(2);

    if (!isNpm) {
      var intercepted,
        array = [1, 2, 3];

      var actual = _.tap(array, function (value) {
        intercepted = value;
      });

      assert.strictEqual(actual, array);
      assert.strictEqual(intercepted, array);
    } else {
      skipAssert(assert, 2);
    }
  });

  QUnit.test(
    'should intercept unwrapped values and return wrapped values when chaining',
    function (assert) {
      assert.expect(2);

      if (!isNpm) {
        var intercepted,
          array = [1, 2, 3];

        var wrapped = _(array).tap(function (value) {
          intercepted = value;
          value.pop();
        });

        assert.ok(wrapped instanceof _);

        wrapped.value();
        assert.strictEqual(intercepted, array);
      } else {
        skipAssert(assert, 2);
      }
    }
  );
})();

/*--------------------------------------------------------------------------*/
