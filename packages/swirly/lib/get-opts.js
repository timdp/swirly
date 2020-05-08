const yargs = require('yargs')
const { rasterizers } = require('./rasterizers')
const { stylesByTheme } = require('./themes')

const getOpts = () => {
  const { _: filePaths, theme, force, optimize, scale, rasterizer } = yargs
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
      choices: Object.keys(rasterizers),
      default: 'puppeteer'
    })
    .strict()
    .parse()

  const inFilePath = filePaths[0]
  const outFilePath = filePaths[1] !== '-' ? filePaths[1] : null

  return { inFilePath, outFilePath, theme, force, optimize, scale, rasterizer }
}

module.exports = { getOpts }
