import assert from 'assert'
import lodashStable from 'lodash'
import { identity } from './utils'
import flatMapDepth from '../flatMapDepth.js'

describe('flatMapDepth', () => {
  const array = [1, [2, [3, [4]], 5]]

  it('should use a default `depth` of `1`', () => {
    assert.deepStrictEqual(flatMapDepth(array, identity), [1, 2, [3, [4]], 5])
  })

  // TODO: test fails on shorthand access
  it.skip('should use `_.identity` when `iteratee` is nullish', () => {
    const values = [, null, undefined],
      expected = lodashStable.map(values, lodashStable.constant([1, 2, [3, [4]], 5]))

    const actual = lodashStable.map(values, (value, index) => index ? flatMapDepth(array, value) : flatMapDepth(array))

    assert.deepStrictEqual(actual, expected)
  })

  it('should treat a `depth` of < `1` as a shallow clone', () => {
    lodashStable.each([-1, 0], (depth) => {
      assert.deepStrictEqual(flatMapDepth(array, identity, depth), [1, [2, [3, [4]], 5]])
    })
  })

  // TODO: I don't know why this test would have ever passed
  // baseFlatten coerces to number, not integer
  // looks like it is a bug introduced in commit bb7c959479 
  it.skip('should coerce `depth` to an integer', () => {
    assert.deepStrictEqual(flatMapDepth(array, identity, 2.2), [1, 2, 3, [4], 5])
  })
})
