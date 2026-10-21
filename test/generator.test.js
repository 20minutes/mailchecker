const t = require('node:assert')
const _ = require('lodash')
const Generator = require('../lib/generator')

suite('Generator', () => {
  setup(() => {
    // ...
  })

  suite('.getTemplatesSync', () => {
    test('should only return the Node.js template', () => {
      Generator.getTemplatesSync()
        .map((template) => template.fullOutputPath)
        .should.eql([require('node:path').resolve(__dirname, '../platform/node/index.js')])
    })

    test('should return an array', () => {
      t.ok(_.isArray(Generator.getTemplatesSync()))
    })

    test('should return an array of object', () => {
      Generator.getTemplatesSync().forEach((v) => {
        t.ok(_.isPlainObject(v))
      })
    })
  })

  suite('.parsePath', () => {
    test('should parse specified path', () => {
      const fullpath = '/a/b/c/mailchecker/platform/node/index.tmpl.js'
      const r = Generator.parsePath(fullpath)
      r.should.eql({
        fullpath: fullpath,
        fullOutputPath: '/a/b/c/mailchecker/platform/node/index.js',
        dir: '/a/b/c/mailchecker/platform/node',
        template: 'index.tmpl.js',
        output: 'index.js',
      })
    })
  })

  suite('.getDomainList', () => {
    test('should return a non-empty list of lowercase strings', () => {
      const r = Generator.getDomainList()

      r.length.should.be.above(0)

      r.forEach((domain) => {
        domain.should.eql(domain.toLowerCase())
      })
    })
  })

  suite('CLI', () => {
    test('should fail the build when compilation fails', () => {
      const result = require('node:child_process').spawnSync(
        process.execPath,
        [
          '-e',
          "require('./lib/generator').compile = function (done) { done(new Error('Compilation failed')); }; require('./gen');",
        ],
        { cwd: require('node:path').resolve(__dirname, '..'), encoding: 'utf8' }
      )

      t.strictEqual(result.status, 1)
      t.ok(result.stderr.includes('Compilation failed'))
    })
  })

  suite('.compile', () => {
    test('should compile all templates', (tdone) => {
      // Generator.on('*', function (template) {
      //   console.info(this.event, template.template);
      // });
      Generator.compile((err) => {
        t.deepEqual(err, null)
        tdone()
      })
    })
  })
})
