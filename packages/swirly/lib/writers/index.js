const { stdoutWriter } = require('./stdout')
const { rasterImageWriter } = require('./raster-image')
const { svgImageWriter } = require('./svg-image')

const writers = [stdoutWriter, rasterImageWriter, svgImageWriter]

module.exports = { writers }
