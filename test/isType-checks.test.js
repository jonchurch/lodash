import assert from 'assert'
import lodashStable from 'lodash'
import { objToString, objectTag, _, root } from './utils'

describe('isType checks', () => {
  it('should return `false` for subclassed values', () => {
    const funcs = [
      'isArray', 'isBoolean', 'isDate', 'isFunction',
      'isNumber', 'isRegExp', 'isString'
    ]

    lodashStable.each(funcs, (methodName) => {
      function Foo() {}
      Foo.prototype = root[methodName.slice(2)].prototype

      const object = new Foo
      if (objToString.call(object) == objectTag) {
        assert.strictEqual(_[methodName](object), false, `\`_.${methodName}\` returns \`false\``)
      }
    })
  })
})
