/**
 * Extracted from: test/test.js
 * Module: lodash.uniq
 * Original lines: 24943-24957
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');

QUnit.module('lodash.uniq');

  (function() {
    QUnit.test('should perform an unsorted uniq when used as an iteratee for methods like `_.map`', function(assert) {
      assert.expect(1);

      var array = [[2, 1, 2], [1, 2, 1]],
          actual = lodashStable.map(array, lodashStable.uniq);

      assert.deepEqual(actual, [[2, 1], [1, 2]]);
    });
  }());

  /*--------------------------------------------------------------------------*/
