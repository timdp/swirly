import { RasterizationServer } from '@swirly/rasterization-server'
import { RasterizerName } from '@swirly/types'
import yargs from 'yargs'

import { stylesByTheme } from './themes'
import { CommandLineOptions, ThemeName } from './types'

export const getOpts = (): CommandLineOptions => {
  const argv = yargs
    .usage('$0 <input> [output]')
    .demand(1)
    .option('t', {
      type: 'string',
      alias: 'theme',
      description: 'Theme',
      choices: Object.keys(stylesByTheme),
      default: 'light'
    })
    .option('f', {
      type: 'boolean',
      alias: 'force',
      description: 'Force overwrite'
    })
    .options('o', {
      type: 'boolean',
      alias: 'optimize',
      description: 'Optimize SVG output using SVGO'
    })
    .option('z', {
      type: 'number',
      alias: 'scale',
      description: 'Image scale (raster images only)',
      default: 100
    })
    .option('r', {
      type: 'string',
      alias: 'rasterizer',
      description: 'Method for rasterizing images',
      choices: RasterizationServer.RASTERIZER_NAMES,
      default: 'puppeteer'
    })
    .option('rasterization-server', {
      type: 'string',
      description: 'URL to rasterization server'
    })
    .strict()
    .parse()

  const inFilePath = String(argv._[0])
  const outFilePath = argv._[1] !== '-' ? String(argv._[1]) : null

  const theme = argv.theme as ThemeName
  const force = argv.force as boolean
  const optimize = argv.optimize as boolean
  const scale = argv.scale as number
  const rasterizer = argv.rasterizer as RasterizerName
  const rasterizationServer = argv.rasterizationServer as string

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
