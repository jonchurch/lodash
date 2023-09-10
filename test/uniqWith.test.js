import assert from 'assert'
import lodashStable from 'lodash'
import { LARGE_ARRAY_SIZE, isEven } from './utils.js'
import uniqWith from '../uniqWith.js'

describe('uniqWith', () => {
  it('should work with a `comparator`', () => {
    const objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }],
      actual = uniqWith(objects, lodashStable.isEqual)

    assert.deepStrictEqual(actual, [objects[0], objects[1]])
  })

  it('should preserve the sign of `0`', () => {
    const largeArray = lodashStable.times(LARGE_ARRAY_SIZE, (index) => isEven(index) ? -0 : 0)

    const arrays = [[-0, 0], largeArray],
      expected = lodashStable.map(arrays, lodashStable.constant(['-0']))

    const actual = lodashStable.map(arrays, (array) => lodashStable.map(uniqWith(array, lodashStable.eq), lodashStable.toString))

    assert.deepStrictEqual(actual, expected)
  })
})
