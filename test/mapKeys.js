import assert from 'assert'
import lodashStable from 'lodash'
import mapKeys from '../mapKeys.js'

describe('mapKeys', () => {
  const array = [1, 2],
    object = { 'a': 1, 'b': 2 }

  it('should map keys in `object` to a new object', () => {
    const actual = mapKeys(object, String)
    assert.deepStrictEqual(actual, { '1': 1, '2': 2 })
  })

  it('should treat arrays like objects', () => {
    const actual = mapKeys(array, String)
    assert.deepStrictEqual(actual, { '1': 1, '2': 2 })
  })

  it('should work with `_.property` shorthands', () => {
    const actual = mapKeys({ 'a': { 'b': 'c' } }, 'b')
    assert.deepStrictEqual(actual, { 'c': { 'b': 'c' } })
  })

  it('should use `_.identity` when `iteratee` is nullish', () => {
    const object = { 'a': 1, 'b': 2 },
      values = [, null, undefined],
      expected = lodashStable.map(values, lodashStable.constant({ '1': 1, '2': 2 }))

    const actual = lodashStable.map(values, (value, index) => index ? mapKeys(object, value) : mapKeys(object))

    assert.deepStrictEqual(actual, expected)
  })
})
