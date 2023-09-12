import assert from 'assert'
import lodashStable from 'lodash'
import { falsey, stubThree } from './utils'
import repeat from '../repeat.js'

describe('repeat', () => {
  const string = 'abc'

  it('should repeat a string `n` times', () => {
    assert.strictEqual(repeat('*', 3), '***')
    assert.strictEqual(repeat(string, 2), 'abcabc')
  })

  // TODO: coercion was removed in bb7c959479 
  it.skip('should treat falsey `n` values, except `undefined`, as `0`', () => {
    const expected = lodashStable.map(falsey, (value) => value === undefined ? string : '')

    const actual = lodashStable.map(falsey, (n, index) => index ? repeat(string, n) : repeat(string))

    assert.deepStrictEqual(actual, expected)
  })

  it('should return an empty string if `n` is <= `0`', () => {
    assert.strictEqual(repeat(string, 0), '')
    assert.strictEqual(repeat(string, -2), '')
  })

  // TODO: coercion was removed in bb7c959479 
  it.skip('should coerce `n` to an integer', () => {
    assert.strictEqual(repeat(string, '2'), 'abcabc')
    assert.strictEqual(repeat(string, 2.6), 'abcabc')
    assert.strictEqual(repeat('*', { 'valueOf': stubThree }), '***')
  })

  it('should coerce `string` to a string', () => {
    assert.strictEqual(repeat(Object(string), 2), 'abcabc')
    assert.strictEqual(repeat({ 'toString': lodashStable.constant('*') }, 3), '***')
  })

  // TODO: fails, likely bc of map impl change where iteratee receives array as third arg
  it.skip('should work as an iteratee for methods like `_.map`', () => {
    const actual = lodashStable.map(['a', 'b', 'c'], repeat)
    assert.deepStrictEqual(actual, ['a', 'b', 'c'])
  })
})
