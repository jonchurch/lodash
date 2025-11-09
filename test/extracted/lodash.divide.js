/**
 * Extracted from: test/test.js
 * Module: lodash.divide
 * Original lines: 5054-5074
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');

QUnit.module('lodash.divide');

(function () {
  QUnit.test('should divide two numbers', function (assert) {
    assert.expect(3);

    assert.strictEqual(_.divide(6, 4), 1.5);
    assert.strictEqual(_.divide(-6, 4), -1.5);
    assert.strictEqual(_.divide(-6, -4), 1.5);
  });

  QUnit.test('should coerce arguments to numbers', function (assert) {
    assert.expect(2);

    assert.strictEqual(_.divide('6', '4'), 1.5);
    assert.deepEqual(_.divide('x', 'y'), NaN);
  });
})();

/*--------------------------------------------------------------------------*/
