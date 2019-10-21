const { Screenshotter } = require('./screenshot')
const { createHtml } = require('./html')

const safeDispose = async screenshotter => {
  try {
    await screenshotter.dispose()
  } catch (_) {}
}

const rasterizeSvg = async (svgXml, width, height) => {
  const html = createHtml(svgXml, width, height)

  const screenshotter = new Screenshotter()
  try {
    await screenshotter.init()
  } catch (err) {
    throw new Error(`Failed to start browser: ${err}`)
  }

  let imageData
  try {
    imageData = await screenshotter.capture(html, width, height)
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

module.exports = { rasterizeSvg }
