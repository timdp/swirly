#!/usr/bin/env node

const YAML = require('js-yaml')
const yargs = require('yargs')
const { drawMarbleDiagram, parseMarbleDiagramSpec } = require('../')
const { svgToImage } = require('../lib/svg-to-image')
const fs = require('fs')
const path = require('path')

const { _: filePaths, force, scale } = yargs
  .usage('$0 [-f] input output')
  .demand(1)
  .option('f', {
    type: 'boolean',
    alias: 'force',
    description: 'Force overwrite'
  })
  .option('scale', {
    type: 'number',
    description: 'Image scale (not used for SVG)',
    default: 100
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
  : parseMarbleDiagramSpec(inFileContents)

const { xml, width, height } = drawMarbleDiagram(spec)

if (outFilePath == null) {
  console.info(xml)
} else if (['.png', '.jpg'].includes(path.extname(outFilePath))) {
  svgToImage(
    xml,
    (width * scale) / 100,
    (height * scale) / 100,
    outFilePath
  ).catch(err => {
    console.error(err)
    process.exit(3)
  })
} else {
  fs.writeFileSync(outFilePath, xml, 'utf8')
}
