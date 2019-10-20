const { isNumeric } = require('../util/is-numeric')

const reLine = /^(.*?)(?:\s*(:?)=\s*(.*))?$/

const parseValue = value => {
  if (value == null) {
    return true
  }
  if (isNumeric(value)) {
    return parseFloat(value)
  }
  return value
}

const parseConfig = (lines, allowAssignment) => {
  const config = {}
  if (allowAssignment) {
    config.values = {}
  }

  for (const line of lines) {
    const match = reLine.exec(line.trim())
    if (match != null) {
      const [, name, isAssignment, value] = match
      if (isAssignment) {
        config.values[name] = value
      } else {
        config[name] = parseValue(value)
      }
    }
  }

  return config
}

module.exports = { parseConfig }
