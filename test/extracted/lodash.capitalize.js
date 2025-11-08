/**
 * Extracted from: test/test.js
 * Module: lodash.capitalize
 * Original lines: 2390-2403
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');

QUnit.module('lodash.capitalize');

  (function() {
    QUnit.test('should capitalize the first character of a string', function(assert) {
      assert.expect(3);

      assert.strictEqual(_.capitalize('fred'), 'Fred');
      assert.strictEqual(_.capitalize('Fred'), 'Fred');
      assert.strictEqual(_.capitalize(' fred'), ' fred');
    });
  }());

  /*--------------------------------------------------------------------------*/
