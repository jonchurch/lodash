/**
 * Extracted from: test/test.js
 * Module: lodash.noConflict
 * Original lines: 16252-16304
 */

var document = require('../utils/environment.js').document;

var root = require('../utils/environment.js').root;

var realm = require('../utils/environment.js').realm;

var isModularize = require('../utils/environment.js').isModularize;

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var skipAssert = require('../utils/helpers.js').skipAssert;

// TODO: figure this tf out
// tbh I still don't know how isModularize works and if oldLodash should even be set
var oldDash = global._

QUnit.module('lodash.noConflict');

  (function() {
    QUnit.test('should return the `lodash` function', function(assert) {
      assert.expect(2);

      if (!isModularize) {
        assert.strictEqual(_.noConflict(), oldDash);
        assert.notStrictEqual(root._, oldDash);
        root._ = oldDash;
      }
      else {
        skipAssert(assert, 2);
      }
    });

    QUnit.test('should restore `_` only if `lodash` is the current `_` value', function(assert) {
      assert.expect(2);

      if (!isModularize) {
        var object = root._ = {};
        assert.strictEqual(_.noConflict(), oldDash);
        assert.strictEqual(root._, object);
        root._ = oldDash;
      }
      else {
        skipAssert(assert, 2);
      }
    });

    QUnit.test('should work with a `root` of `this`', function(assert) {
      assert.expect(2);

      if (!coverage && !document && !isModularize && realm.object) {
        var fs = require('fs'),
            vm = require('vm'),
            expected = {},
            context = vm.createContext({ '_': expected, 'console': console }),
            source = fs.readFileSync(filePath, 'utf8');

        vm.runInContext(source + '\nthis.lodash = this._.noConflict()', context);

        assert.strictEqual(context._, expected);
        assert.ok(context.lodash);
      }
      else {
        skipAssert(assert, 2);
      }
    });
  }());

  /*--------------------------------------------------------------------------*/
