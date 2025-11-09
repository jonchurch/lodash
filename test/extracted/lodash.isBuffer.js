/**
 * Extracted from: test/test.js
 * Module: lodash.isBuffer
 * Original lines: 9206-9258
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var falsey = require('../utils/fixtures.js').falsey;
var stubFalse = require('../utils/stubs.js').stubFalse;
var skipAssert = require('../utils/helpers.js').skipAssert;
var args = require('../utils/helpers.js').args;
var symbol = require('../utils/es6.js').symbol;
var isStrict = require('../utils/helpers.js').isStrict;
var lodashBizarro = require('../utils/environment.js').lodashBizarro;

QUnit.module('lodash.isBuffer');

(function () {
  QUnit.test('should return `true` for buffers', function (assert) {
    assert.expect(1);

    if (Buffer) {
      assert.strictEqual(_.isBuffer(new Buffer(2)), true);
    } else {
      skipAssert(assert);
    }
  });

  QUnit.test('should return `false` for non-buffers', function (assert) {
    assert.expect(13);

    var expected = lodashStable.map(falsey, stubFalse);

    var actual = lodashStable.map(falsey, function (value, index) {
      return index ? _.isBuffer(value) : _.isBuffer();
    });

    assert.deepEqual(actual, expected);

    assert.strictEqual(_.isBuffer(args), false);
    assert.strictEqual(_.isBuffer([1]), false);
    assert.strictEqual(_.isBuffer(true), false);
    assert.strictEqual(_.isBuffer(new Date()), false);
    assert.strictEqual(_.isBuffer(new Error()), false);
    assert.strictEqual(_.isBuffer(_), false);
    assert.strictEqual(_.isBuffer(Array.prototype.slice), false);
    assert.strictEqual(_.isBuffer({ a: 1 }), false);
    assert.strictEqual(_.isBuffer(1), false);
    assert.strictEqual(_.isBuffer(/x/), false);
    assert.strictEqual(_.isBuffer('a'), false);
    assert.strictEqual(_.isBuffer(symbol), false);
  });

  QUnit.test('should return `false` if `Buffer` is not defined', function (assert) {
    assert.expect(1);

    if (!isStrict && Buffer && lodashBizarro) {
      assert.strictEqual(lodashBizarro.isBuffer(new Buffer(2)), false);
    } else {
      skipAssert(assert);
    }
  });
})();

/*--------------------------------------------------------------------------*/
