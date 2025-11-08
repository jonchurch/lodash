/**
 * Extracted from: test/test.js
 * Module: lodash.pullAll
 * Original lines: 18255-18269
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');

QUnit.module('lodash.pullAll');

  (function() {
    QUnit.test('should work with the same value for `array` and `values`', function(assert) {
      assert.expect(1);

      var array = [{ 'a': 1 }, { 'b': 2 }],
          actual = _.pullAll(array, array);

      assert.deepEqual(actual, []);
    });
  }());

  /*--------------------------------------------------------------------------*/
