import assert from 'assert'
import lodashStable from 'lodash'
import { falsey, stubObject, square, isEven, LARGE_ARRAY_SIZE } from './utils'
import fromEntries from '../fromEntries.js'

describe('fromEntries', () => {
  it('should accept a two dimensional array', () => {
    const array = [['a', 1], ['b', 2]],
      object = { 'a': 1, 'b': 2 },
      actual = fromEntries(array)

    assert.deepStrictEqual(actual, object)
  })

  it('should accept a falsey `array`', () => {
    const expected = lodashStable.map(falsey, stubObject)

    const actual = lodashStable.map(falsey, (array, index) => {
      try {
        return index ? fromEntries(array) : fromEntries()
      } catch (e) {}
    })

    assert.deepStrictEqual(actual, expected)
  })

  it('should not support deep paths', () => {
    const actual = fromEntries([['a.b', 1]])
    assert.deepStrictEqual(actual, { 'a.b': 1 })
  })

  it('should support consuming the return value of `Object.entries`', () => {
    const object = { 'a.b': 1 }
    assert.deepStrictEqual(fromEntries(Object.entries(object)), object)
  })

  it('should work in a lazy sequence', () => {
    const array = lodashStable.times(LARGE_ARRAY_SIZE, (index) => [`key${index}`, index])

    const actual = lodashStable(array).fromEntries().map(square).filter(isEven).take().value()

    assert.deepEqual(actual, lodashStable.take(lodashStable.filter(lodashStable.map(fromEntries(array), square), isEven)))
  })
})
