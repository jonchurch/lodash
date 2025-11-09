/**
 * Extracted from: test/test.js
 * Module: lodash.partialRight
 * Original lines: 17493-17512
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');

QUnit.module('lodash.partialRight');

(function () {
  QUnit.test('should work as a deep `_.defaults`', function (assert) {
    assert.expect(1);

    var object = { a: { b: 2 } },
      source = { a: { b: 3, c: 3 } },
      expected = { a: { b: 2, c: 3 } };

    var defaultsDeep = _.partialRight(_.mergeWith, function deep(value, other) {
      return lodashStable.isObject(value) ? _.mergeWith(value, other, deep) : value;
    });

    assert.deepEqual(defaultsDeep(object, source), expected);
  });
})();

/*--------------------------------------------------------------------------*/
