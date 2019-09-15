const { DOMParser, XMLSerializer } = require('xmldom')
const {
  drawMarbleDiagram: drawMarbleDiagramBase,
  parseMarbleDiagramSpec
} = require('./lib/')

const drawMarbleDiagram = (spec, options = {}) => {
  const result = drawMarbleDiagramBase(spec, { DOMParser, ...options })
  return {
    ...result,
    xml: new XMLSerializer().serializeToString(result.document.documentElement)
  }
}

module.exports = {
  drawMarbleDiagram,
  parseMarbleDiagramSpec
}
