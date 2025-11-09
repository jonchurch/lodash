/**
 * Extracted from: test/test.js
 * Module: lodash.mapKeys and lodash.mapValues
 * Original lines: 13722-13765
 */

var isNpm = require('../utils/environment.js').isNpm;

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var falsey = require('../utils/fixtures.js').falsey;
var stubObject = require('../utils/stubs.js').stubObject;
var noop = require('../utils/stubs.js').noop;
var skipAssert = require('../utils/helpers.js').skipAssert;

QUnit.module('lodash.mapKeys and lodash.mapValues');

lodashStable.each(['mapKeys', 'mapValues'], function (methodName) {
  var func = _[methodName],
    object = { a: 1, b: 2 };

  QUnit.test(
    '`_.' + methodName + '` should iterate over own string keyed properties of objects',
    function (assert) {
      assert.expect(1);

      function Foo() {
        this.a = 'a';
      }
      Foo.prototype.b = 'b';

      var actual = func(new Foo(), function (value, key) {
        return key;
      });
      assert.deepEqual(actual, { a: 'a' });
    }
  );

  QUnit.test('`_.' + methodName + '` should accept a falsey `object`', function (assert) {
    assert.expect(1);

    var expected = lodashStable.map(falsey, stubObject);

    var actual = lodashStable.map(falsey, function (object, index) {
      try {
        return index ? func(object) : func();
      } catch (e) {}
    });

    assert.deepEqual(actual, expected);
  });

  QUnit.test(
    '`_.' + methodName + '` should return a wrapped value when chaining',
    function (assert) {
      assert.expect(1);

      if (!isNpm) {
        assert.ok(_(object)[methodName](noop) instanceof _);
      } else {
        skipAssert(assert);
      }
    }
  );
});
