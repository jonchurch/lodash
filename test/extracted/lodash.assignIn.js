/**
 * Extracted from: test/test.js
 * Module: lodash.assignIn
 * Original lines: 1340-1351
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');

QUnit.module('lodash.assignIn');

  (function() {
    QUnit.test('should be aliased', function(assert) {
      assert.expect(1);

      assert.strictEqual(_.extend, _.assignIn);
    });
  }());

  /*--------------------------------------------------------------------------*/
