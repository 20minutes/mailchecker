const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')
const { describe, it } = require('node:test')
const { compile } = require('../lib/generator')
const loader = require('../lib/loader')

const root = path.resolve(__dirname, '..')
const outputPath = path.join(root, 'platform/node/index.js')

describe('Generator', () => {
  it('reproduces the generated Node.js module byte for byte', () => {
    const expected = fs.readFileSync(outputPath)

    compile()

    assert.deepEqual(fs.readFileSync(outputPath), expected)
  })

  it('renders lowercase domains without interpreting replacement patterns', (t) => {
    t.mock.method(loader, 'getList', () => ['YOPMAIL.COM', '$&.EXAMPLE'])
    const write = t.mock.method(fs, 'writeFileSync', () => {})

    compile()

    assert.equal(write.mock.callCount(), 1)
    const [file, output] = write.mock.calls[0].arguments
    assert.equal(file, outputPath)
    assert.ok(output.includes('new Set(["yopmail.com","$&.example"])'))
    assert.ok(!output.includes('{{&'))
  })

  it('propagates template read errors', (t) => {
    const error = new Error('Template unavailable')
    t.mock.method(loader, 'getList', () => ['example.com'])
    t.mock.method(fs, 'readFileSync', () => {
      throw error
    })

    assert.throws(compile, error)
  })

  it('propagates output write errors', (t) => {
    const error = new Error('Output unavailable')
    t.mock.method(fs, 'writeFileSync', () => {
      throw error
    })

    assert.throws(compile, error)
  })

  describe('CLI', () => {
    it('reports success when compilation succeeds', () => {
      const result = spawnSync(
        process.execPath,
        ['-e', "require('./lib/generator').compile = () => {}; require('./gen');"],
        { cwd: root, encoding: 'utf8' }
      )

      assert.equal(result.status, 0)
      assert.match(result.stdout, /Done\./)
      assert.equal(result.stderr, '')
    })

    it('fails the build when compilation fails', () => {
      const result = spawnSync(
        process.execPath,
        [
          '-e',
          "require('./lib/generator').compile = () => { throw new Error('Compilation failed'); }; require('./gen');",
        ],
        { cwd: root, encoding: 'utf8' }
      )

      assert.equal(result.status, 1)
      assert.match(result.stderr, /Compilation failed/)
      assert.doesNotMatch(result.stdout, /Done\./)
    })
  })
})
