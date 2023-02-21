#!/usr/bin/env node

import 'source-map-support/register.js'

import { renderMarbleDiagram } from '@swirly/renderer-node'
import streamToPromise from 'stream-to-promise'

import { getOpts } from './get-opts.js'
import { optimizeXml } from './optimize-xml.js'
import { readDiagramSpec } from './read-diagram-spec.js'
import { stylesByTheme } from './themes.js'
import { CommandLineOptions, Writer } from './types.js'
import { writers } from './writers/index.js'

const {
  inFilePath,
  outFilePath,
  theme,
  force,
  optimize,
  scale,
  rasterizer,
  rasterizationServer
}: CommandLineOptions = getOpts()

const spec = await readDiagramSpec(inFilePath)
const styles = stylesByTheme[theme]
const writer = writers.find((writer: Writer) => writer.match(outFilePath))!

const { xml: unoptXml, width, height } = renderMarbleDiagram(spec, { styles })
const xml = optimize ? optimizeXml(unoptXml) : unoptXml

const output = await writer.formatOutput({
  xml,
  width,
  height,
  scale,
  filename: outFilePath,
  rasterizer,
  rasterizationServer
})

const outStream = writer.createWriteStream(outFilePath, force)
const writing = streamToPromise(outStream)
outStream.end(output)
await writing
