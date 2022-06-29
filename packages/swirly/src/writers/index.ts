import { Writer } from '../types.js'
import { rasterImageWriter } from './raster-image.js'
import { stdoutWriter } from './stdout.js'
import { svgImageWriter } from './svg-image.js'

export const writers: readonly Writer[] = [
  stdoutWriter,
  rasterImageWriter,
  svgImageWriter
]
