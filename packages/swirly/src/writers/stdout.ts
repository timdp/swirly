import { Writer } from '../types'
import { defaultFormatOutput } from './util'

export const stdoutWriter: Writer = {
  match: (file: string | null) => file == null,
  formatOutput: defaultFormatOutput,
  createWriteStream: () => process.stdout
}
