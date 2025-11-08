/**
 * Extracted from: test/test.js
 * Module: lodash.multiply
 * Original lines: 16008-16028
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');

QUnit.module('lodash.multiply');

  (function() {
    QUnit.test('should multiply two numbers', function(assert) {
      assert.expect(3);

      assert.strictEqual(_.multiply(6, 4), 24);
      assert.strictEqual(_.multiply(-6, 4), -24);
      assert.strictEqual(_.multiply(-6, -4), 24);
    });

    QUnit.test('should coerce arguments to numbers', function(assert) {
      assert.expect(2);

      assert.strictEqual(_.multiply('6', '4'), 24);
      assert.deepEqual(_.multiply('x', 'y'), NaN);
    });
  }());

  /*--------------------------------------------------------------------------*/
