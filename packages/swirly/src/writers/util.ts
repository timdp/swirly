import fs from 'node:fs'

import { FormatOutputOptions, WriteStreamFactory } from '../types.js'

export const createWriteStreamFactory =
  (encoding?: BufferEncoding): WriteStreamFactory =>
    (file: string | null, force: boolean) =>
      fs.createWriteStream(file as string, {
        flags: force ? 'w' : 'wx',
        encoding
      })

export const defaultFormatOutput = async ({
  xml
}: FormatOutputOptions): Promise<string> => xml
