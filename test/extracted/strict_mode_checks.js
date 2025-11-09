/**
 * Extracted from: test/test.js
 * Module: strict mode checks
 * Original lines: 5662-5684
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var isStrict = require('../utils/environment.js').isStrict;

QUnit.module('strict mode checks');

lodashStable.each(
  ['assign', 'assignIn', 'bindAll', 'defaults', 'defaultsDeep', 'merge'],
  function (methodName) {
    var func = _[methodName],
      isBindAll = methodName == 'bindAll';

    QUnit.test(
      '`_.' + methodName + '` should ' + (isStrict ? '' : 'not ') + 'throw strict mode errors',
      function (assert) {
        assert.expect(1);

        var object = Object.freeze({ a: undefined, b: function () {} }),
          pass = !isStrict;

        try {
          func(object, isBindAll ? 'b' : { a: 1 });
        } catch (e) {
          pass = !pass;
        }
        assert.ok(pass);
      }
    );
  }
);

/*--------------------------------------------------------------------------*/
