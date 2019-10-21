const { parseMarbleDiagramSpec } = require('swirly-parser')
const YAML = require('js-yaml')
const fs = require('fs').promises
const path = require('path')
const { YAML_EXTENSIONS } = require('./constants')

const readDiagramSpec = async inFilePath => {
  const inFileContents = await fs.readFile(inFilePath, 'utf8')

  if (YAML_EXTENSIONS.includes(path.extname(inFilePath))) {
    return YAML.safeLoad(inFileContents)
  }

  return parseMarbleDiagramSpec(inFileContents)
}

module.exports = { readDiagramSpec }
