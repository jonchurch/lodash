/**
 * Environment detection and global references for Node.js test environment
 * Extracted from test/test.js preamble
 */

/** Used as a reference to the global object. */
exports.root = (typeof global == 'object' && global) || this;

/**
 * Detect if testing npm per-function modules (e.g., require('lodash.chunk')).
 *
 * When `true`: Testing npm modular distribution where wrapper/chaining behavior
 * is disabled. Per-function modules like `require('lodash.chunk')` or
 * `require('lodash/chunk')` don't support the `_()` wrapper for implicit chaining.
 * Tests that rely on wrapper behavior (e.g., `_([1,2,3]).map(...).value()`)
 * should be skipped when `isNpm === true`.
 *
 * When `false`: Testing the full lodash build (../../lodash.js) where all
 * wrapper/chaining functionality is available.
 *
 * Current setting: `false` - we're testing the full build with chaining enabled.
 */
exports.isNpm = false;

/** Detect if testing a modularized build (amd, commonjs, es modules, etc.) */
exports.isModularize = false;

/** Detect if running in PhantomJS environment */
exports.isPhantom = false;

/** Detect if lodash is in strict mode */
exports.isStrict = false;

/** Browser/DOM references (undefined in Node.js) */
exports.document = undefined;
exports.body = undefined;
exports.amd = undefined;

/** Cross-realm testing object */
exports.realm = {};

/** Process references */
exports.argv = process ? process.argv : undefined;

/** Lodash reference for testing bad extensions/shims */
exports.lodashBizarro = exports.root.lodashBizarro;

/** Async/generator function references (if available) */
exports.asyncFunc = (async function() {});
exports.genFunc = (function*() {});

/** Coverage reference (for test runners) */
exports.coverage = undefined;

/** XML reference (browser-specific) */
exports.xml = undefined;

