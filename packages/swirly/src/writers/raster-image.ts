import { RasterizationClient } from '@swirly/rasterization-client'
import { RasterizationServer } from '@swirly/rasterization-server'
import { RasterizerOutputFormat } from '@swirly/types'
import path from 'node:path'

import { RASTER_EXTENSIONS } from '../constants.js'
import { FormatOutputOptions, Writer } from '../types.js'
import { createWriteStreamFactory } from './util.js'

const getFormatFromFilename = (filename: string): RasterizerOutputFormat =>
  path.extname(filename).toLowerCase() === '.png' ? 'png' : 'jpeg'

const match = (file: string | null): boolean =>
  RASTER_EXTENSIONS.includes(path.extname(file as string).toLowerCase())

const startServerSession = async (
  rasterizationServer?: string
): Promise<{ serverUrl: string; end: () => Promise<void> }> => {
  if (rasterizationServer != null) {
    return {
      serverUrl: rasterizationServer,
      end: async () => {}
    }
  }
  const server = new RasterizationServer()
  await server.start()
  return {
    serverUrl: server.url,
    end: async () => {
      await server.stop()
    }
  }
}

const formatOutput = async ({
  xml,
  width,
  height,
  scale,
  filename,
  rasterizer,
  rasterizationServer
}: FormatOutputOptions): Promise<Buffer> => {
  const scaledWidth = Math.round((width * scale) / 100)
  const scaledHeight = Math.round((height * scale) / 100)
  const format = getFormatFromFilename(filename as string)
  const session = await startServerSession(rasterizationServer)
  let output: Buffer
  try {
    const client = new RasterizationClient(session.serverUrl)
    output = await client.rasterize(
      rasterizer,
      xml,
      scaledWidth,
      scaledHeight,
      format
    )
  } catch (err) {
    await session.end()
    throw err
  }
  await session.end()
  return output
}

export const rasterImageWriter: Writer = {
  match,
  formatOutput,
  createWriteStream: createWriteStreamFactory()
}
