/**
 * Extracted from: test/test.js
 * Module: lodash.xorWith
 * Original lines: 25775-25790
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');

QUnit.module('lodash.xorWith');

(function () {
  QUnit.test('should work with a `comparator`', function (assert) {
    assert.expect(1);

    var objects = [
        { x: 1, y: 2 },
        { x: 2, y: 1 },
      ],
      others = [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ],
      actual = _.xorWith(objects, others, lodashStable.isEqual);

    assert.deepEqual(actual, [objects[1], others[0]]);
  });
})();

/*--------------------------------------------------------------------------*/
