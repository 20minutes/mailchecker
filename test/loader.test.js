const assert = require('node:assert/strict')
const path = require('node:path')
const { describe, it } = require('node:test')
const loader = require('../lib/loader')

describe('Loader', () => {
  it('loads domains from a plain text file', () => {
    const domains = loader.getDomains(path.join(__dirname, 'list.test.txt'))

    assert.deepEqual(domains, ['one.com', 'two.org', 'three.net'])
  })

  it('returns a non-empty array of strings', () => {
    const domains = loader.getList()

    assert.ok(Array.isArray(domains))
    assert.ok(domains.length > 0)
    domains.forEach((domain) => {
      assert.equal(typeof domain, 'string')
    })
  })

  it('removes duplicate domains while preserving their order', (t) => {
    t.mock.method(loader, 'getDomains', () => ['two.org', 'one.com', 'two.org'])

    assert.deepEqual(loader.getList(), ['two.org', 'one.com'])
  })
})
