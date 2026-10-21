const _ = require('lodash')
let loader = null
const t = require('node:assert')

suite('Loader', () => {
  setup(() => {
    loader = require('../lib/loader')
  })

  suite('#getDomains', () => {
    test('should load domains from plain text file', () => {
      const domains = loader.getDomains('test/list.test.txt')
      const expected = ['one.com', 'two.org', 'three.net']
      domains.toString().should.equal(expected.toString())
    })
  })

  suite('#getList', () => {
    test('should return an array', () => {
      t.ok(_.isArray(loader.getList()))
    })

    test('should return an array of string', () => {
      loader.getList().forEach((v, i) => {
        t.ok(_.isString(v), `index ${i}`)
      })
    })
  })
})
