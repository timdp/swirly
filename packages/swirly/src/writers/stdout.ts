import { Writer } from '../types.js'
import { defaultFormatOutput } from './util.js'

export const stdoutWriter: Writer = {
  match: (file: string | null) => file == null,
  formatOutput: defaultFormatOutput,
  createWriteStream: () => process.stdout
}
