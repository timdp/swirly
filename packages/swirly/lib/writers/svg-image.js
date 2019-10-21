const { createWriteStreamFactory, defaultFormatOutput } = require('./util')

const match = () => true

const formatOutput = defaultFormatOutput

const createWriteStream = createWriteStreamFactory('utf8')

const svgImageWriter = {
  match,
  formatOutput,
  createWriteStream
}

module.exports = { svgImageWriter }
