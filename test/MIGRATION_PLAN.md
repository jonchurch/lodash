# Test Migration Plan

## Goal
Migrate 305 extracted QUnit test modules to Node test runner with individual files.

## Pass Strategy

Each pass is a separate, reviewable commit.

### ✅ Pass 1: Extract modules (COMPLETE)
- **Status**: Done
- **Output**: 305 individual files in `test/extracted/`
- **Commits**:
  - "Add test extraction script"
  - "Extract all QUnit modules into individual files"

### 🔄 Pass 2: Extract fixtures/constants/helpers
- **Goal**: Create reusable test utilities from the test/test.js file.

It seems like some of these constants may actually be duplicated in lodash.js itself? Which is interesting, and if true it is likely an artifact of them being internals and shielded from user consumption via not being exported. And also they're not split out and required in bc the lodash.js monolith is meant to be self contained.

- **Output**:
  - `test/utils/fixtures.js` - test data (falsey, args, etc.)
  - `test/utils/constants.js` - constants (MAX_SAFE_INTEGER, etc.)
  - `test/utils/helpers.js` - helper functions (toArgs, stubs, etc.)
- **Review focus**: "Are fixtures complete and organized correctly?"
- **Commit**: "Extract test fixtures and utilities to separate modules"

### 🔄 Pass 3: Add imports (keeping QUnit structure)
- **Goal**: Import fixtures/lodash, but keep QUnit syntax intact
- **Changes**: Add import statements at top of each file
- **No changes to**: QUnit.module, QUnit.test, IIFE wrappers
- **Review focus**: "Are imports correct and complete?"
- **Tests still runnable with QUnit at this stage**
- **Commit**: "Add module imports to extracted tests"

### 🔄 Pass 4: Migrate to Node test runner + swap assertions (COMBINED)
- **Why combined**: QUnit assertions don't report failures under Node test runner (confirmed via testing)
- **Changes**:
  - Remove IIFE wrappers
  - `QUnit.module('name')` → `describe('name', () => {`
  - `QUnit.test('desc', function(assert)` → `test('desc', () => {`
  - `import QUnit` → `import assert from 'node:assert/strict'`
  - QUnit assertions → Node assertions
  - `var` → `const`/`let`
  - Remove `assert.expect(n)` calls
- **Review focus**: "Test structure and assertions correct?"
- **Tests runnable with `node --test` after this**
- **Commit**: "Migrate tests to Node test runner with node:assert"

### 🔄 Pass 5+: Handle special cases
- **Individual commits** for complex patterns:
  - Dynamic method selection (values_methods.js pattern)
  - Tests with async assertions
  - Browser-specific tests
  - etc.

## Assertion Mapping

| QUnit | Node assert |
|-------|-------------|
| `assert.strictEqual(a, b)` | `assert.strictEqual(a, b)` |
| `assert.deepEqual(a, b)` | `assert.deepEqual(a, b)` |
| `assert.ok(x)` | `assert.ok(x)` |
| `assert.notOk(x)` | `assert.ok(!x)` |
| `assert.notStrictEqual(a, b)` | `assert.notStrictEqual(a, b)` |
| `assert.raises(fn)` | `assert.throws(fn)` |
| `assert.expect(n)` | ❌ Remove (no equivalent) |

## Next Steps

1. Start Pass 2: Extract fixtures from test.js preamble
2. Manually migrate 5-10 diverse test files (Pass 3 + 4 combined on samples)
3. Write transformation script based on learnings
4. Bulk transform remaining files
5. Fix edge cases individually
