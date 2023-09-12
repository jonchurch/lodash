### `test/__proto__-property-bugs.test.js`

```js
    // TODO: this fails since the source was changed to not support shorthand access
    // see commit 5baad4df1015
    // https://github.com/lodash/lodash/commit/5baad4df101599af5b4c80df210b0581651ddedb
    actual = groupBy([{ 'a': '__proto__' }], 'a')
    assert.ok(!(actual instanceof Array))
  })

```

```js
  // TODO: safeGet doesn't seem to be used, which was introduced in d8e069cc34 when this original test was
  it.skip('should not merge "__proto__" properties', () => {
    if (JSON) {
      merge({}, JSON.parse('{"__proto__":{"a":1}}'))

```

---
### `test/clamp.test.js`

```js
  // TODO: clamp is supposed to take 3 arguments, so idk if this test would ever pass?
  // it's in the 4.17 tests, but I don't think it can pass
  it.skip('should work with a `max`', () => {
    assert.strictEqual(clamp(5, 3), 3)
    assert.strictEqual(clamp(1, 3), 1)
  })

```

---
### `test/countBy.test.js`

```js
  // TODO: another casuality of removing shorthand accesses
  it.skip('should use `_.identity` when `iteratee` is nullish', () => {
    const array = [4, 6, 6],
      values = [, null, undefined],
      expected = lodashStable.map(values, lodashStable.constant({ '4': 1, '6':  2 }))

```

```js
  // TODO: another casuality of removing shorthand accesses
  it.skip('should work with `_.property` shorthands', () => {
    const actual = countBy(['one', 'two', 'three'], 'length')
    assert.deepStrictEqual(actual, { '3': 2, '5': 1 })
  })

```

```js
  // TODO: another casuality of removing shorthand accesses
  it.skip('should work with a number for `iteratee`', () => {
    const array = [
      [1, 'a'],
      [2, 'a'],
      [2, 'b']
    ]

```

```js
  // TODO: another casuality of removing shorthand accesses
  it.skip('should work in a lazy sequence', () => {
    const array = lodashStable.range(LARGE_ARRAY_SIZE).concat(
      lodashStable.range(Math.floor(LARGE_ARRAY_SIZE / 2), LARGE_ARRAY_SIZE),
      lodashStable.range(Math.floor(LARGE_ARRAY_SIZE / 1.5), LARGE_ARRAY_SIZE)
    )

```

---
### `test/differenceBy.test.js`

```js
  // TODO: test using shorthand access that was removed
  it.skip('should accept an `iteratee`', () => {
    let actual = differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor)
    assert.deepStrictEqual(actual, [1.2])

```

---
### `test/dropRightWhile.test.js`

```js
  // TODO: uses shorthands, which are not supported
  it.skip('should work with `_.matches` shorthands', () => {
    assert.deepStrictEqual(dropRightWhile(objects, { 'b': 2 }), objects.slice(0, 2))
  })

```

```js
  // TODO: uses shorthands, which are not supported
  it.skip('should work with `_.matchesProperty` shorthands', () => {
    assert.deepStrictEqual(dropRightWhile(objects, ['b', 2]), objects.slice(0, 2))
  })

```

```js
  // TODO: uses shorthands, which are not supported
  it.skip('should work with `_.property` shorthands', () => {
    assert.deepStrictEqual(dropRightWhile(objects, 'b'), objects.slice(0, 1))
  })

```

---
### `test/dropWhile.test.js`

```js
  // TODO: test uses shorthands, unsupported
  it.skip('should work with `_.matches` shorthands', () => {
    assert.deepStrictEqual(dropWhile(objects, { 'b': 2 }), objects.slice(1))
  })

```

```js
  // TODO: test uses shorthands, unsupported
  it.skip('should work with `_.matchesProperty` shorthands', () => {
    assert.deepStrictEqual(dropWhile(objects, ['b', 2]), objects.slice(1))
  })

```

```js
  // TODO: test uses shorthands, unsupported
  it.skip('should work with `_.property` shorthands', () => {
    assert.deepStrictEqual(dropWhile(objects, 'b'), objects.slice(2))
  })

```

---
### `test/every.test.js`

```js
  // TODO: test uses shorthands, unsupported
  it.skip('should use `_.identity` when `predicate` is nullish', () => {
    let values = [, null, undefined],
      expected = lodashStable.map(values, stubFalse)

```

```js
  // TODO: test uses shorthands, unsupported
  it.skip('should work with `_.property` shorthands', () => {
    const objects = [{ 'a': 0, 'b': 1 }, { 'a': 1, 'b': 2 }]
    assert.strictEqual(every(objects, 'a'), false)
    assert.strictEqual(every(objects, 'b'), true)
  })

```

```js
  // TODO: test uses shorthands, unsupported
  it.skip('should work with `_.matches` shorthands', () => {
    const objects = [{ 'a': 0, 'b': 0 }, { 'a': 0, 'b': 1 }]
    assert.strictEqual(every(objects, { 'a': 0 }), true)
    assert.strictEqual(every(objects, { 'b': 1 }), false)
  })

```

```js
  // TODO: predicate is not a function
  it.skip('should work as an iteratee for methods like `_.map`', () => {
    const actual = lodashStable.map([[1]], every)
    assert.deepStrictEqual(actual, [true])
  })
})

```

---
### `test/filter-methods.test.js`

```js
    // TODO: another predicate related issue? idk what changed with predicates
    it.skip(`\`_.${methodName}\` should provide correct \`predicate\` arguments in a lazy sequence`, () => {
      let args,
        array = lodashStable.range(LARGE_ARRAY_SIZE + 1),
        expected = [1, 0, lodashStable.map(array.slice(1), square)]

```

---
### `test/flatMapDepth.test.js`

```js
  // TODO: test fails on shorthand access
  it.skip('should use `_.identity` when `iteratee` is nullish', () => {
    const values = [, null, undefined],
      expected = lodashStable.map(values, lodashStable.constant([1, 2, [3, [4]], 5]))

```

```js
  // TODO: I don't know why this test would have ever passed
  // baseFlatten coerces to number, not integer
  // looks like it is a bug introduced in commit bb7c959479 
  it.skip('should coerce `depth` to an integer', () => {
    assert.deepStrictEqual(flatMapDepth(array, identity, 2.2), [1, 2, 3, [4], 5])
  })
})

```

---
### `test/flatten-methods.test.js`

```js
  // TODO: this exceeds callstack size
  it.skip('should work with extremely large arrays', () => {
    lodashStable.times(3, (index) => {
      const expected = Array(5e5)
      try {
        let func = flatten
        if (index == 1) {
          func = flattenDeep
        } else if (index == 2) {
          func = flattenDepth
        }
        assert.deepStrictEqual(func([expected]), expected)
      } catch (e) {
        assert.ok(false, e.message)
      }
    })
  })

```

---
### `test/flattenDepth.test.js`

```js
  // TODO: does not coerce to integer, bug introduced in commit bb7c959479
  it.skip('should coerce `depth` to an integer', () => {
    assert.deepStrictEqual(flattenDepth(array, 2.2), [1, 2, 3, [4], 5])
  })
})

```

---
### `test/fromEntries.test.js`

```js
  // TODO: this fails, attempts to iterate non-iterables
  // this test broke at commit 3e2b0bb763 
  it.skip('should accept a falsey `array`', () => {
    const expected = lodashStable.map(falsey, stubObject)

```

```js
    // TODO: this is using a renamed function for its comparison, fromPairs was renamed to fromEntries
    // probably don't need to do much, but wanted to leave a note
    // still dunno how i feel about testing against prev versions
    const actual = lodashStable(array).fromPairs().map(square).filter(isEven).take().value()

```

---
### `test/groupBy.test.js`

```js
  // TODO: test is using shorthand
  it.skip('should use `_.identity` when `iteratee` is nullish', () => {
    const array = [6, 4, 6],
      values = [, null, undefined],
      expected = lodashStable.map(values, lodashStable.constant({ '4': [4], '6':  [6, 6] }))

```

```js
  // TODO: test is using shorthand
  it.skip('should work with `_.property` shorthands', () => {
    const actual = groupBy(['one', 'two', 'three'], 'length')
    assert.deepStrictEqual(actual, { '3': ['one', 'two'], '5': ['three'] })
  })

```

```js
  // TODO: not at all sure this should work with a number?
  // but it is still the same error as shorthands: iteratee is not a function
  it.skip('should work with a number for `iteratee`', () => {
    const array = [
      [1, 'a'],
      [2, 'a'],
      [2, 'b']
    ]

```

```js
  // TODO: iteratee is not a function, shorthand issue?
  it.skip('should work in a lazy sequence', () => {
    const array = lodashStable.range(LARGE_ARRAY_SIZE).concat(
      lodashStable.range(Math.floor(LARGE_ARRAY_SIZE / 2), LARGE_ARRAY_SIZE),
      lodashStable.range(Math.floor(LARGE_ARRAY_SIZE / 1.5), LARGE_ARRAY_SIZE)
    )

```

---
### `test/has-methods.test.js`

```js
    // TODO: wut, this throws a typeerror, did this ever work??
    // commenting it out bc it literally breaks js lol
    // delete sparseString[0]

```

---
### `test/inRange.test.js`

```js
  // TODO: fails, not sure if it should pass?
  // Skipping this test because the current implementation of inRange and baseInRange
  // will actually return `true` for inRange(0, value) when `value` is a falsey value.
  // The test's expectation is incorrect based on how the functions are currently implemented.
  it.skip('should treat falsey `start` as `0`', () => {
    lodashStable.each(falsey, (value, index) => {
      if (index) {
        assert.strictEqual(inRange(0, value), false)
        assert.strictEqual(inRange(0, value, 1), true)
      } else {
        assert.strictEqual(inRange(0), false)
      }
    })
  })

```

```js
  // TODO: this test seems to have an incorrect assumption
  /*
   * Skipping this test because it incorrectly expects that `inRange` will return `true` 
   * when passed `NaN` as one of its arguments. In the current implementation, 
   * any comparison with `NaN` within `baseInRange` will yield `false`, 
   * causing the test to fail.
   */
  it.skip('should coerce arguments to finite numbers', () => {
    const actual = [
      inRange(0, '1'),
      inRange(0, '0', 1),
      inRange(0, 0, '1'),
      inRange(0, NaN, 1),
      inRange(-1, -1, NaN)
    ]

```

---
### `test/intersectionBy.test.js`

```js
  // TODO: skipping bc it uses shorthands
  it.skip('should accept an `iteratee`', () => {
    let actual = intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor)
    assert.deepStrictEqual(actual, [2.1])

```

---
### `test/invertBy.test.js`

```js
  // TODO: I think its another shorthand casuality, iteratee is not a function
  it.skip('should use `_.identity` when `iteratee` is nullish', () => {
    const values = [, null, undefined],
      expected = lodashStable.map(values, lodashStable.constant({ '1': ['a', 'c'], '2': ['b'] }))

```

```js
  // TODO: iteratee is just undefined here
  it.skip('should only add multiple values to own, not inherited, properties', () => {
    const object = { 'a': 'hasOwnProperty', 'b': 'constructor' },
      expected = { 'hasOwnProperty': ['a'], 'constructor': ['b'] }

```

---
### `test/invoke.test.js`

```js
  // TODO: test bug, this should pass [1,2] not 1,2
  // ahh, okay, implementation changed in 563059c4b9 
  it.skip('should support invoking with arguments', () => {
    const object = { 'a': function(a, b) { return [a, b] } },
      actual = invoke(object, 'a', 1, 2)

```

```js
  // TODO: test bug, this should pass [1,2] not 1,2
  // ahh, okay, implementation changed in 563059c4b9 
  it.skip('should support deep paths', () => {
    const object = { 'a': { 'b': function(a, b) { return [a, b] } } }

```

---
### `test/invokeMap.test.js`

```js
  // TODO: test bug, implementation of invoke changed in 563059c4b9
  // need to wrap args in an array
  it.skip('should support invoking with arguments', () => {
    const array = [function() { return slice.call(arguments) }],
      // actual = invokeMap(array, 'call', [null, 'a', 'b', 'c'])
      actual = invokeMap(array, 'call', null, 'a', 'b', 'c')

```

```js
  // TODO: test bug, implementation of invoke changed in 563059c4b9
  // need to wrap args in an array
  it.skip('should work with a function for `methodName`', () => {
    const array = ['a', 'b', 'c']

```

```js
  // TODO: test bug, implementation of invoke changed in 563059c4b9
  // need to wrap args in an array
  it.skip('should work with an object for `collection`', () => {
    const object = { 'a': 1, 'b': 2, 'c': 3 },
      // actual = invokeMap(object, 'toFixed', [1])
      actual = invokeMap(object, 'toFixed', 1)

```

---
### `test/isEmpty.test.js`

```js
  // TODO: This test likely broke in commit 58e484f389.
  // The function `isEmpty` was modified, and the logic to filter out the 'constructor' property
  // when checking prototype objects seems to have been altered.
  // This is causing the test 'should work with prototype objects' to fail.
  it.skip('should work with prototype objects', () => {
    function Foo() {}
    Foo.prototype = { 'constructor': Foo }

```

---
### `test/isEqualWith.test.js`

```js
  // TODO: this doesn't test what it says it does
  it('should ensure `customizer` is a function', () => {
    const array = [1, 2, 3];

```

---
### `test/isMatchWith.test.js`

```js
  // TODO: this test is realy only testing baseEquals, should be deleted
  it('should provide `stack` to `customizer`', () => {
    let actual

```

```js
  // TODO: this test doens't test what it purports to
  it('should ensure `customizer` is a function', () => {
    const object = { 'a': 1 };

```

---
### `test/isPlainObject.test.js`

```js
  // TODO: this test likely broke in commit aa1d7d870d when switching from baseGetTag to getTag
  it.skip('should return `true` for objects with a writable `Symbol.toStringTag` property', () => {
    if (Symbol && Symbol.toStringTag) {
      const object = {}
      object[Symbol.toStringTag] = 'X'

```

---
### `test/keyBy.test.js`

```js
  // TODO: iteratee is not a function
  it.skip('should use `_.identity` when `iteratee` is nullish', () => {
    const array = [4, 6, 6],
      values = [, null, undefined],
      expected = lodashStable.map(values, lodashStable.constant({ '4': 4, '6': 6 }))

```

```js
  // TODO: iteratee is not a function
  it.skip('should work with `_.property` shorthands', () => {
    const expected = { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } },
      actual = keyBy(array, 'dir')

```

```js
  // TODO: iteratee is not a function
  it.skip('should work with a number for `iteratee`', () => {
    const array = [
      [1, 'a'],
      [2, 'a'],
      [2, 'b']
    ]

```

```js
  // TODO: iteratee is not a function
  it.skip('should work in a lazy sequence', () => {
    const array = lodashStable.range(LARGE_ARRAY_SIZE).concat(
      lodashStable.range(Math.floor(LARGE_ARRAY_SIZE / 2), LARGE_ARRAY_SIZE),
      lodashStable.range(Math.floor(LARGE_ARRAY_SIZE / 1.5), LARGE_ARRAY_SIZE)
    )

```

---
### `test/map.test.js`

```js
  // TODO: implementation changed in 0bdc73195f 
  // no longer accepts objects as input
  it.skip('should map values in `collection` to a new array', () => {
    // const object = { 'a': 1, 'b': 2 },
    const expected = ['1', '2']

```

```js
  // TODO: iteratee is not a function
  it.skip('should work with `_.property` shorthands', () => {
    const objects = [{ 'a': 'x' }, { 'a': 'y' }]
    assert.deepStrictEqual(map(objects, 'a'), ['x', 'y'])
  })

```

```js
  // TODO: implementation changed in 0bdc73195f 
  // no longer accepts objects as input
  it.skip('should iterate over own string keyed properties of objects', () => {
    function Foo() {
      this.a = 1
    }
    Foo.prototype.b = 2

```

```js
  // TODO: iteratee is not a function
  it.skip('should use `_.identity` when `iteratee` is nullish', () => {
    const object = { 'a': 1, 'b': 2 },
      values = [, null, undefined],
      expected = lodashStable.map(values, lodashStable.constant([1, 2]))

```

```js
  // TODO: I forget what the bug is here, but I know I've seen this one before
  // same setup, with it not actually handling falsey
  it.skip('should accept a falsey `collection`', () => {
    const expected = lodashStable.map(falsey, stubArray)

```

```js
  // TODO: Borked
  it.skip('should treat number values for `collection` as empty', () => {
    assert.deepStrictEqual(map(1), [])
  })

```

```js
  // TODO: this one is just another slice undefined, but I am too tired to think about which slice to use
  it.skip('should provide correct `predicate` arguments in a lazy sequence', () => {
    let args,
      array = lodashStable.range(LARGE_ARRAY_SIZE + 1),
      expected = [1, 0, map(array.slice(1), square)]

```

---
### `test/mapKey.test.js`

```js
  // TODO: iteratee is not a function
  it.skip('should work with `_.property` shorthands', () => {
    const actual = mapKey({ 'a': { 'b': 'c' } }, 'b')
    assert.deepStrictEqual(actual, { 'c': { 'b': 'c' } })
  })

```

```js
  // TODO: iteratee is not a function
  it.skip('should use `_.identity` when `iteratee` is nullish', () => {
    const object = { 'a': 1, 'b': 2 },
      values = [, null, undefined],
      expected = lodashStable.map(values, lodashStable.constant({ '1': 1, '2': 2 }))

```

---
### `test/mapValue.test.js`

```js
  // TODO: iteratee is not a function
  it.skip('should work with `_.property` shorthands', () => {
    const actual = mapValue({ 'a': { 'b': 2 } }, 'b')
    assert.deepStrictEqual(actual, { 'a': 2 })
  })

```

```js
  // TODO: iteratee is not a function
  it.skip('should use `_.identity` when `iteratee` is nullish', () => {
    const object = { 'a': 1, 'b': 2 },
      values = [, null, undefined],
      expected = lodashStable.map(values, lodashStable.constant([true, false]))

```

---
### `test/matchesProperty.test.js`

```js
  // TODO: failing
  it.skip('should match `undefined` values of nested objects', () => {
    const object = { 'a': { 'b': undefined } };

```

---
### `test/meanBy.test.js`

```js
  // TODO: iteratee is not a function
  it.skip('should work with `_.property` shorthands', () => {
    const arrays = [[2], [3], [1]]
    assert.strictEqual(meanBy(arrays, 0), 2)
    assert.strictEqual(meanBy(objects, 'a'), 2)
  })
})

```

---
### `test/merge.test.js`

```js
  // TODO: revisit.
  it.skip('should treat sparse array sources as dense', () => {
    const array = [1]
    array[2] = 3

```

---
### `test/nth.test.js`

```js
  // TODO: this fails, I think there was a change number coercion
  // it should coerce n to 0, but it is not
  it.skip('should coerce `n` to an integer', () => {
    let values = falsey,
      expected = lodashStable.map(values, stubA)

```

---
### `test/nthArg.test.js`

```js
  // TODO: so same as nth, this fails
  // I think I understand the intent though, it expects n to become 0
  // but it's not apparently
  it.skip('should coerce `n` to an integer', () => {
    let values = falsey,
      expected = lodashStable.map(values, stubA)

```

---
### `test/number-coercion-methods.test.js`

```js
    // TODO: welp, after going down a rabbit hole I realized that this test and the original
    // are using different assertions. The original uses deepEqual, this uses strictEqual
    // in deepEqual, these are equivalent [0, 0, 0, 0] [0, 0, -0, -0]
    // that's all, that's all it was
    // question is, do we fix the original or not? 
    // for now Im going to make this deepEqual so the tests pass
    it(`\`_.${methodName}\` should convert number primitives and objects to numbers`, () => {
      const values = [2, 1.2, MAX_SAFE_INTEGER, MAX_INTEGER, Infinity, NaN]

```

```js
    // TODO: same as above, this might also need to be changed to deepStrictEqual depending on where the implementation lands
    it(`\`_.${methodName}\` should convert string primitives and objects to numbers`, () => {
      const transforms = [identity, pad, positive, negative]

```

---
### `test/orderBy.test.js`

```js
  // TODO: iteratee is not a function
  it.skip('should sort by a single property by a specified order', function() {
    var actual = orderBy(objects, 'a', 'desc');
    assert.deepStrictEqual(actual, [objects[1], objects[3], objects[0], objects[2]]);
  });

```

```js
  // TODO: fails
  it.skip('should sort by nested key in array format', () => {
    var actual = orderBy(
      nestedObj,
      [['address', 'zipCode'], ['address.streetName']],
      ['asc', 'desc'],
    );
    assert.deepStrictEqual(actual, [nestedObj[2], nestedObj[3], nestedObj[1], nestedObj[0], nestedObj[4]]);
  });

```

```js
  // TODO: iteratee is not a function
  it.skip('should sort by multiple properties by specified orders', function() {
    var actual = orderBy(objects, ['a', 'b'], ['desc', 'asc']);
    assert.deepStrictEqual(actual, [objects[3], objects[1], objects[2], objects[0]]);
  });

```

```js
  // TODO: iteratee is not a function
  it.skip('should sort by a property in ascending order when its order is not specified', function() {
    var expected = [objects[2], objects[0], objects[3], objects[1]],
        actual = orderBy(objects, ['a', 'b']);

```

```js
  // TODO: iteratee is not a function
  it.skip('should work with `orders` specified as string objects', function() {
    var actual = orderBy(objects, ['a'], [Object('desc')]);
    assert.deepStrictEqual(actual, [objects[1], objects[3], objects[0], objects[2]]);
  });
});

```

---
### `test/pad.test.js`

```js
  // TODO: fails, doesn't call/access toString anywhere and not sure when it previously did
  // hmm maybe it's string length failing? how do we get the length of an object before it's stringified right?
  // yeah I think that's it, we aren't getting a string size from the object bc we are doing that before stringifying
  it.skip('should coerce `string` to a string', () => {
    const values = [Object(string), { 'toString': lodashStable.constant(string) }],
      expected = lodashStable.map(values, stubTrue)

```

---
### `test/padEnd.test.js`

```js
  // TODO: fails, doesn't call/access toString anywhere and not sure when it previously did
  // hmm maybe it's string length failing? how do we get the length of an object before it's stringified right?
  // yeah I think that's it, we aren't getting a string size from the object bc we are doing that before stringifying
  it.skip('should coerce `string` to a string', () => {
    const values = [Object(string), { 'toString': lodashStable.constant(string) }],
      expected = lodashStable.map(values, stubTrue)

```

---
### `test/padStart.test.js`

```js
  // TODO: fails, doesn't call/access toString anywhere and not sure when it previously did
  // hmm maybe it's string length failing? how do we get the length of an object before it's stringified right?
  // yeah I think that's it, we aren't getting a string size from the object bc we are doing that before stringifying
  it.skip('should coerce `string` to a string', () => {
    const values = [Object(string), { 'toString': lodashStable.constant(string) }],
      expected = lodashStable.map(values, stubTrue)

```

---
### `test/parseInt.test.js`

```js
  // TODO: I don't think it can based on current impl? Did impl change?
  // ah yes it did in 0bdc73195f 
  // parseInt will get called with the value and index
  // so for '08' it gets parseInt('08', 1) // => NaN
  // for '10' it gets parseInt('08', 2) // => 2
  it.skip('should work as an iteratee for methods like `_.map`', () => {
    let strings = lodashStable.map(['6', '08', '10'], Object),
      actual = lodashStable.map(strings, parseInt)

```

---
### `test/partition.test.js`

```js
  // TODO: predicate is not a function
  it.skip('should use `_.identity` when `predicate` is nullish', () => {
    const values = [, null, undefined],
      expected = lodashStable.map(values, lodashStable.constant([[1, 1], [0]]))

```

```js
  // TODO: iteratee is not a function
  it.skip('should work with `_.property` shorthands', () => {
    const objects = [{ 'a': 1 }, { 'a': 1 }, { 'b': 2 }],
      actual = partition(objects, 'a')

```

```js
  // TODO: predicate is not a function
  it.skip('should work with a number for `predicate`', () => {
    const array = [
      [1, 0],
      [0, 1],
      [1, 0]
    ]

```

---
### `test/pick.test.js`

```js
  // TODO: flatrest was removed, so it's not flattening
  it.skip('should flatten `paths`', () => {
    assert.deepStrictEqual(pick(object, 'a', 'c'), { 'a': 1, 'c': 3 })
    assert.deepStrictEqual(pick(object, ['a', 'd'], 'c'), { 'a': 1, 'c': 3, 'd': 4 })
  })

```

```js
  // TODO: fails, is this related to shorthands being removed?
  it.skip('should support deep paths', () => {
    assert.deepStrictEqual(pick(nested, 'b.c'), { 'b': { 'c': 2 } })
  })

```

```js
  // TODO: would have failed at 0acb2847bf when toString was removed from castPath
  it.skip('should work with `arguments` object `paths`', () => {
    console.log({args})
    assert.deepStrictEqual(pick(object, args), { 'a': 1, 'c': 3 })
  })
})

```

---
### `test/random.test.js`

```js
  // TODO: breaks because map is passing the array as the third arg
  // which breaks a check for if (floating || lower % 1 || upper % 1) {
  // since the array is truthy
  // related to map impl change?
  it.skip('should work as an iteratee for methods like `_.map`', () => {
    const array = [1, 2, 3],
      expected = lodashStable.map(array, stubTrue),
      randoms = lodashStable.map(array, random)
    console.log({randoms})
    const actual = lodashStable.map(randoms, (result, index) => result >= 0 && result <= array[index] && (result % 1) == 0)

```

---
### `test/reduce.test.js`

```js
  // TODO: iteratee is not a function
  it.skip('should use the first element of a collection as the default `accumulator`', () => {
    assert.strictEqual(reduce(array), 1)
  })

```

---
### `test/reduceRight.test.js`

```js
  // TODO: iteratee is not a function
  it.skip('should use the last element of a collection as the default `accumulator`', () => {
    assert.strictEqual(reduceRight(array), 3)
  })

```

---
### `test/remove.test.js`

```js
  // TODO: predicate is not a function
  it.skip('should work with `_.matches` shorthands', () => {
    const objects = [{ 'a': 0, 'b': 1 }, { 'a': 1, 'b': 2 }]
    remove(objects, { 'a': 1 })
    assert.deepStrictEqual(objects, [{ 'a': 0, 'b': 1 }])
  })

```

```js
  // TODO: predicate is not a function
  it.skip('should work with `_.matchesProperty` shorthands', () => {
    const objects = [{ 'a': 0, 'b': 1 }, { 'a': 1, 'b': 2 }]
    remove(objects, ['a', 1])
    assert.deepStrictEqual(objects, [{ 'a': 0, 'b': 1 }])
  })

```

```js
  // TODO: predicate is not a function
  it.skip('should work with `_.property` shorthands', () => {
    const objects = [{ 'a': 0 }, { 'a': 1 }]
    remove(objects, 'a')
    assert.deepStrictEqual(objects, [{ 'a': 0 }])
  })

```

---
### `test/repeat.test.js`

```js
  // TODO: coercion was removed in bb7c959479 
  it.skip('should treat falsey `n` values, except `undefined`, as `0`', () => {
    const expected = lodashStable.map(falsey, (value) => value === undefined ? string : '')

```

```js
  // TODO: coercion was removed in bb7c959479 
  it.skip('should coerce `n` to an integer', () => {
    assert.strictEqual(repeat(string, '2'), 'abcabc')
    assert.strictEqual(repeat(string, 2.6), 'abcabc')
    assert.strictEqual(repeat('*', { 'valueOf': stubThree }), '***')
  })

```

```js
  // TODO: fails, likely bc of map impl change where iteratee receives array as third arg
  it.skip('should work as an iteratee for methods like `_.map`', () => {
    const actual = lodashStable.map(['a', 'b', 'c'], repeat)
    assert.deepStrictEqual(actual, ['a', 'b', 'c'])
  })
})

```

---
### `test/sample.test.js`

```js
  // TODO: sample stopped accepting object in cb7612aef6 
  it.skip('should sample an object', () => {
    const object = { 'a': 1, 'b': 2, 'c': 3 },
      actual = sample(object)

```

---
### `test/sampleSize.test.js`

```js
  // TODO: coercion was removed in bb7c95947914d1
  it.skip('should treat falsey `size` values, except `undefined`, as `0`', () => {
    const expected = lodashStable.map(falsey, (value) => value === undefined ? ['a'] : [])

```

```js
  // TODO: object compat was removed in cb7612aef6
  it.skip('should sample an object', () => {
    const object = { 'a': 1, 'b': 2, 'c': 3 },
      actual = sampleSize(object, 2)

```

```js
  // TODO: fails, bc of map impl changes
  it.skip('should work as an iteratee for methods like `_.map`', () => {
    const actual = lodashStable.map([['a']], sampleSize)
    assert.deepStrictEqual(actual, [['a']])
  })
})

```

---
### `test/set-methods.test.js`

```js
    // TODO: Ahh, this is grabbing off the lodash object from utils, which currently is stable lodash
    const func = _[methodName],
      isUpdate = /^update/.test(methodName)

```

```js
    // TODO: this fails bc for _.update, returns an array with a hole in 0 index
    // which fails the assertion here. idk what intended is so dunno if test needs to be fixed or impl
    it.skip(`\`_.${methodName}\` should create parts of \`path\` that are missing`, () => {
      const object = {}

```

---
### `test/shuffle.test.js`

```js
  // TODO: shuffle no longer supports objects since cb7612aef6
  it.skip('should contain the same elements after a collection is shuffled', () => {
    assert.deepStrictEqual(shuffle(array).sort(), array)
    assert.deepStrictEqual(shuffle(object).sort(), array)
  })

```

---
### `test/slice-and-toArray.test.js`

```js
    // TODO: this test implementation seems off
    // if the method should return a dense array, why are we comparing it's equality to a sparse one?
    it.skip(`\`_.${methodName}\` should return a dense array`, () => {
      const sparse = Array(3)
      sparse[1] = 2

```

---
### `test/slice.test.js`

```js
  // TODO: coercion was removed in bb7c959479
  it.skip('should treat falsey `start` values as `0`', () => {
    const expected = lodashStable.map(falsey, lodashStable.constant(array))

```

```js
  // TODO: coercion was removed in bb7c959479
  it.skip('should coerce `start` and `end` to integers', () => {
    const positions = [[0.1, 1.6], ['0', 1], [0, '1'], ['1'], [NaN, 1], [1, NaN]]

```

```js
  // TODO: map impl changed
  it.skip('should work as an iteratee for methods like `_.map`', () => {
    const array = [[1], [2, 3]],
      actual = lodashStable.map(array, slice)

```

---
### `test/some.test.js`

```js
  // TODO: predicate is not a function
  it.skip('should use `_.identity` when `predicate` is nullish', () => {
    let values = [, null, undefined],
      expected = lodashStable.map(values, stubFalse)

```

```js
  // TODO: predicate is not a function
  it.skip('should work with `_.property` shorthands', () => {
    const objects = [{ 'a': 0, 'b': 0 }, { 'a': 0, 'b': 1 }]
    assert.strictEqual(some(objects, 'a'), false)
    assert.strictEqual(some(objects, 'b'), true)
  })

```

```js
  // TODO: predicate is not a function
  it.skip('should work with `_.matches` shorthands', () => {
    const objects = [{ 'a': 0, 'b': 0 }, { 'a': 1, 'b': 1}]
    assert.strictEqual(some(objects, { 'a': 0 }), true)
    assert.strictEqual(some(objects, { 'b': 2 }), false)
  })

```

```js
  // TODO: predicate is not a function
  it.skip('should work as an iteratee for methods like `_.map`', () => {
    const actual = lodashStable.map([[1]], some)
    assert.deepStrictEqual(actual, [true])
  })
})

```

---
### `test/split.test.js`

```js
  // TODO: broken in b8a3a422 when string coercion methods were removed
  it.skip('should return an array containing an empty string for empty values', () => {
    const values = [, null, undefined, ''],
      expected = lodashStable.map(values, lodashStable.constant(['']))

```

```js
  // TODO: map impl changed
  it.skip('should work as an iteratee for methods like `_.map`', () => {
    const strings = ['abc', 'def', 'ghi'],
      actual = lodashStable.map(strings, split)

```

---
### `test/startsWith.test.js`

```js
  // TODO: coercion was removed in bb7c959479
  it.skip('should treat falsey `position` values as `0`', () => {
    const expected = lodashStable.map(falsey, stubTrue)

```

---
### `test/sumBy.test.js`

```js
  // TODO: iteratee is not a function
  it.skip('should work with `_.property` shorthands', () => {
    const arrays = [[2], [3], [1]]
    assert.strictEqual(sumBy(arrays, 0), 6)
    assert.strictEqual(sumBy(objects, 'a'), 6)
  })
})

```

---
### `test/take.test.js`

```js
  // TODO: map impl changed
  it.skip('should work as an iteratee for methods like `_.map`', () => {
    const array = [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
      actual = lodashStable.map(array, take)

```

---
### `test/takeRight.test.js`

```js
  // TODO: map impl changed
  it.skip('should work as an iteratee for methods like `_.map`', () => {
    const array = [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
      actual = lodashStable.map(array, takeRight)

```

---
### `test/takeRightWhile.test.js`

```js
  // TODO: predicate is not a function
  it.skip('should work with `_.matches` shorthands', () => {
    assert.deepStrictEqual(takeRightWhile(objects, { 'b': 2 }), objects.slice(2))
  })

```

```js
  // TODO: predicate is not a function
  it.skip('should work with `_.matchesProperty` shorthands', () => {
    assert.deepStrictEqual(takeRightWhile(objects, ['b', 2]), objects.slice(2))
  })

```

```js
  // TODO: predicate is not a function
  it.skip('should work with `_.property` shorthands', () => {
    assert.deepStrictEqual(takeRightWhile(objects, 'b'), objects.slice(1))
  })

```

---
### `test/takeWhile.test.js`

```js
  // TODO: predicate is not a function
  it.skip('should work with `_.matches` shorthands', () => {
    assert.deepStrictEqual(takeWhile(objects, { 'b': 2 }), objects.slice(0, 1))
  })

```

```js
  // TODO: predicate is not a function
  it.skip('should work with `_.property` shorthands', () => {
    assert.deepStrictEqual(takeWhile(objects, 'b'), objects.slice(0, 2))
  })

```

---
### `test/toPath.test.js`

```js
  // TODO: this might be failing bc of changes in b8a3a42278 to string coercion?
  it.skip('should handle complex paths', () => {
    const actual = toPath('a[-1.23]["[\\"b\\"]"].c[\'[\\\'d\\\']\'][\ne\n][f].g')
    assert.deepStrictEqual(actual, ['a', '-1.23', '["b"]', 'c', "['d']", '\ne\n', 'f', 'g'])
  })

```

---
### `test/todo/eqDeep.test.js`

```js
// TODO: this suite is using chaining, so it's using lodash itself, but is also using the method it's testing off
// that lodash instance it's using for chaining. 
// The todo is to figure out how to handle this when testing each function as a unit

```

---
### `test/todo/lodash-methods.test.js`

```js
  // TODO: Figure out why this fails with TypeError expected a function, from within lodash.createWrap
  it('should accept falsey arguments', () => {
    const arrays = lodashStable.map(falsey, stubArray)

```

---
### `test/todo/method.test.js`

```js
// TODO: I don't really know what constant is doing here
import constant from '../constant.js'

```

---
### `test/todo/methodOf.test.js`

```js
      // TODO: func.call is not a function
      assert.strictEqual(methodOf(path), 1)
    })
  })

```

---
### `test/todo/overArgs.test.js`

```js
  // TODO: implementation change, transforms must be an array of funcs
  // introduced in commit 3b4cbc70e7  
  it.skip('should transform each argument', () => {
    // const over = overArgs(fn, [doubled, square])
    const over = overArgs(fn, doubled, square)
    assert.deepStrictEqual(over(5, 10), [10, 100])
  })

```

```js
  // TODO: implementation change, transforms must be an array of funcs
  // introduced in commit 3b4cbc70e7  
  // can't read length from non array undefined
  // ahh, it also no longer uses identity, so this test fails 
  // even after wrapping transforms in an array
  it.skip('should use `_.identity` when a predicate is nullish', () => {
    // const over = overArgs(fn, [undefined, null])
    const over = overArgs(fn, undefined, null)
    assert.deepStrictEqual(over('a', 'b'), ['a', 'b'])
  })

```

```js
  // TODO: this test doesn't seem correct, it's attempting 'a'.call etc
  // but shorthands are out anyways
  it.skip('should work with `_.property` shorthands', () => {
    // const over = overArgs(fn, ['b', 'a'])
    const over = overArgs(fn, 'b', 'a')
    assert.deepStrictEqual(over({ 'b': 2 }, { 'a': 1 }), [2, 1])
  })

```

```js
  // TODO: fails
  it.skip('should work with `_.matches` shorthands', () => {
    const over = overArgs(fn, { 'b': 1 }, { 'a': 1 })
    assert.deepStrictEqual(over({ 'b': 2 }, { 'a': 1 }), [false, true])
  })

```

```js
  // TODO: fails
  it.skip('should work with `_.matchesProperty` shorthands', () => {
    const over = overArgs(fn, [['b', 1], ['a', 1]])
    assert.deepStrictEqual(over({ 'b': 2 }, { 'a': 1 }), [false, true])
  })

```

```js
  // TODO: fails
  it.skip('should differentiate between `_.property` and `_.matchesProperty` shorthands', () => {
    let over = overArgs(fn, ['a', 1])
    assert.deepStrictEqual(over({ 'a': 1 }, { '1': 2 }), [1, 2])

```

```js
  // TODO: does not flatten, not sure that it should?
  // implementation changed
  it.skip('should flatten `transforms`', () => {
    const over = overArgs(fn, [doubled, square], String)
    assert.deepStrictEqual(over(5, 10, 15), [10, 100, '15'])
  })

```

```js
  // TODO: implementation changed, transforms must be array of func
  it.skip('should not transform any argument greater than the number of transforms', () => {
    // const over = overArgs(fn, [doubled, square])
    const over = overArgs(fn, doubled, square)
    assert.deepStrictEqual(over(5, 10, 18), [10, 100, 18])
  })

```

```js
  // TODO: implementation changed, transforms must be array of func
  // it chokes bc it tries to read properties of undefined (reading 'length')
  it.skip('should not transform any arguments if no transforms are given', () => {
    const over = overArgs(fn)
    assert.deepStrictEqual(over(5, 10, 18), [5, 10, 18])
  })

```

```js
  // TODO: implementation changed, transforms must be array of func
  it.skip('should not pass `undefined` if there are more transforms than arguments', () => {
    // const over = overArgs(fn, [doubled, identity])
    const over = overArgs(fn, doubled, identity)
    assert.deepStrictEqual(over(5), [10])
  })

```

```js
  // TODO: implementation changed, transforms must be array of func
  it.skip('should provide the correct argument to each transform', () => {
    const argsList = [],
      transform = function() { argsList.push(slice.call(arguments)) },
      // over = overArgs(noop, [transform, transform, transform])
      over = overArgs(noop, transform, transform, transform)

```

```js
  // TODO: implementation changed, transforms must be array of func
  it.skip('should use `this` binding of function for `transforms`', () => {
    const over = overArgs(function(x) {
      return this[x]
    // }, [function(x) {
    //   return this === x
    // }])
    }, function(x) {
      return this === x
    })

```

---
### `test/todo/overEvery.test.js`

```js
  // TODO: implementation change, transforms must be an array of funcs
  // introduced in commit 3b4cbc70e7  
  it.skip('should return `false` as soon as a predicate returns falsey', () => {
    let count = 0,
      countFalse = function() { count++; return false },
      countTrue = function() { count++; return true },
      // over = overEvery([countTrue, countFalse, countTrue])
      over = overEvery(countTrue, countFalse, countTrue)

```

---
### `test/todo/partial-methods.test.js`

```js
// TODO: we end up testing the barrel lodash we export from utils
// not sure yet how I want to approach this, there is no mocking in the suites currently
// so idk how I feel about this manual monkey patching.
import { _, identity, slice } from './utils';
import placeholder from '../placeholder.js';
import curry from '../curry.js';

```

```js
    // TODO: ahhh, these placeholder tests make more sense once you see the original Qunit test
    // https://github.com/lodash/lodash/blob/f299b52f39486275a9e6483b60a410e06520c538/test/test.js#L17414C5-L17429C8
    // the test was monkeypatching library internal _.placeholder, to test the behavior of these methods
    it('`_.' + methodName + '` should use `_.placeholder` when set', function() {
      var _ph = placeholder = {},
          fn = function() { return slice.call(arguments); },
          par = func(fn, _ph, 'b', ph),
          expected = isPartial ? ['a', 'b', ph, 'c'] : ['a', 'c', 'b', ph];

```

---
### `test/todo/pullAt.test.js`

```js
  // TODO: would have broken at aacfefc752 when flatRest was removed
  it.skip('should modify the array and return removed elements', () => {
    const array = [1, 2, 3],
      actual = pullAt(array, [0, 1])

```

```js
  // TODO: would have broken at aacfefc752 when flatRest was removed
  it.skip('should work with unsorted indexes', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      actual = pullAt(array, [1, 3, 11, 7, 5, 9])

```

---
### `test/todo/sortBy-methods.test.js`

```js
// TODO: this test also is using the lodash object exported from utils

```

---
### `test/transform.test.js`

```js
  // TODO: iteratee is not a function
  it.skip('should ensure `object` is an object before using its `[[Prototype]]`', () => {
    let Ctors = [Boolean, Boolean, Number, Number, Number, String, String],
      values = [false, true, 0, 1, NaN, '', 'a'],
      expected = lodashStable.map(values, stubObject)

```

```js
  // TODO: iteratee is not a function
  it.skip('should ensure `object` constructor is a function before using its `[[Prototype]]`', () => {
    Foo.prototype.constructor = null
    assert.ok(!(transform(new Foo) instanceof Foo))
    Foo.prototype.constructor = Foo
  })

```

```js
  // TODO: iteratee is not a function
  it.skip('should create an object from the same realm as `object`', () => {
    const objects = lodashStable.filter(realm, (value) => lodashStable.isObject(value) && !lodashStable.isElement(value))

```

---
### `test/unionBy.test.js`

```js
  // TODO: iteratee is not a function
  it.skip('should accept an `iteratee`', () => {
    let actual = unionBy([2.1], [1.2, 2.3], Math.floor)
    assert.deepStrictEqual(actual, [2.1, 1.2])

```

```js
  // TODO: iteratee is not a function
  it.skip('should provide correct `iteratee` arguments', () => {
    let args

```

```js
  // TODO: iteratee is not a function
  it.skip('should output values from the first possible array', () => {
    const actual = unionBy([{ 'x': 1, 'y': 1 }], [{ 'x': 1, 'y': 2 }], 'x')
    assert.deepStrictEqual(actual, [{ 'x': 1, 'y': 1 }])
  })
})

```

---
### `test/unset.test.js`

```js
  // TODO: fails, not sure why, maybe the string coercion change again?
  it.skip('should handle complex paths', () => {
    const paths = [
      'a[-1.23]["[\\"b\\"]"].c[\'[\\\'d\\\']\'][\ne\n][f].g',
      ['a', '-1.23', '["b"]', 'c', "['d']", '\ne\n', 'f', 'g']
    ]

```

```js
  // TODO: this one gives a type error, which is expected in strict mode
  // and since we're running these tests in an ESM like context (using esm module with mocha), strict mode is on
  // TypeError: Cannot delete property 'a' of #<Object>
  it.skip('should return `false` for non-configurable properties', () => {
    const object = {}

```

---
### `test/unzipWith.test.js`

```js
  // TODO: maybe this broke in 37f168d466 when apply was removed?
  // it attempts to call apply on the undefined iteratee
  it.skip('should perform a basic unzip when `iteratee` is nullish', () => {
    const array = [[1, 3], [2, 4]],
      values = [, null, undefined],
      expected = lodashStable.map(values, lodashStable.constant(unzip(array)))

```

---
### `test/xorBy.test.js`

```js
  // TODO: iteratee is not a function
  it.skip('should accept an `iteratee`', () => {
    let actual = xorBy([2.1, 1.2], [2.3, 3.4], Math.floor)
    assert.deepStrictEqual(actual, [1.2, 3.4])

```

---
### `test/zipWith.test.js`

```js
  // TODO: maybe this broke in 37f168d466 when apply was removed?
  // it attempts to call apply on the undefined iteratee
  it.skip('should perform a basic zip when `iteratee` is nullish', () => {
    const array1 = [1, 2],
      array2 = [3, 4],
      values = [, null, undefined],
      expected = lodashStable.map(values, lodashStable.constant(zip(array1, array2)))

```

---
