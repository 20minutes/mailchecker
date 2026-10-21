#!/usr/bin/env node

console.info('Compiling libraries from templates...')
const gen = require('./lib/generator')
const _ = require('lodash')

gen.on('*', function (v) {
  if (_.isArray(v)) {
    v = v.length
  } else {
    v = v.template
  }
  console.info('[', this.event, ']\t', v)
})

gen.compile((err) => {
  if (err) {
    console.error(err)
    process.exitCode = 1
    return
  }
  console.info('Done.')
})
