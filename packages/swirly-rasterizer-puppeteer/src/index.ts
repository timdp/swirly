import { IRasterizer, RasterizerOutputFormat } from '@swirly/types'
import { Browser, launch } from 'puppeteer'

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

export class PuppeteerRasterizer implements IRasterizer {
  #browser?: Browser

  async init (): Promise<void> {
    this.#browser = await launch()
  }

  async dispose (): Promise<void> {
    await this.#browser!.close()
  }

  async rasterize (
    svgXml: string,
    width: number,
    height: number,
    format: RasterizerOutputFormat
  ): Promise<Buffer> {
    const html = createHtml(svgXml, width, height)
    return this.#capture(html, width, height, format)
  }

  async #capture (
    html: string,
    width: number,
    height: number,
    format: RasterizerOutputFormat
  ): Promise<Buffer> {
    const page = await this.#browser!.newPage()
    await page.setViewport({ width, height })
    await page.setContent(html)
    return page.screenshot({
      type: format,
      clip: {
        x: 0,
        y: 0,
        width,
        height
      }
    }) as Promise<Buffer>
  }
}
