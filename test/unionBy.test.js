import assert from 'assert'
import { slice } from './utils'
import unionBy from '../unionBy.js'

describe('unionBy', () => {
  // TODO: iteratee is not a function
  it.skip('should accept an `iteratee`', () => {
    let actual = unionBy([2.1], [1.2, 2.3], Math.floor)
    assert.deepStrictEqual(actual, [2.1, 1.2])

    actual = unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x')
    assert.deepStrictEqual(actual, [{ 'x': 1 }, { 'x': 2 }])
  })

  // TODO: iteratee is not a function
  it.skip('should provide correct `iteratee` arguments', () => {
    let args

    unionBy([2.1], [1.2, 2.3], function() {
      args || (args = slice.call(arguments))
    })

    assert.deepStrictEqual(args, [2.1])
  })

  // TODO: iteratee is not a function
  it.skip('should output values from the first possible array', () => {
    const actual = unionBy([{ 'x': 1, 'y': 1 }], [{ 'x': 1, 'y': 2 }], 'x')
    assert.deepStrictEqual(actual, [{ 'x': 1, 'y': 1 }])
  })
})
