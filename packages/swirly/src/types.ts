import { Writable } from 'stream'

import { rasterizers } from './rasterizers'
import { stylesByTheme } from './themes'

export type RasterizerName = keyof typeof rasterizers

export type ThemeName = keyof typeof stylesByTheme

export type CommandLineOptions = {
  inFilePath: string
  outFilePath: string | null
  theme: ThemeName
  force: boolean
  optimize: boolean
  scale: number
  rasterizer: RasterizerName
}

export type FormatOutputOptions = {
  xml: string
  width: number
  height: number
  scale: number
  filename: string | null
  rasterizer: RasterizerName
}

export type WriteStreamFactory = (
  file: string | null,
  force: boolean
) => Writable

export type Writer = {
  match: (file: string | null) => boolean
  formatOutput: (options: FormatOutputOptions) => Promise<string | Buffer>
  createWriteStream: WriteStreamFactory
}
