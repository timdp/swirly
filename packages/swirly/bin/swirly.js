#!/usr/bin/env node

require('hard-rejection/register')
const { drawMarbleDiagram } = require('swirly-renderer-node')
const streamToPromise = require('stream-to-promise')
const { getOpts } = require('../lib/get-opts')
const { optimizeXml } = require('../lib/optimize-xml')
const { readDiagramSpec } = require('../lib/read-diagram-spec')
const { stylesByTheme } = require('../lib/themes')
const { writers } = require('../lib/writers')

;(async () => {
  const {
    inFilePath,
    outFilePath,
    theme,
    force,
    optimize,
    scale,
    rasterizer
  } = getOpts()

  const spec = await readDiagramSpec(inFilePath)
  const styles = stylesByTheme[theme]
  const writer = writers.find(writer => writer.match(outFilePath))

  const { xml: unoptXml, width, height } = drawMarbleDiagram(spec, { styles })
  const xml = optimize ? await optimizeXml(unoptXml) : unoptXml

  const output = await writer.formatOutput({
    xml,
    width,
    height,
    scale,
    filename: outFilePath,
    rasterizer
  })

  const outStream = writer.createWriteStream(outFilePath, force)
  const writing = streamToPromise(outStream)
  outStream.end(output)
  await writing
})()
