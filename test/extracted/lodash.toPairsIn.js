/**
 * Extracted from: test/test.js
 * Module: lodash.toPairsIn
 * Original lines: 23818-23829
 */
  QUnit.module('lodash.toPairsIn');

  (function() {
    QUnit.test('should be aliased', function(assert) {
      assert.expect(1);

      assert.strictEqual(_.entriesIn, _.toPairsIn);
    });
  }());

  /*--------------------------------------------------------------------------*/
