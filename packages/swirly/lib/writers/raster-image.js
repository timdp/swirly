const { rasterizeSvg } = require('swirly-rasterizer')
const path = require('path')
const { createWriteStreamFactory } = require('./util')
const { RASTER_EXTENSIONS } = require('../constants')

const match = file => RASTER_EXTENSIONS.includes(path.extname(file))

const formatOutput = async (xml, width, height, scale) =>
  rasterizeSvg(
    xml,
    Math.round((width * scale) / 100),
    Math.round((height * scale) / 100)
  )

const createWriteStream = createWriteStreamFactory(null)

const rasterImageWriter = {
  match,
  formatOutput,
  createWriteStream
}

module.exports = { rasterImageWriter }
