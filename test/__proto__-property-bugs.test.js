import assert from 'assert'
import lodashStable from 'lodash'
import { LARGE_ARRAY_SIZE, isEven, _, create, stubFalse, objectProto, funcProto } from './utils'
import difference from '../difference.js'
import intersection from '../intersection.js'
import uniq from '../uniq.js'
import without from '../without.js'
import groupBy from '../groupBy.js'
import merge from '../merge.js'

describe('`__proto__` property bugs', () => {
  it('should work with the "__proto__" key in internal data objects', () => {
    const stringLiteral = '__proto__',
      stringObject = Object(stringLiteral),
      expected = [stringLiteral, stringObject]

    const largeArray = lodashStable.times(LARGE_ARRAY_SIZE, (count) => isEven(count) ? stringLiteral : stringObject)

    assert.deepStrictEqual(difference(largeArray, largeArray), [])
    assert.deepStrictEqual(intersection(largeArray, largeArray), expected)
    assert.deepStrictEqual(uniq(largeArray), expected)
    assert.deepStrictEqual(without.apply(_, [largeArray].concat(largeArray)), [])
  })

  it.skip('should treat "__proto__" as a regular key in assignments', () => {
    const methods = [
      'assign',
      'assignIn',
      'defaults',
      'defaultsDeep',
      'merge'
    ]

    const source = create(null)
    source.__proto__ = []

    const expected = lodashStable.map(methods, stubFalse)

    let actual = lodashStable.map(methods, (methodName) => {
      const result = _[methodName]({}, source)
      return result instanceof Array
    })

    assert.deepStrictEqual(actual, expected)

    // TODO: this fails since the source was changed to not support shorthand access
    // see commit 5baad4df1015
    // https://github.com/lodash/lodash/commit/5baad4df101599af5b4c80df210b0581651ddedb
    actual = groupBy([{ 'a': '__proto__' }], 'a')
    assert.ok(!(actual instanceof Array))
  })

  // TODO: safeGet doesn't seem to be used, which was introduced in d8e069cc34 when this original test was
  it.skip('should not merge "__proto__" properties', () => {
    if (JSON) {
      merge({}, JSON.parse('{"__proto__":{"a":1}}'))

      const actual = 'a' in objectProto
      delete objectProto.a

      assert.ok(!actual)
    }
  })

  it('should not indirectly merge builtin prototype properties', () => {
    merge({}, { 'toString': { 'constructor': { 'prototype': { 'a': 1 } } } })

    let actual = 'a' in funcProto
    delete funcProto.a

    assert.ok(!actual)

    merge({}, { 'constructor': { 'prototype': { 'a': 1 } } })

    actual = 'a' in objectProto
    delete objectProto.a

    assert.ok(!actual)
  })

  it('should not indirectly merge `Object` properties', () => {
    merge({}, { 'constructor': { 'a': 1 } })

    const actual = 'a' in Object
    delete Object.a

    assert.ok(!actual)
  })
})
