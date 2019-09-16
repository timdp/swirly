const puppeteer = require('puppeteer')
const fs = require('fs').promises

const createHtml = (svgXml, width, height) => `
  <!doctype html>
  <html>
    <head>
      <style>
        html, body { margin: 0; padding: 0; }
        svg { width: ${width}px; height: ${height}px; }
      </style>
    </head>
    <body>
      ${svgXml}
    </body>
  </html>
`

const svgToImage = async (svgXml, width, height, imageFilePath) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({ width, height })
  const loading = page.waitForNavigation({ waitUntil: 'load' })
  const html = createHtml(svgXml, width, height)
  await page.setContent(html)
  await loading
  const imageData = await page.screenshot({
    clip: {
      x: 0,
      y: 0,
      width,
      height
    }
  })
  await browser.close()
  await fs.writeFile(imageFilePath, imageData)
}

module.exports = {
  svgToImage
}
