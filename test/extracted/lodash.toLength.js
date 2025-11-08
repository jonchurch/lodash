/**
 * Extracted from: test/test.js
 * Module: lodash.toLength
 * Original lines: 23503-23531
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var MAX_INTEGER = require('../utils/constants.js').MAX_INTEGER;
var MAX_ARRAY_LENGTH = require('../utils/constants.js').MAX_ARRAY_LENGTH;

QUnit.module('lodash.toLength');

  (function() {
    QUnit.test('should return a valid length', function(assert) {
      assert.expect(4);

      assert.strictEqual(_.toLength(-1), 0);
      assert.strictEqual(_.toLength('1'), 1);
      assert.strictEqual(_.toLength(1.1), 1);
      assert.strictEqual(_.toLength(MAX_INTEGER), MAX_ARRAY_LENGTH);
    });

    QUnit.test('should return `value` if a valid length', function(assert) {
      assert.expect(3);

      assert.strictEqual(_.toLength(0), 0);
      assert.strictEqual(_.toLength(3), 3);
      assert.strictEqual(_.toLength(MAX_ARRAY_LENGTH), MAX_ARRAY_LENGTH);
    });

    QUnit.test('should convert `-0` to `0`', function(assert) {
      assert.expect(1);

      assert.strictEqual(1 / _.toLength(-0), Infinity);
    });
  }());

  /*--------------------------------------------------------------------------*/
