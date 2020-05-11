const { HtmlScreenshotter } = require('./html-screenshotter')

const createHtml = (svgXml, width, height) => `
  <!doctype html>
  <html>
    <head>
      <style>
        html, body { margin: 0; padding: 0; }
        body > svg { width: ${width}px; height: ${height}px; }
      </style>
    </head>
    <body>
      ${svgXml}
    </body>
  </html>`

class SvgScreenshotter extends HtmlScreenshotter {
  async capture (svgXml, width, height, type) {
    const html = createHtml(svgXml, width, height)
    return super.capture(html, width, height, type)
  }
}

module.exports = { SvgScreenshotter }
