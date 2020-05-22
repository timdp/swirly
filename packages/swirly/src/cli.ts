#!/usr/bin/env node

import 'source-map-support/register'
import 'hard-rejection/register'

import streamToPromise from 'stream-to-promise'
import { renderMarbleDiagram } from 'swirly-renderer-node'

import { getOpts } from './get-opts'
import { optimizeXml } from './optimize-xml'
import { readDiagramSpec } from './read-diagram-spec'
import { stylesByTheme } from './themes'
import { CommandLineOptions, Writer } from './types'
import { writers } from './writers'

const main = async () => {
  const {
    inFilePath,
    outFilePath,
    theme,
    force,
    optimize,
    scale,
    rasterizer
  }: CommandLineOptions = getOpts()

  const spec = await readDiagramSpec(inFilePath)
  const styles = stylesByTheme[theme]
  const writer = writers.find((writer: Writer) => writer.match(outFilePath))!

  const { xml: unoptXml, width, height } = renderMarbleDiagram(spec, { styles })
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
}

main()
