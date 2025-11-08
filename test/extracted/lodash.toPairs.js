/**
 * Extracted from: test/test.js
 * Module: lodash.toPairs
 * Original lines: 23806-23817
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');

QUnit.module('lodash.toPairs');

  (function() {
    QUnit.test('should be aliased', function(assert) {
      assert.expect(1);

      assert.strictEqual(_.entries, _.toPairs);
    });
  }());

  /*--------------------------------------------------------------------------*/
