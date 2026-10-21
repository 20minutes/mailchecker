const fs = require('node:fs')
const p = require('node:path')
const _ = require('lodash')

/**
 * Load and make an uniq list of throwable email domain
 * @type {Object}
 */
const loader = {
  getList: function () {
    const path = p.resolve(__dirname, '../list.txt')
    return _.uniq(this.getDomains(path))
  },

  getDomains: (path) => fs.readFileSync(path).toString().trim().split('\n'),
}

module.exports = loader
