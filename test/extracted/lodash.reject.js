/**
 * Extracted from: test/test.js
 * Module: lodash.reject
 * Original lines: 19044-19057
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var isEven = require('../utils/stubs.js').isEven;

QUnit.module('lodash.reject');

  (function() {
    var array = [1, 2, 3];

    QUnit.test('should return elements the `predicate` returns falsey for', function(assert) {
      assert.expect(1);

      assert.deepEqual(_.reject(array, isEven), [1, 3]);
    });
  }());

  /*--------------------------------------------------------------------------*/
