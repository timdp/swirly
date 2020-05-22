import path from 'path'
import { Rasterizer, RasterizerOutputFormat } from 'swirly-types'

import { RASTER_EXTENSIONS } from '../constants'
import { rasterizers } from '../rasterizers'
import { FormatOutputOptions, Writer } from '../types'
import { createWriteStreamFactory } from './util'

const getFormatFromFilename = (filename: string): RasterizerOutputFormat =>
  path.extname(filename).toLowerCase() === '.png' ? 'png' : 'jpeg'

const match = (file: string | null): boolean =>
  RASTER_EXTENSIONS.includes(path.extname(file as string).toLowerCase())

const formatOutput = async ({
  xml,
  width,
  height,
  scale,
  filename,
  rasterizer
}: FormatOutputOptions): Promise<Buffer> => {
  const rasterizeSvg: Rasterizer = rasterizers[rasterizer]
  const scaledWidth = Math.round((width * scale) / 100)
  const scaledHeight = Math.round((height * scale) / 100)
  const format = getFormatFromFilename(filename as string)
  return rasterizeSvg(xml, scaledWidth, scaledHeight, format)
}

export const rasterImageWriter: Writer = {
  match,
  formatOutput,
  createWriteStream: createWriteStreamFactory()
}
