import { Writable } from 'node:stream'

import { RasterizerName } from '@swirly/types'

import { stylesByTheme } from './themes.js'

export type ThemeName = keyof typeof stylesByTheme

export type CommandLineOptions = {
  inFilePath: string
  outFilePath: string | null
  theme: ThemeName
  force: boolean
  optimize: boolean
  scale: number
  rasterizer: RasterizerName
  rasterizationServer?: string
}

export type FormatOutputOptions = {
  xml: string
  width: number
  height: number
  scale: number
  filename: string | null
  rasterizer: RasterizerName
  rasterizationServer?: string
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
