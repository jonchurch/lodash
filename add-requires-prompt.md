# Task: Add require() statements to extracted QUnit test file

## Goal
Add the necessary `require()` statements to the top of a QUnit test file while keeping all other code unchanged.

## Instructions

1. **Read the test file** you're working on
2. **Analyze what dependencies it uses** by scanning for variable references
3. **Add require() statements** at the top (after the frontmatter comment)
4. **Keep everything else exactly the same** - QUnit.module, QUnit.test, IIFE wrappers, assertions, etc.

## Always Required

Every test file needs these two:
```javascript
var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
```

## Common Dependencies

Scan the file content and add requires for any variables referenced:

### lodashStable
If the file contains `lodashStable`:
```javascript
var lodashStable = require('lodash');
```

### Fixtures (from test/utils/fixtures.js)
```javascript
var falsey = require('../utils/fixtures.js').falsey;
var empties = require('../utils/fixtures.js').empties;
var primitives = require('../utils/fixtures.js').primitives;
var errors = require('../utils/fixtures.js').errors;
var typedArrays = require('../utils/fixtures.js').typedArrays;
var arrayViews = require('../utils/fixtures.js').arrayViews;
```

### Stubs (from test/utils/stubs.js)
```javascript
var stubA = require('../utils/stubs.js').stubA;
var stubB = require('../utils/stubs.js').stubB;
var stubC = require('../utils/stubs.js').stubC;
var stubTrue = require('../utils/stubs.js').stubTrue;
var stubFalse = require('../utils/stubs.js').stubFalse;
var stubNaN = require('../utils/stubs.js').stubNaN;
var stubNull = require('../utils/stubs.js').stubNull;
var stubZero = require('../utils/stubs.js').stubZero;
var stubOne = require('../utils/stubs.js').stubOne;
var stubTwo = require('../utils/stubs.js').stubTwo;
var stubThree = require('../utils/stubs.js').stubThree;
var stubFour = require('../utils/stubs.js').stubFour;
var stubArray = require('../utils/stubs.js').stubArray;
var stubObject = require('../utils/stubs.js').stubObject;
var stubString = require('../utils/stubs.js').stubString;
var add = require('../utils/stubs.js').add;
var doubled = require('../utils/stubs.js').doubled;
var isEven = require('../utils/stubs.js').isEven;
var square = require('../utils/stubs.js').square;
var identity = require('../utils/stubs.js').identity;
var noop = require('../utils/stubs.js').noop;
```

### Helpers (from test/utils/helpers.js)
```javascript
var toArgs = require('../utils/helpers.js').toArgs;
var args = require('../utils/helpers.js').args;
var strictArgs = require('../utils/helpers.js').strictArgs;
var CustomError = require('../utils/helpers.js').CustomError;
var emptyObject = require('../utils/helpers.js').emptyObject;
var setProperty = require('../utils/helpers.js').setProperty;
var skipAssert = require('../utils/helpers.js').skipAssert;
```

### Constants (from test/utils/constants.js)
```javascript
var HOT_COUNT = require('../utils/constants.js').HOT_COUNT;
var LARGE_ARRAY_SIZE = require('../utils/constants.js').LARGE_ARRAY_SIZE;
var FUNC_ERROR_TEXT = require('../utils/constants.js').FUNC_ERROR_TEXT;
var MAX_MEMOIZE_SIZE = require('../utils/constants.js').MAX_MEMOIZE_SIZE;
var MAX_SAFE_INTEGER = require('../utils/constants.js').MAX_SAFE_INTEGER;
var MAX_INTEGER = require('../utils/constants.js').MAX_INTEGER;
var MAX_ARRAY_LENGTH = require('../utils/constants.js').MAX_ARRAY_LENGTH;
var MAX_ARRAY_INDEX = require('../utils/constants.js').MAX_ARRAY_INDEX;
```

### Unicode (from test/utils/unicode.js)
```javascript
var burredLetters = require('../utils/unicode.js').burredLetters;
var comboMarks = require('../utils/unicode.js').comboMarks;
var deburredLetters = require('../utils/unicode.js').deburredLetters;
var emojiVar = require('../utils/unicode.js').emojiVar;
var fitzModifiers = require('../utils/unicode.js').fitzModifiers;
var whitespace = require('../utils/unicode.js').whitespace;
```

### ES6 (from test/utils/es6.js)
```javascript
var map = require('../utils/es6.js').map;
var set = require('../utils/es6.js').set;
var weakMap = require('../utils/es6.js').weakMap;
var weakSet = require('../utils/es6.js').weakSet;
var symbol = require('../utils/es6.js').symbol;
var promise = require('../utils/es6.js').promise;
var arrayBuffer = require('../utils/es6.js').arrayBuffer;
```

## Example Transformations

### Before (lodash.add.js):
```javascript
/**
 * Extracted from: test/test.js
 * Module: lodash.add
 * Original lines: 1169-1189
 */
  QUnit.module('lodash.add');

  (function() {
    QUnit.test('should add two numbers', function(assert) {
      assert.expect(3);
      assert.strictEqual(_.add(6, 4), 10);
      // ...
    });
  }());
```

### After:
```javascript
/**
 * Extracted from: test/test.js
 * Module: lodash.add
 * Original lines: 1169-1189
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');

QUnit.module('lodash.add');

(function() {
  QUnit.test('should add two numbers', function(assert) {
    assert.expect(3);
    assert.strictEqual(_.add(6, 4), 10);
    // ...
  });
}());
```

### Before (lodash.chunk.js - uses fixtures):
```javascript
/**
 * Extracted from: test/test.js
 * Module: lodash.chunk
 * Original lines: 2535-2596
 */
  QUnit.module('lodash.chunk');

  (function() {
    var array = [0, 1, 2, 3, 4, 5];

    QUnit.test('should treat falsey `size` values, except `undefined`, as `0`', function(assert) {
      var expected = lodashStable.map(falsey, function(value) {
        return value === undefined ? [[0], [1], [2], [3], [4], [5]] : [];
      });
      // uses: lodashStable, falsey, stubArray
    });
  }());
```

### After:
```javascript
/**
 * Extracted from: test/test.js
 * Module: lodash.chunk
 * Original lines: 2535-2596
 */

var QUnit = require('qunitjs');
var _ = require('../../lodash.js');
var lodashStable = require('lodash');
var falsey = require('../utils/fixtures.js').falsey;
var stubArray = require('../utils/stubs.js').stubArray;

QUnit.module('lodash.chunk');

(function() {
  var array = [0, 1, 2, 3, 4, 5];

  QUnit.test('should treat falsey `size` values, except `undefined`, as `0`', function(assert) {
    var expected = lodashStable.map(falsey, function(value) {
      return value === undefined ? [[0], [1], [2], [3], [4], [5]] : [];
    });
    // uses: lodashStable, falsey, stubArray
  });
}());
```

## Important Rules

1. **Only add blank line after frontmatter comment** before requires
2. **Do not remove the IIFE wrapper** `(function() { }())`
3. **Do not change QUnit.module or QUnit.test** - keep them exactly as-is
4. **Do not change any assertions or test logic**
5. **Only add requires for variables actually used** in the file
6. **Always add QUnit and _ requires** even if not explicitly visible (they're always needed)

## Your Task

You will be given a file path. Read that file, analyze its dependencies, add the appropriate require() statements, and write the updated file back.

Be thorough in scanning for all referenced variables!
