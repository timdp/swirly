const path = require('path')
const { createWriteStreamFactory } = require('./util')
const { rasterizers } = require('../rasterizers')
const { RASTER_EXTENSIONS } = require('../constants')

const getTypeFromFilename = filename =>
  path.extname(filename).toLowerCase() === '.png' ? 'png' : 'jpeg'

const match = filename =>
  RASTER_EXTENSIONS.includes(path.extname(filename).toLowerCase())

const formatOutput = async ({
  xml,
  width,
  height,
  scale,
  filename,
  rasterizer
}) => {
  const rasterizeSvg = rasterizers[rasterizer]
  const scaledWidth = Math.round((width * scale) / 100)
  const scaledHeight = Math.round((height * scale) / 100)
  const type = getTypeFromFilename(filename)
  return rasterizeSvg(xml, scaledWidth, scaledHeight, type)
}

const createWriteStream = createWriteStreamFactory(null)

const rasterImageWriter = {
  match,
  formatOutput,
  createWriteStream
}

module.exports = { rasterImageWriter }
