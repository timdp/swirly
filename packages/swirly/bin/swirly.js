#!/usr/bin/env node

require('hard-rejection/register')
const { drawMarbleDiagram } = require('swirly-renderer-node')
const streamToPromise = require('stream-to-promise')
const { getOpts } = require('../lib/get-opts')
const { readDiagramSpec } = require('../lib/read-diagram-spec')
const { optimizeXml } = require('../lib/optimize-xml')
const { writers } = require('../lib/writers')

;(async () => {
  const { inFilePath, outFilePath, force, optimize, scale } = getOpts()

  const writer = writers.find(writer => writer.match(outFilePath))

  const spec = await readDiagramSpec(inFilePath)

  const { xml: unoptXml, width, height } = drawMarbleDiagram(spec)
  const xml = optimize ? await optimizeXml(unoptXml) : unoptXml

  const output = await writer.formatOutput(xml, width, height, scale)

  const outStream = writer.createWriteStream(outFilePath, force)
  const writing = streamToPromise(outStream)
  outStream.end(output)
  await writing
})()
