/**
 * Extracted from: test/test.js
 * Module: lodash.identity
 * Original lines: 8158-8170
 */
  QUnit.module('lodash.identity');

  (function() {
    QUnit.test('should return the first argument given', function(assert) {
      assert.expect(1);

      var object = { 'name': 'fred' };
      assert.strictEqual(_.identity(object), object);
    });
  }());

  /*--------------------------------------------------------------------------*/
