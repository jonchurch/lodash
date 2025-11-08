/**
 * Extracted from: test/test.js
 * Module: lodash.forEach
 * Original lines: 6793-6804
 */
  QUnit.module('lodash.forEach');

  (function() {
    QUnit.test('should be aliased', function(assert) {
      assert.expect(1);

      assert.strictEqual(_.each, _.forEach);
    });
  }());

  /*--------------------------------------------------------------------------*/
