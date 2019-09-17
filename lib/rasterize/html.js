const dedent = require('dedent')

const createHtml = (svgXml, width, height) =>
  dedent(`
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
    </html>
  `)

module.exports = {
  createHtml
}
