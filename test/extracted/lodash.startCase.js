/**
 * Extracted from: test/test.js
 * Module: lodash.startCase
 * Original lines: 21226-21239
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');

QUnit.module('lodash.startCase');

  (function() {
    QUnit.test('should uppercase only the first character of each word', function(assert) {
      assert.expect(3);

      assert.strictEqual(_.startCase('--foo-bar--'), 'Foo Bar');
      assert.strictEqual(_.startCase('fooBar'), 'Foo Bar');
      assert.strictEqual(_.startCase('__FOO_BAR__'), 'FOO BAR');
    });
  }());

  /*--------------------------------------------------------------------------*/
