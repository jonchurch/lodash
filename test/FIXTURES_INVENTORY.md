# Test Fixtures Inventory

Analysis of test.js preamble (lines 1-700~) to identify what needs to be extracted.

## Constants (test/utils/constants.js)

```javascript
export const HOT_COUNT = 150;
export const LARGE_ARRAY_SIZE = 200;
export const FUNC_ERROR_TEXT = 'Expected a function';
export const MAX_MEMOIZE_SIZE = 500;
export const MAX_SAFE_INTEGER = 9007199254740991;
export const MAX_INTEGER = 1.7976931348623157e+308;
export const MAX_ARRAY_LENGTH = 4294967295;
export const MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1;
```

## Object Tags (test/utils/tags.js)

```javascript
export const funcTag = '[object Function]';
export const numberTag = '[object Number]';
export const objectTag = '[object Object]';
```

## Prototypes (test/utils/prototypes.js)

```javascript
export const arrayProto = Array.prototype;
export const funcProto = Function.prototype;
export const objectProto = Object.prototype;
export const numberProto = Number.prototype;
export const stringProto = String.prototype;
```

## Test Data Arrays (test/utils/fixtures.js)

```javascript
// Falsey values
export const falsey = [, null, undefined, false, 0, NaN, ''];

// Empty values
export const empties = [[], {}].concat(falsey.slice(1));

// Primitive values
export const primitives = [null, undefined, false, true, 1, NaN, 'a'];

// Error objects
export const errors = [
  new Error,
  new EvalError,
  new RangeError,
  new ReferenceError,
  new SyntaxError,
  new TypeError,
  new URIError
];

// Typed arrays
export const typedArrays = [
  'Float32Array', 'Float64Array',
  'Int8Array', 'Int16Array', 'Int32Array',
  'Uint8Array', 'Uint8ClampedArray', 'Uint16Array', 'Uint32Array'
];

// Array views
export const arrayViews = typedArrays.concat('DataView');
```

## Unicode Data (test/utils/unicode.js)

```javascript
// Latin Unicode letters (burredLetters - 128 characters)
// Combining diacritical marks (comboMarks - 144 characters)
// Converted Latin letters (deburredLetters - 128 characters)
// Emoji variant selector
export const emojiVar = '\ufe0f';
// Fitzpatrick modifiers (skin tones)
export const fitzModifiers = ['\ud83c\udffb', ...];
// Whitespace characters
export const whitespace = ' \t\n\r...';
```

## ES6 Feature Instances (test/utils/es6.js)

```javascript
export const map = Map ? new Map : undefined;
export const set = Set ? new Set : undefined;
export const weakMap = WeakMap ? new WeakMap : undefined;
export const weakSet = WeakSet ? new WeakSet : undefined;
export const symbol = Symbol ? Symbol('a') : undefined;
export const promise = Promise ? Promise.resolve(1) : undefined;
export const arrayBuffer = ArrayBuffer ? new ArrayBuffer(2) : undefined;
```

## Stub Functions (test/utils/stubs.js)

```javascript
// Letter stubs
export const stubA = () => 'a';
export const stubB = () => 'b';
export const stubC = () => 'c';

// Boolean stubs
export const stubTrue = () => true;
export const stubFalse = () => false;

// Value stubs
export const stubNaN = () => NaN;
export const stubNull = () => null;
export const stubZero = () => 0;
export const stubOne = () => 1;
export const stubTwo = () => 2;
export const stubThree = () => 3;
export const stubFour = () => 4;

// Object stubs
export const stubArray = () => [];
export const stubObject = () => {};
export const stubString = () => '';

// Math helpers
export const add = (x, y) => x + y;
export const doubled = (n) => n * 2;
export const isEven = (n) => n % 2 == 0;
export const square = (n) => n * n;

// Identity and noop
export const identity = (value) => value;
export const noop = () => {};
```

## Helper Functions (test/utils/helpers.js)

```javascript
// Convert array to arguments object
export function toArgs(array) {
  return (function() { return arguments; }.apply(undefined, array));
}

// Create strict mode arguments
export const args = toArgs([1, 2, 3]);
export const strictArgs = (function() { 'use strict'; return arguments; }(1, 2, 3));

// Custom error class
export class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CustomError';
  }
}

// Empty object helper
export function emptyObject(object) {
  Object.keys(object).forEach(key => delete object[key]);
}

// Skip assert helper (QUnit-specific, may need adaptation)
export function skipAssert(assert, count = 1) {
  while (count--) {
    assert.ok(true, 'test skipped');
  }
}

// Set property helper
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
```

## Special Test Setup (probably skip for now)

- `lodashBizarro` - Bizarro world lodash with shimmed/broken methods
- `realm` - Cross-realm objects from vm/iframe
- `mapCaches` - Internal cache structures
- `asyncFunc`, `genFunc` - Async/generator function constructors
- PhantomJS/browser-specific setup

## Recommended File Structure

```
test/utils/
├── constants.js       - Numeric constants
├── fixtures.js        - Test data arrays (falsey, primitives, etc.)
├── stubs.js          - Stub functions
├── helpers.js        - Helper functions (toArgs, args, strictArgs, etc.)
├── unicode.js        - Unicode test data (burredLetters, etc.)
├── es6.js            - ES6 feature instances (Map, Symbol, etc.)
├── tags.js           - Object.toString tags
└── prototypes.js     - Prototype references
```

## Next Steps

1. Start with most commonly used: `constants.js`, `fixtures.js`, `stubs.js`, `helpers.js`
2. Add `unicode.js` and `es6.js` as needed
3. Skip browser/PhantomJS-specific setup for Node test runner migration
