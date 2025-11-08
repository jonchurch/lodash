/**
 * Extracted from: test/test.js
 * Module: lodash.toPairs
 * Original lines: 23806-23817
 */
  QUnit.module('lodash.toPairs');

  (function() {
    QUnit.test('should be aliased', function(assert) {
      assert.expect(1);

      assert.strictEqual(_.entries, _.toPairs);
    });
  }());

  /*--------------------------------------------------------------------------*/
