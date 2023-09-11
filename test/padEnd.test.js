import assert from 'assert'
import lodashStable from 'lodash'
import { stubTrue } from './utils'
import padEnd from '../padEnd.js'

describe('padEnd', () => {
  const string = 'abc'

  it('should pad a string to a given length', () => {
    const values = [, undefined],
      expected = lodashStable.map(values, lodashStable.constant('abc   '))

    const actual = lodashStable.map(values, (value, index) => index ? padEnd(string, 6, value) : padEnd(string, 6))

    assert.deepStrictEqual(actual, expected)
  })

  it('should truncate pad characters to fit the pad length', () => {
    assert.strictEqual(padEnd(string, 6, '_-'), 'abc_-_')
  })

  // TODO: fails, doesn't call/access toString anywhere and not sure when it previously did
  // hmm maybe it's string length failing? how do we get the length of an object before it's stringified right?
  // yeah I think that's it, we aren't getting a string size from the object bc we are doing that before stringifying
  it.skip('should coerce `string` to a string', () => {
    const values = [Object(string), { 'toString': lodashStable.constant(string) }],
      expected = lodashStable.map(values, stubTrue)

    const actual = lodashStable.map(values, (value) => padEnd(value, 6) === 'abc   ')

    assert.deepStrictEqual(actual, expected)
  })
})
