/**
 * Extracted from: test/test.js
 * Module: lodash.now
 * Original lines: 16305-16338
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var stubA = require('../utils/stubs.js').stubA;

QUnit.module('lodash.now');

  (function() {
    QUnit.test('should return the number of milliseconds that have elapsed since the Unix epoch', function(assert) {
      assert.expect(2);

      var done = assert.async();

      var stamp = +new Date,
          actual = _.now();

      assert.ok(actual >= stamp);

      setTimeout(function() {
        assert.ok(_.now() > actual);
        done();
      }, 32);
    });

    QUnit.test('should work with mocked `Date.now`', function(assert) {
      assert.expect(1);

      var now = Date.now;
      Date.now = stubA;

      var actual = _.now();
      Date.now = now;

      assert.strictEqual(actual, 'a');
    });
  }());

  /*--------------------------------------------------------------------------*/
