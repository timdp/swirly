const { rasterizeSvg: inkscape } = require('swirly-rasterizer-inkscape')
const { rasterizeSvg: puppeteer } = require('swirly-rasterizer-puppeteer')

const rasterizers = {
  inkscape,
  puppeteer
}

module.exports = { rasterizers }
