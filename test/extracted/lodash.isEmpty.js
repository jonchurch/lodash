/**
 * Extracted from: test/test.js
 * Module: lodash.isEmpty
 * Original lines: 9380-9531
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var empties = require('../utils/fixtures.js').empties;
var stubTrue = require('../utils/stubs.js').stubTrue;
var symbol = require('../utils/es6.js').symbol;
var skipAssert = require('../utils/helpers.js').skipAssert;
var args = require('../utils/helpers.js').args;
var arrayProto = require('../utils/helpers.js').arrayProto;
var realm = require('../utils/helpers.js').realm;
var MAX_SAFE_INTEGER = require('../utils/constants.js').MAX_SAFE_INTEGER;
var isNpm = require('../utils/helpers.js').isNpm;

QUnit.module('lodash.isEmpty');

  (function() {
    QUnit.test('should return `true` for empty values', function(assert) {
      assert.expect(10);

      var expected = lodashStable.map(empties, stubTrue),
          actual = lodashStable.map(empties, _.isEmpty);

      assert.deepEqual(actual, expected);

      assert.strictEqual(_.isEmpty(true), true);
      assert.strictEqual(_.isEmpty(slice), true);
      assert.strictEqual(_.isEmpty(1), true);
      assert.strictEqual(_.isEmpty(NaN), true);
      assert.strictEqual(_.isEmpty(/x/), true);
      assert.strictEqual(_.isEmpty(symbol), true);
      assert.strictEqual(_.isEmpty(), true);

      if (Buffer) {
        assert.strictEqual(_.isEmpty(new Buffer(0)), true);
        assert.strictEqual(_.isEmpty(new Buffer(1)), false);
      }
      else {
        skipAssert(assert, 2);
      }
    });

    QUnit.test('should return `false` for non-empty values', function(assert) {
      assert.expect(3);

      assert.strictEqual(_.isEmpty([0]), false);
      assert.strictEqual(_.isEmpty({ 'a': 0 }), false);
      assert.strictEqual(_.isEmpty('a'), false);
    });

    QUnit.test('should work with an object that has a `length` property', function(assert) {
      assert.expect(1);

      assert.strictEqual(_.isEmpty({ 'length': 0 }), false);
    });

    QUnit.test('should work with `arguments` objects', function(assert) {
      assert.expect(1);

      assert.strictEqual(_.isEmpty(args), false);
    });

    QUnit.test('should work with prototytpe objects', function(assert) {
      assert.expect(2);

      function Foo() {}
      Foo.prototype = { 'constructor': Foo };

      assert.strictEqual(_.isEmpty(Foo.prototype), true);

      Foo.prototype.a = 1;
      assert.strictEqual(_.isEmpty(Foo.prototype), false);
    });

    QUnit.test('should work with jQuery/MooTools DOM query collections', function(assert) {
      assert.expect(1);

      function Foo(elements) {
        push.apply(this, elements);
      }
      Foo.prototype = { 'length': 0, 'splice': arrayProto.splice };

      assert.strictEqual(_.isEmpty(new Foo([])), true);
    });

    QUnit.test('should work with maps', function(assert) {
      assert.expect(4);

      if (Map) {
        lodashStable.each([new Map, realm.map], function(map) {
          assert.strictEqual(_.isEmpty(map), true);
          map.set('a', 1);
          assert.strictEqual(_.isEmpty(map), false);
          map.clear();
        });
      }
      else {
        skipAssert(assert, 4);
      }
    });

    QUnit.test('should work with sets', function(assert) {
      assert.expect(4);

      if (Set) {
        lodashStable.each([new Set, realm.set], function(set) {
          assert.strictEqual(_.isEmpty(set), true);
          set.add(1);
          assert.strictEqual(_.isEmpty(set), false);
          set.clear();
        });
      }
      else {
        skipAssert(assert, 4);
      }
    });

    QUnit.test('should not treat objects with negative lengths as array-like', function(assert) {
      assert.expect(1);

      function Foo() {}
      Foo.prototype.length = -1;

      assert.strictEqual(_.isEmpty(new Foo), true);
    });

    QUnit.test('should not treat objects with lengths larger than `MAX_SAFE_INTEGER` as array-like', function(assert) {
      assert.expect(1);

      function Foo() {}
      Foo.prototype.length = MAX_SAFE_INTEGER + 1;

      assert.strictEqual(_.isEmpty(new Foo), true);
    });

    QUnit.test('should not treat objects with non-number lengths as array-like', function(assert) {
      assert.expect(1);

      assert.strictEqual(_.isEmpty({ 'length': '0' }), false);
    });

    QUnit.test('should return an unwrapped value when implicitly chaining', function(assert) {
      assert.expect(1);

      if (!isNpm) {
        assert.strictEqual(_({}).isEmpty(), true);
      }
      else {
        skipAssert(assert);
      }
    });

    QUnit.test('should return a wrapped value when explicitly chaining', function(assert) {
      assert.expect(1);

      if (!isNpm) {
        assert.ok(_({}).chain().isEmpty() instanceof _);
      }
      else {
        skipAssert(assert);
      }
    });
  }());

  /*--------------------------------------------------------------------------*/
