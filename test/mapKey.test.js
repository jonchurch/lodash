import assert from 'assert'
import lodashStable from 'lodash'
import mapKey from '../mapKey.js'

describe('mapKey', () => {
  const array = [1, 2],
    object = { 'a': 1, 'b': 2 }

  it('should map keys in `object` to a new object', () => {
    const actual = mapKey(object, String)
    assert.deepStrictEqual(actual, { '1': 1, '2': 2 })
  })

  it('should treat arrays like objects', () => {
    const actual = mapKey(array, String)
    assert.deepStrictEqual(actual, { '1': 1, '2': 2 })
  })

  // TODO: iteratee is not a function
  it.skip('should work with `_.property` shorthands', () => {
    const actual = mapKey({ 'a': { 'b': 'c' } }, 'b')
    assert.deepStrictEqual(actual, { 'c': { 'b': 'c' } })
  })

  // TODO: iteratee is not a function
  it.skip('should use `_.identity` when `iteratee` is nullish', () => {
    const object = { 'a': 1, 'b': 2 },
      values = [, null, undefined],
      expected = lodashStable.map(values, lodashStable.constant({ '1': 1, '2': 2 }))

    const actual = lodashStable.map(values, (value, index) => index ? mapKey(object, value) : mapKey(object))

    assert.deepStrictEqual(actual, expected)
  })
})
