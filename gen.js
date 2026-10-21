#!/usr/bin/env node

const { compile } = require('./lib/generator')

console.info('Compiling Node.js module...')
try {
  compile()
  console.info('Done.')
} catch (err) {
  console.error(err)
  process.exitCode = 1
}
