/**
 * Extracted from: test/test.js
 * Module: lodash.conforms
 * Original lines: 3388-3406
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');

QUnit.module('lodash.conforms');

(function () {
  QUnit.test('should not change behavior if `source` is modified', function (assert) {
    assert.expect(2);

    var object = { a: 2 },
      source = {
        a: function (value) {
          return value > 1;
        },
      },
      par = _.conforms(source);

    assert.strictEqual(par(object), true);

    source.a = function (value) {
      return value < 2;
    };
    assert.strictEqual(par(object), true);
  });
})();

/*--------------------------------------------------------------------------*/
