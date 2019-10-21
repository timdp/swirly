const yargs = require('yargs')

const getOpts = () => {
  const { _: filePaths, force, optimize, scale } = yargs
    .usage('$0 <input> [output]')
    .demand(1)
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
    .strict()
    .parse()

  const inFilePath = filePaths[0]
  const outFilePath = filePaths[1] !== '-' ? filePaths[1] : null

  return { inFilePath, outFilePath, force, optimize, scale }
}

module.exports = { getOpts }
