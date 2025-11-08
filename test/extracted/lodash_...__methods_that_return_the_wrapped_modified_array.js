/**
 * Extracted from: test/test.js
 * Module: lodash(...) methods that return the wrapped modified array
 * Original lines: 26529-26559
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var skipAssert = require('../utils/helpers.js').skipAssert;

QUnit.module('lodash(...) methods that return the wrapped modified array');

  (function() {
    var funcs = [
      'push',
      'reverse',
      'sort',
      'unshift'
    ];

    lodashStable.each(funcs, function(methodName) {
      QUnit.test('`_(...).' + methodName + '` should return a new wrapper', function(assert) {
        assert.expect(2);

        if (!isNpm) {
          var array = [1, 2, 3],
              wrapped = _(array),
              actual = wrapped[methodName]();

          assert.ok(actual instanceof _);
          assert.notStrictEqual(actual, wrapped);
        }
        else {
          skipAssert(assert, 2);
        }
      });
    });
  }());

  /*--------------------------------------------------------------------------*/
