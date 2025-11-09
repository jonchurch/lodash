/**
 * Helper functions for testing, extracted from test/test.js
 */

import lodashStable from 'lodash'
import _ from '../../lodash.js'

/**
 * Converts `array` to an `arguments` object.
 *
 * @param {Array} array The array to convert.
 * @returns {Object} Returns the converted `arguments` object.
 */
export function toArgs(array) {
  return (function() { return arguments; }.apply(undefined, array));
}

/** Standard arguments object. */
export const args = toArgs([1, 2, 3]);

/** Strict mode arguments object. */
export const strictArgs = (function() { 'use strict'; return arguments; }(1, 2, 3));

/**
 * Custom error class for testing.
 */
export class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CustomError';
  }
}

/**
 * Removes all own enumerable string keyed properties from a given object.
 *
 * @param {Object} object The object to empty.
 */
export function emptyObject(object) {
  Object.keys(object).forEach(key => {
    delete object[key];
  });
}

/**
 * Sets a non-enumerable property value on `object`.
 *
 * @param {Object} object The object to modify.
 * @param {string} key The name of the property to set.
 * @param {*} value The property value.
 * @returns {Object} Returns `object`.
 */
export function setProperty(object, key, value) {
  try {
    Object.defineProperty(object, key, {
      configurable: true,
      enumerable: false,
      writable: true,
      value: value
    });
  } catch (e) {
    object[key] = value;
  }
  return object;
}

/**
 * Skips a given number of tests with a passing result.
 * Note: This is QUnit-specific and may need adaptation for other test runners.
 *
 * @param {Object} assert The QUnit assert object.
 * @param {number} [count=1] The number of tests to skip.
 */
export function skipAssert(assert, count = 1) {
  while (count--) {
    assert.ok(true, 'test skipped');
  }
}

/**
 * Extracts the unwrapped value from its wrapper.
 *
 * @private
 * @param {Object} wrapper The wrapper to unwrap.
 * @returns {*} Returns the unwrapped value.
 */
export function getUnwrappedValue(wrapper) {
  var index = -1,
    actions = wrapper.__actions__,
    length = actions.length,
    result = wrapper.__wrapped__;

  while (++index < length) {
    var args = [result],
      action = actions[index];

    Array.prototype.push.apply(args, action.args);
    result = action.func.apply(action.thisArg, args);
  }
  return result;
}

  /** Used to test pseudo private map caches. */
  export const mapCaches = (function() {
    var MapCache = (_.memoize || lodashStable.memoize).Cache;
    var result = {
      'Hash': new MapCache().__data__.hash.constructor,
      'MapCache': MapCache
    };
    (_.isMatchWith || lodashStable.isMatchWith)({ 'a': 1 }, { 'a': 1 }, function() {
      var stack = lodashStable.last(arguments);
      result.ListCache = stack.__data__.constructor;
      result.Stack = stack.constructor;
    });
    return result;
  }());

