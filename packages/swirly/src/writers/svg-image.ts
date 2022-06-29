import { Writer } from '../types.js'
import { createWriteStreamFactory, defaultFormatOutput } from './util.js'

export const svgImageWriter: Writer = {
  match: () => true,
  formatOutput: defaultFormatOutput,
  createWriteStream: createWriteStreamFactory('utf8')
}
