#!/usr/bin/env node

require('hard-rejection/register')
const YAML = require('js-yaml')
const SVGO = require('svgo')
const yargs = require('yargs')
const { drawMarbleDiagram, parseMarbleDiagramSpec } = require('../')
const { rasterizeSvg } = require('../lib/rasterize')
const fs = require('fs')
const path = require('path')

const YAML_EXTENSIONS = ['.yml', '.yaml']
const RASTER_EXTENSIONS = ['.png', '.jpg']

const getOpts = () => {
  const { _: filePaths, force, optimize, scale } = yargs
    .usage('$0 [-f] input output')
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

const readSpec = inFilePath => {
  const inFileContents = fs.readFileSync(inFilePath, 'utf8')

  if (YAML_EXTENSIONS.includes(path.extname(inFilePath))) {
    return YAML.safeLoad(inFileContents)
  }

  return parseMarbleDiagramSpec(inFileContents)
}

const optimizeXml = async unoptXml => {
  const svgo = new SVGO({ plugins: [{ removeViewBox: false }] })
  const { data: optXml } = await svgo.optimize(unoptXml)
  return optXml
}

const writers = [
  {
    match: outFilePath => outFilePath == null,
    run: async xml => {
      console.info(xml)
    }
  },
  {
    match: outFilePath => RASTER_EXTENSIONS.includes(path.extname(outFilePath)),
    run: async (xml, outFilePath, width, height, scale) => {
      await rasterizeSvg(
        xml,
        Math.round((width * scale) / 100),
        Math.round((height * scale) / 100),
        outFilePath
      )
    }
  },
  {
    match: () => true,
    run: async (xml, outFilePath) => {
      fs.writeFileSync(outFilePath, xml, 'utf8')
    }
  }
]

const main = async () => {
  const { inFilePath, outFilePath, force, optimize, scale } = getOpts()

  if (!force && outFilePath != null && fs.existsSync(outFilePath)) {
    console.error(`File exists: ${outFilePath}`)
    process.exit(2)
  }

  const { run: write } = writers.find(({ match }) => match(outFilePath))

  const spec = readSpec(inFilePath)
  const { xml: unoptXml, width, height } = drawMarbleDiagram(spec)
  const xml = optimize ? await optimizeXml(unoptXml) : unoptXml
  await write(xml, outFilePath, width, height, scale)
}

main()
