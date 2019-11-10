const { fabric } = require('fabric')
const streamToPromise = require('stream-to-promise')

const loadSvg = svgXml =>
  new Promise(resolve => {
    fabric.loadSVGFromString(svgXml, (objects, options) => {
      resolve(fabric.util.groupSVGElements(objects, options))
    })
  })

const rasterizeSvg = async (svgXml, width, height, type) => {
  const canvas = new fabric.StaticCanvas(null, { width, height })
  const group = await loadSvg(svgXml)
  group.scaleToWidth(width)
  canvas.add(group)
  canvas.renderAll()
  const stream = canvas['create' + type.toUpperCase() + 'Stream']()
  const data = await streamToPromise(stream)
  return data
}

module.exports = { rasterizeSvg }
