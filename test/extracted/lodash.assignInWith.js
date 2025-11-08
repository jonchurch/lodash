/**
 * Extracted from: test/test.js
 * Module: lodash.assignInWith
 * Original lines: 1455-1466
 */
  QUnit.module('lodash.assignInWith');

  (function() {
    QUnit.test('should be aliased', function(assert) {
      assert.expect(1);

      assert.strictEqual(_.extendWith, _.assignInWith);
    });
  }());

  /*--------------------------------------------------------------------------*/
