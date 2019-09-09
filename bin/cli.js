#!/usr/bin/env node

const YAML = require('js-yaml')
const yargs = require('yargs')
const { draw, parseMarbles } = require('../lib/')
const fs = require('fs')
const path = require('path')

const { _: filePaths, force } = yargs
  .usage('$0 [-f] input output')
  .demand(1)
  .option('f', {
    type: 'boolean',
    alias: 'force',
    description: 'Force overwrite'
  })
  .strict()
  .parse()

const inFilePath = filePaths[0]
const outFilePath = filePaths[1] !== '-' ? filePaths[1] : null

if (!force && outFilePath != null && fs.existsSync(outFilePath)) {
  console.error(`File exists: ${outFilePath}`)
  process.exit(2)
}

const inFileContents = fs.readFileSync(inFilePath, 'utf8')

const spec = ['.yml', '.yaml'].includes(path.extname(inFilePath))
  ? YAML.safeLoad(inFileContents)
  : parseMarbles(inFileContents)
const { document } = draw(spec)
const xml = document.toString()

if (outFilePath != null) {
  fs.writeFileSync(outFilePath, xml, 'utf8')
} else {
  console.info(xml)
}
