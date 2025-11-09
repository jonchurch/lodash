/**
 * Extracted from: test/test.js
 * Module: lodash.runInContext
 * Original lines: 19929-19971
 */

var isModularize = require('../utils/environment.js').isModularize;

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var skipAssert = require('../utils/helpers.js').skipAssert;

QUnit.module('lodash.runInContext');

(function () {
  QUnit.test('should not require a fully populated `context` object', function (assert) {
    assert.expect(1);

    if (!isModularize) {
      var lodash = _.runInContext({
        setTimeout: function (func) {
          func();
        },
      });

      var pass = false;
      lodash.delay(function () {
        pass = true;
      }, 32);
      assert.ok(pass);
    } else {
      skipAssert(assert);
    }
  });

  QUnit.test('should use a zeroed `_.uniqueId` counter', function (assert) {
    assert.expect(3);

    if (!isModularize) {
      lodashStable.times(2, _.uniqueId);

      var oldId = Number(_.uniqueId()),
        lodash = _.runInContext();

      assert.ok(_.uniqueId() > oldId);

      var id = lodash.uniqueId();
      assert.strictEqual(id, '1');
      assert.ok(id < oldId);
    } else {
      skipAssert(assert, 3);
    }
  });
})();

/*--------------------------------------------------------------------------*/
