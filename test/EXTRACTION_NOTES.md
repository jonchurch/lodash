# Test Extraction Lab Notes

## Test Structure

- `QUnit.module()` acts like `describe()` blocks - groups related tests
- Each module typically wrapped in IIFE: `(function() { ... }())`
- Modules separated by `/*----------*/` delimiters

so we just yanked them out via text parsing, using the `extract-tests.js` script

## Extraction Results

- **Total modules extracted**: 305
- **Lodash method modules**: 230 (e.g., `lodash.chunk`, `lodash.map`)
- **Helper/group modules**: 75 (e.g., `clone_methods`, `isIndex`)
- **Source**: test/test.js (27,078 lines)
- **Output**: test/extracted/ (305 files with frontmatter)

## QUnit Assertion Usage

Ran: `grep -oE "assert\.\w+" /Users/jon/Spoons/lodash/test/test.js | sort | uniq -c | sort -rn`

Output:
```
1745 assert.expect
1508 assert.strictEqual
1440 assert.deepEqual
 169 assert.ok
  51 assert.notOk
  39 assert.async
  33 assert.notStrictEqual
   7 assert.notEqual
   5 assert.raises
   2 assert.equal
```

**Most common**: `expect`, `strictEqual`, `deepEqual`

## Key QUnit vs Node Assert Differences

1. **`deepEqual`**: QUnit compares own + inherited properties; Node only own enumerable
2. **`strictEqual`**: Node uses `Object.is()` (NaN, -0 edge cases differ)
4. **`expect(n)`**: QUnit validates assertion count; Node has no equivalent

## Keep QUnit Assertions?

EDIT: Well we cannot use QUnit assertions outside the QUnit context it seems, so we are gonna have to migrate the assertions at the same time. Bummer

~To avoid subtle behavioral drift, plan to keep using QUnit's assertion library for now as an intermediate step. Hopefully we can just run the tests with those existing assertions as a sanity check, before moving on to swapping the assertion library.~

## Shared Dependencies to Extract

All tests depend on variables from test.js preamble:
- `_` - lodash being tested
- `lodashStable` - stable reference version
- `falsey`, `args`, `strictArgs` - test fixtures
- `stubArray`, `stubTrue`, `stubFalse` - stub functions
- `burredLetters`, `deburredLetters` - Unicode data
- `MAX_SAFE_INTEGER`, `LARGE_ARRAY_SIZE` - constants
- etc.

## Next Steps

1. Extract shared fixtures/utilities to separate file
2. Choose test framework (Vitest/Jest/Node test runner)
3. Write transformation script for mechanical changes
4. Handle edge cases (dynamic method selection patterns)
