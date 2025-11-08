/**
 * Extracted from: test/test.js
 * Module: lodash.toLower
 * Original lines: 23394-23407
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');

QUnit.module('lodash.toLower');

  (function() {
    QUnit.test('should convert whole string to lower case', function(assert) {
      assert.expect(3);

      assert.deepEqual(_.toLower('--Foo-Bar--'), '--foo-bar--');
      assert.deepEqual(_.toLower('fooBar'), 'foobar');
      assert.deepEqual(_.toLower('__FOO_BAR__'), '__foo_bar__');
    });
  }());

  /*--------------------------------------------------------------------------*/
