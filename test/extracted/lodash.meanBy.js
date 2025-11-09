/**
 * Extracted from: test/test.js
 * Module: lodash.meanBy
 * Original lines: 14620-14657
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var slice = require('../utils/helpers.js').slice;

QUnit.module('lodash.meanBy');

(function() {
  var objects = [{ 'a': 2 }, { 'a': 3 }, { 'a': 1 }];

  QUnit.test('should work with an `iteratee`', function(assert) {
    assert.expect(1);

    var actual = _.meanBy(objects, function(object) {
      return object.a;
    });

    assert.deepEqual(actual, 2);
  });

  QUnit.test('should provide correct `iteratee` arguments', function(assert) {
    assert.expect(1);

    var args;

    _.meanBy(objects, function() {
      args || (args = Array.prototype.slice.call(arguments));
    });

    assert.deepEqual(args, [{ 'a': 2 }]);
  });

  QUnit.test('should work with `_.property` shorthands', function(assert) {
    assert.expect(2);

    var arrays = [[2], [3], [1]];
    assert.strictEqual(_.meanBy(arrays, 0), 2);
    assert.strictEqual(_.meanBy(objects, 'a'), 2);
  });
}());

  /*--------------------------------------------------------------------------*/
