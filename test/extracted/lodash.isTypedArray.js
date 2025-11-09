/**
 * Extracted from: test/test.js
 * Module: lodash.isTypedArray
 * Original lines: 11820-11887
 */

var realm = require('../utils/environment.js').realm;

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var typedArrays = require('../utils/fixtures.js').typedArrays;
var falsey = require('../utils/fixtures.js').falsey;
var stubFalse = require('../utils/stubs.js').stubFalse;
var args = require('../utils/helpers.js').args;
var skipAssert = require('../utils/helpers.js').skipAssert;
var symbol = require('../utils/es6.js').symbol;

QUnit.module('lodash.isTypedArray');

  (function() {
    QUnit.test('should return `true` for typed arrays', function(assert) {
      assert.expect(1);

      var expected = lodashStable.map(typedArrays, function(type) {
        return type in root;
      });

      var actual = lodashStable.map(typedArrays, function(type) {
        var Ctor = root[type];
        return Ctor ? _.isTypedArray(new Ctor(new ArrayBuffer(8))) : false;
      });

      assert.deepEqual(actual, expected);
    });

    QUnit.test('should return `false` for non typed arrays', function(assert) {
      assert.expect(13);

      var expected = lodashStable.map(falsey, stubFalse);

      var actual = lodashStable.map(falsey, function(value, index) {
        return index ? _.isTypedArray(value) : _.isTypedArray();
      });

      assert.deepEqual(actual, expected);

      assert.strictEqual(_.isTypedArray(args), false);
      assert.strictEqual(_.isTypedArray([1, 2, 3]), false);
      assert.strictEqual(_.isTypedArray(true), false);
      assert.strictEqual(_.isTypedArray(new Date), false);
      assert.strictEqual(_.isTypedArray(new Error), false);
      assert.strictEqual(_.isTypedArray(_), false);
      assert.strictEqual(_.isTypedArray(Array.prototype.slice), false);
      assert.strictEqual(_.isTypedArray({ 'a': 1 }), false);
      assert.strictEqual(_.isTypedArray(1), false);
      assert.strictEqual(_.isTypedArray(/x/), false);
      assert.strictEqual(_.isTypedArray('a'), false);
      assert.strictEqual(_.isTypedArray(symbol), false);
    });

    QUnit.test('should work with typed arrays from another realm', function(assert) {
      assert.expect(1);

      if (realm.object) {
        var props = lodashStable.invokeMap(typedArrays, 'toLowerCase');

        var expected = lodashStable.map(props, function(key) {
          return realm[key] !== undefined;
        });

        var actual = lodashStable.map(props, function(key) {
          var value = realm[key];
          return value ? _.isTypedArray(value) : false;
        });

        assert.deepEqual(actual, expected);
      }
      else {
        skipAssert(assert);
      }
    });
  }());

  /*--------------------------------------------------------------------------*/
