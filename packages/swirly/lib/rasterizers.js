const { rasterizeSvg: imagemagick } = require('swirly-rasterizer-imagemagick')
const { rasterizeSvg: inkscape } = require('swirly-rasterizer-inkscape')
const { rasterizeSvg: puppeteer } = require('swirly-rasterizer-puppeteer')

const rasterizers = {
  imagemagick,
  inkscape,
  puppeteer
}

module.exports = { rasterizers }
