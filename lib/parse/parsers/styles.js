const { parseConfig } = require('./config')
const { STYLES_HEADER } = require('../constants')

const match = line => line === STYLES_HEADER

const run = (lines, { styles }) => {
  const extraStyles = parseConfig(lines.slice(1), false)
  Object.assign(styles, extraStyles)
}

const stylesParser = {
  match,
  run
}

module.exports = { stylesParser }
