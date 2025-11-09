/**
 * Extracted from: test/test.js
 * Module: lodash.isArrayBuffer
 * Original lines: 9044-9096
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var falsey = require('../utils/fixtures.js').falsey;
var stubFalse = require('../utils/stubs.js').stubFalse;
var args = require('../utils/helpers.js').args;
var skipAssert = require('../utils/helpers.js').skipAssert;
var symbol = require('../utils/es6.js').symbol;
var arrayBuffer = require('../utils/es6.js').arrayBuffer;
var realm = require('../utils/environment.js').realm;

QUnit.module('lodash.isArrayBuffer');

  (function() {
    QUnit.test('should return `true` for array buffers', function(assert) {
      assert.expect(1);

      if (ArrayBuffer) {
        assert.strictEqual(_.isArrayBuffer(arrayBuffer), true);
      }
      else {
        skipAssert(assert);
      }
    });

    QUnit.test('should return `false` for non array buffers', function(assert) {
      assert.expect(13);

      var expected = lodashStable.map(falsey, stubFalse);

      var actual = lodashStable.map(falsey, function(value, index) {
        return index ? _.isArrayBuffer(value) : _.isArrayBuffer();
      });

      assert.deepEqual(actual, expected);

      assert.strictEqual(_.isArrayBuffer(args), false);
      assert.strictEqual(_.isArrayBuffer([1]), false);
      assert.strictEqual(_.isArrayBuffer(true), false);
      assert.strictEqual(_.isArrayBuffer(new Date), false);
      assert.strictEqual(_.isArrayBuffer(new Error), false);
      assert.strictEqual(_.isArrayBuffer(_), false);
      assert.strictEqual(_.isArrayBuffer(Array.prototype.slice), false);
      assert.strictEqual(_.isArrayBuffer({ 'a': 1 }), false);
      assert.strictEqual(_.isArrayBuffer(1), false);
      assert.strictEqual(_.isArrayBuffer(/x/), false);
      assert.strictEqual(_.isArrayBuffer('a'), false);
      assert.strictEqual(_.isArrayBuffer(symbol), false);
    });

    QUnit.test('should work with array buffers from another realm', function(assert) {
      assert.expect(1);

      if (realm.arrayBuffer) {
        assert.strictEqual(_.isArrayBuffer(realm.arrayBuffer), true);
      }
      else {
        skipAssert(assert);
      }
    });
  }());

  /*--------------------------------------------------------------------------*/
