/**
 * Extracted from: test/test.js
 * Module: lodash.pickBy
 * Original lines: 17847-17873
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var stubTrue = require('../utils/stubs.js').stubTrue;

QUnit.module('lodash.pickBy');

(function () {
  QUnit.test('should work with a predicate argument', function (assert) {
    assert.expect(1);

    var object = { a: 1, b: 2, c: 3, d: 4 };

    var actual = _.pickBy(object, function (n) {
      return n == 1 || n == 3;
    });

    assert.deepEqual(actual, { a: 1, c: 3 });
  });

  QUnit.test('should not treat keys with dots as deep paths', function (assert) {
    assert.expect(1);

    var object = { 'a.b.c': 1 },
      actual = _.pickBy(object, stubTrue);

    assert.deepEqual(actual, { 'a.b.c': 1 });
  });
})();

/*--------------------------------------------------------------------------*/
