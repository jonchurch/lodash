/**
 * Extracted from: test/test.js
 * Module: forIn methods
 * Original lines: 6817-6837
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');

QUnit.module('forIn methods');

lodashStable.each(['forIn', 'forInRight'], function (methodName) {
  var func = _[methodName];

  QUnit.test(
    '`_.' + methodName + '` iterates over inherited string keyed properties',
    function (assert) {
      assert.expect(1);

      function Foo() {
        this.a = 1;
      }
      Foo.prototype.b = 2;

      var keys = [];
      func(new Foo(), function (value, key) {
        keys.push(key);
      });
      assert.deepEqual(keys.sort(), ['a', 'b']);
    }
  );
});

/*--------------------------------------------------------------------------*/
