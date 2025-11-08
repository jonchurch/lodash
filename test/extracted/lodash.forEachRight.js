/**
 * Extracted from: test/test.js
 * Module: lodash.forEachRight
 * Original lines: 6805-6816
 */
  QUnit.module('lodash.forEachRight');

  (function() {
    QUnit.test('should be aliased', function(assert) {
      assert.expect(1);

      assert.strictEqual(_.eachRight, _.forEachRight);
    });
  }());

  /*--------------------------------------------------------------------------*/
