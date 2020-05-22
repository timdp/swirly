import { Writer } from '../types'
import { createWriteStreamFactory, defaultFormatOutput } from './util'

export const svgImageWriter: Writer = {
  match: () => true,
  formatOutput: defaultFormatOutput,
  createWriteStream: createWriteStreamFactory('utf8')
}
