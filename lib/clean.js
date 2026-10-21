const fs = require('node:fs')
const p = require('node:path')
const psl = require('psl')

const path = p.resolve(__dirname, '../list.txt')
const rawList = [...new Set(fs.readFileSync(path).toString().trim().split('\n'))].sort()

const cleanedList = rawList.filter((domain) => psl.parse(domain).listed)

fs.writeFileSync(path, cleanedList.join('\n'))
