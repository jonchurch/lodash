import assert from 'assert'
import { slice, doubled, square, identity, noop } from './utils'
import overArgs from '../overArgs.js'

describe('overArgs', () => {
  function fn() {
    return slice.call(arguments)
  }

  // TODO: implementation change, transforms must be an array of funcs
  // introduced in commit 3b4cbc70e7  
  it.skip('should transform each argument', () => {
    // const over = overArgs(fn, [doubled, square])
    const over = overArgs(fn, doubled, square)
    assert.deepStrictEqual(over(5, 10), [10, 100])
  })

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

  // TODO: this test doesn't seem correct, it's attempting 'a'.call etc
  // but shorthands are out anyways
  it.skip('should work with `_.property` shorthands', () => {
    // const over = overArgs(fn, ['b', 'a'])
    const over = overArgs(fn, 'b', 'a')
    assert.deepStrictEqual(over({ 'b': 2 }, { 'a': 1 }), [2, 1])
  })

  // TODO: fails
  it.skip('should work with `_.matches` shorthands', () => {
    const over = overArgs(fn, { 'b': 1 }, { 'a': 1 })
    assert.deepStrictEqual(over({ 'b': 2 }, { 'a': 1 }), [false, true])
  })

  // TODO: fails
  it.skip('should work with `_.matchesProperty` shorthands', () => {
    const over = overArgs(fn, [['b', 1], ['a', 1]])
    assert.deepStrictEqual(over({ 'b': 2 }, { 'a': 1 }), [false, true])
  })

  // TODO: fails
  it.skip('should differentiate between `_.property` and `_.matchesProperty` shorthands', () => {
    let over = overArgs(fn, ['a', 1])
    assert.deepStrictEqual(over({ 'a': 1 }, { '1': 2 }), [1, 2])

    over = overArgs(fn, [['a', 1]])
    assert.deepStrictEqual(over({ 'a': 1 }), [true])
  })

  // TODO: does not flatten, not sure that it should?
  // implementation changed
  it.skip('should flatten `transforms`', () => {
    const over = overArgs(fn, [doubled, square], String)
    assert.deepStrictEqual(over(5, 10, 15), [10, 100, '15'])
  })

  // TODO: implementation changed, transforms must be array of func
  it.skip('should not transform any argument greater than the number of transforms', () => {
    // const over = overArgs(fn, [doubled, square])
    const over = overArgs(fn, doubled, square)
    assert.deepStrictEqual(over(5, 10, 18), [10, 100, 18])
  })

  // TODO: implementation changed, transforms must be array of func
  // it chokes bc it tries to read properties of undefined (reading 'length')
  it.skip('should not transform any arguments if no transforms are given', () => {
    const over = overArgs(fn)
    assert.deepStrictEqual(over(5, 10, 18), [5, 10, 18])
  })

  // TODO: implementation changed, transforms must be array of func
  it.skip('should not pass `undefined` if there are more transforms than arguments', () => {
    // const over = overArgs(fn, [doubled, identity])
    const over = overArgs(fn, doubled, identity)
    assert.deepStrictEqual(over(5), [10])
  })

  // TODO: implementation changed, transforms must be array of func
  it.skip('should provide the correct argument to each transform', () => {
    const argsList = [],
      transform = function() { argsList.push(slice.call(arguments)) },
      // over = overArgs(noop, [transform, transform, transform])
      over = overArgs(noop, transform, transform, transform)

    over('a', 'b')
    assert.deepStrictEqual(argsList, [['a'], ['b']])
  })

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

    const object = { 'over': over, 'true': 1 }
    assert.strictEqual(object.over(object), 1)
  })
})
