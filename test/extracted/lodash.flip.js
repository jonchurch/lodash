/**
 * Extracted from: test/test.js
 * Module: lodash.flip
 * Original lines: 6375-6391
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var slice = require('../utils/helpers.js').slice;

QUnit.module('lodash.flip');

  (function() {
    function fn() {
      return Array.prototype.slice.call(arguments);
    }

    QUnit.test('should flip arguments provided to `func`', function(assert) {
      assert.expect(1);

      var flipped = _.flip(fn);
      assert.deepEqual(flipped('a', 'b', 'c', 'd'), ['d', 'c', 'b', 'a']);
    });
  }());

  /*--------------------------------------------------------------------------*/
