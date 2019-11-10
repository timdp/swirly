const { rasterizeSvg: cairo } = require('swirly-rasterizer-cairo')
const { rasterizeSvg: imagemagick } = require('swirly-rasterizer-imagemagick')
const { rasterizeSvg: inkscape } = require('swirly-rasterizer-inkscape')
const { rasterizeSvg: puppeteer } = require('swirly-rasterizer-puppeteer')

const rasterizers = {
  cairo,
  imagemagick,
  inkscape,
  puppeteer
}

module.exports = { rasterizers }
