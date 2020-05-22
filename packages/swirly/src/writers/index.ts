import { Writer } from '../types'
import { rasterImageWriter } from './raster-image'
import { stdoutWriter } from './stdout'
import { svgImageWriter } from './svg-image'

export const writers: Writer[] = [
  stdoutWriter,
  rasterImageWriter,
  svgImageWriter
]
