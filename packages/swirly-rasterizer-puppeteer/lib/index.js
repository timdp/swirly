const { SvgScreenshotter } = require('./svg-screenshotter')

const safeDispose = async screenshotter => {
  try {
    await screenshotter.dispose()
  } catch (_) {}
}

const rasterizeSvg = async (svgXml, width, height, type) => {
  const screenshotter = new SvgScreenshotter()
  try {
    await screenshotter.init()
  } catch (err) {
    throw new Error(`Failed to start browser: ${err}`)
  }

  let imageData
  try {
    imageData = await screenshotter.capture(svgXml, width, height, type)
  } catch (err) {
    await safeDispose(screenshotter)
    throw new Error(`Failed to create screenshot: ${err}`)
  }

  try {
    await screenshotter.dispose()
  } catch (err) {
    throw new Error(`Failed to dispose browser: ${err}`)
  }

  return imageData
}

module.exports = {
  rasterizeSvg,
  SvgScreenshotter
}
