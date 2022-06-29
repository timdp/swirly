import { RasterizationServer } from '@swirly/rasterization-server'
import { RasterizerName } from '@swirly/types'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { stylesByTheme } from './themes.js'
import { CommandLineOptions, ThemeName } from './types.js'

export const getOpts = (): CommandLineOptions => {
  const argv = yargs(hideBin(process.argv))
    .usage('$0 <input> [output]')
    .demand(1)
    .options({
      theme: {
        type: 'string',
        alias: 't',
        description: 'Theme',
        choices: Object.keys(stylesByTheme),
        default: 'light'
      },
      force: {
        type: 'boolean',
        alias: 'f',
        description: 'Force overwrite'
      },
      optimize: {
        type: 'boolean',
        alias: 'o',
        description: 'Optimize SVG output using SVGO'
      },
      scale: {
        type: 'number',
        alias: 'z',
        description: 'Image scale (raster images only)',
        default: 100
      },
      rasterizer: {
        type: 'string',
        alias: 'r',
        description: 'Method for rasterizing images',
        choices: RasterizationServer.RASTERIZER_NAMES,
        default: 'puppeteer'
      },
      'rasterization-server': {
        type: 'string',
        description: 'URL to rasterization server'
      }
    })
    .strict()
    .parseSync()

  const inFilePath = String(argv._[0])
  const outFilePath = argv._[1] !== '-' ? String(argv._[1]) : null

  const { force = false, optimize = false, scale, rasterizationServer } = argv
  const theme = argv.theme as ThemeName
  const rasterizer = argv.rasterizer as RasterizerName

  return {
    inFilePath,
    outFilePath,
    theme,
    force,
    optimize,
    scale,
    rasterizer,
    rasterizationServer
  }
}
