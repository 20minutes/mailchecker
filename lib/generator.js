const glob = require('glob')
const async = require('async')
const fs = require('node:fs')
const p = require('node:path')
const mu = require('mu2')
const EventEmitter2 = require('eventemitter2').EventEmitter2
const loader = require('./loader')

const Generator = new EventEmitter2({
  wildcard: true,
})

Generator.DIR = p.resolve(__dirname, '../platform')

Generator.getTemplatesSync = function () {
  return glob.sync(p.resolve(this.DIR, './node/*.tmpl.js')).map(this.parsePath)
}

Generator.parsePath = (fullpath) => {
  const dir = p.dirname(fullpath)
  const output = p.basename(fullpath).replace('.tmpl', '')
  return {
    fullpath: fullpath,
    fullOutputPath: p.resolve(dir, output),
    dir: dir,
    template: p.basename(fullpath),
    output: output,
  }
}

// Based on PHP FILTER_VALIDATE_EMAIL
// See https://fightingforalostcause.net/content/misc/2006/compare-email-regex.php
const unanchoredRegexpString =
  '(?!(?:(?:\\x22?\\x5C[\\x00-\\x7E]\\x22?)|(?:\\x22?[^\\x5C\\x22]\\x22?)){255,})(?!(?:(?:\\x22?\\x5C[\\x00-\\x7E]\\x22?)|(?:\\x22?[^\\x5C\\x22]\\x22?)){65,}@)(?:(?:[\\x21\\x23-\\x27\\x2A\\x2B\\x2D\\x2F-\\x39\\x3D\\x3F\\x5E-\\x7E]+)|(?:\\x22(?:[\\x01-\\x08\\x0B\\x0C\\x0E-\\x1F\\x21\\x23-\\x5B\\x5D-\\x7F]|(?:\\x5C[\\x00-\\x7F]))*\\x22))(?:\\.(?:(?:[\\x21\\x23-\\x27\\x2A\\x2B\\x2D\\x2F-\\x39\\x3D\\x3F\\x5E-\\x7E]+)|(?:\\x22(?:[\\x01-\\x08\\x0B\\x0C\\x0E-\\x1F\\x21\\x23-\\x5B\\x5D-\\x7F]|(?:\\x5C[\\x00-\\x7F]))*\\x22)))*@(?:(?:(?!.*[^.]{64,})(?:(?:(?:xn--)?[a-z0-9]+(?:-[a-z0-9]+)*\\.){1,126}){1,}(?:(?:[a-z][a-z0-9]*)|(?:(?:xn--)[a-z0-9]+))(?:-[a-z0-9]+)*)|(?:\\[(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})|(?:(?!(?:.*[a-f0-9][:\\]]){7,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?)))|(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){5}:)|(?:(?!(?:.*[a-f0-9]:){5,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3}:)?)))?(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\\.(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))\\]))'

Generator.getDomainList = () => loader.getList().map((domain) => domain.toLowerCase())

Generator.compile = function (fn) {
  const templates = this.getTemplatesSync()
  const list = Generator.getDomainList()
  const listJSON = JSON.stringify(list)
  const listSTR = listJSON.substring(1, listJSON.length - 1)

  mu.clearCache()
  this.emit('loaded:list', list)

  function iter(template, done) {
    let d = ''
    this.emit('compiling:template', template)

    mu.compileAndRender(template.fullpath, {
      unanchoredRegexpString: unanchoredRegexpString,
      listSTR: listSTR,
    })
      .on('data', (data) => {
        d += data
      })
      .on(
        'end',
        function () {
          this.emit('writing:template', template)
          fs.writeFile(template.fullOutputPath, d, done)
        }.bind(this)
      )
      .on('error', function (err) {
        this.emit('error:template', template, err)
        done(err)
      })
  }

  async.eachLimit(templates, 5, iter.bind(this), fn)
}

module.exports = Generator
