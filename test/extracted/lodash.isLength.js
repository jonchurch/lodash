/**
 * Extracted from: test/test.js
 * Module: lodash.isLength
 * Original lines: 10786-10811
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var MAX_SAFE_INTEGER = require('../utils/constants.js').MAX_SAFE_INTEGER;
var stubTrue = require('../utils/stubs.js').stubTrue;
var stubFalse = require('../utils/stubs.js').stubFalse;

QUnit.module('lodash.isLength');

  (function() {
    QUnit.test('should return `true` for lengths', function(assert) {
      assert.expect(1);

      var values = [0, 3, MAX_SAFE_INTEGER],
          expected = lodashStable.map(values, stubTrue),
          actual = lodashStable.map(values, _.isLength);

      assert.deepEqual(actual, expected);
    });

    QUnit.test('should return `false` for non-lengths', function(assert) {
      assert.expect(1);

      var values = [-1, '1', 1.1, MAX_SAFE_INTEGER + 1],
          expected = lodashStable.map(values, stubFalse),
          actual = lodashStable.map(values, _.isLength);

      assert.deepEqual(actual, expected);
    });
  }());

  /*--------------------------------------------------------------------------*/
