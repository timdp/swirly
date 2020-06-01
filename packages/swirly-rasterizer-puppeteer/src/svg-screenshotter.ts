import { RasterizerOutputFormat } from 'swirly-types/src'

import { HtmlScreenshotter } from './html-screenshotter'

const createHtml = (svgXml: string, width: number, height: number) => `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <style>
        html, body { margin: 0; padding: 0; }
        body > svg { width: ${width}px; height: ${height}px; }
      </style>
    </head>
    <body>
      ${svgXml}
    </body>
  </html>`

export class SvgScreenshotter extends HtmlScreenshotter {
  async capture (
    svgXml: string,
    width: number,
    height: number,
    format: RasterizerOutputFormat
  ): Promise<Buffer> {
    const html = createHtml(svgXml, width, height)
    return super.capture(html, width, height, format)
  }
}
