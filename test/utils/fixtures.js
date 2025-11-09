/**
 * Test fixture data extracted from test/test.js
 */

/** Used to provide falsey values to methods. */
export const falsey = [, null, undefined, false, 0, NaN, ''];

/** Used to provide empty values to methods. */
export const empties = [[], {}].concat(falsey.slice(1));

/** Used to provide primitive values to methods. */
export const primitives = [null, undefined, false, true, 1, NaN, 'a'];

/** Used to test error objects. */
export const errors = [
  new Error(),
  new EvalError(),
  new RangeError(),
  new ReferenceError(),
  new SyntaxError(),
  new TypeError(),
  new URIError(),
];

/** Used to check whether methods support typed arrays. */
export const typedArrays = [
  'Float32Array',
  'Float64Array',
  'Int8Array',
  'Int16Array',
  'Int32Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'Uint16Array',
  'Uint32Array',
];

/** Used to check whether methods support array views. */
export const arrayViews = typedArrays.concat('DataView');
