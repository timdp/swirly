const sha1 = require('simple-sha1')
const { hexToDec } = require('./hex-to-dec')

const stringToColor = (str, mode) => {
  const hashHex = sha1.sync(str)
  const hash = hexToDec(hashHex.substr(4, 4))
  const hue = Math.round((hash / (1 << 16)) * 360)
  const saturation = 60
  const lightness = mode === 'dark' ? 20 : 80
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

module.exports = { stringToColor }
