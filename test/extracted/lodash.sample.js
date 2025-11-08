/**
 * Extracted from: test/test.js
 * Module: lodash.sample
 * Original lines: 19972-20009
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var empties = require('../utils/fixtures.js').empties;
var noop = require('../utils/stubs.js').noop;

QUnit.module('lodash.sample');

  (function() {
    var array = [1, 2, 3];

    QUnit.test('should return a random element', function(assert) {
      assert.expect(1);

      var actual = _.sample(array);
      assert.ok(lodashStable.includes(array, actual));
    });

    QUnit.test('should return `undefined` when sampling empty collections', function(assert) {
      assert.expect(1);

      var expected = lodashStable.map(empties, noop);

      var actual = lodashStable.transform(empties, function(result, value) {
        try {
          result.push(_.sample(value));
        } catch (e) {}
      });

      assert.deepEqual(actual, expected);
    });

    QUnit.test('should sample an object', function(assert) {
      assert.expect(1);

      var object = { 'a': 1, 'b': 2, 'c': 3 },
          actual = _.sample(object);

      assert.ok(lodashStable.includes(array, actual));
    });
  }());

  /*--------------------------------------------------------------------------*/
