import assert from 'assert'
import lodashStable from 'lodash'
import mapValue from '../mapValue.js'

describe('mapValue', () => {
  const array = [1, 2],
    object = { 'a': 1, 'b': 2 }

  it('should map values in `object` to a new object', () => {
    const actual = mapValue(object, String)
    assert.deepStrictEqual(actual, { 'a': '1', 'b': '2' })
  })

  it('should treat arrays like objects', () => {
    const actual = mapValue(array, String)
    assert.deepStrictEqual(actual, { '0': '1', '1': '2' })
  })

  it('should work with `_.property` shorthands', () => {
    const actual = mapValue({ 'a': { 'b': 2 } }, 'b')
    assert.deepStrictEqual(actual, { 'a': 2 })
  })

  it('should use `_.identity` when `iteratee` is nullish', () => {
    const object = { 'a': 1, 'b': 2 },
      values = [, null, undefined],
      expected = lodashStable.map(values, lodashStable.constant([true, false]))

    const actual = lodashStable.map(values, (value, index) => {
      const result = index ? mapValue(object, value) : mapValue(object)
      return [lodashStable.isEqual(result, object), result === object]
    })

    assert.deepStrictEqual(actual, expected)
  })
})
