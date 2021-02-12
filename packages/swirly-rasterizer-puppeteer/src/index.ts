import { IRasterizer, RasterizerOutputFormat } from '@swirly/types'
import puppeteer from 'puppeteer'

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
  private _browser?: puppeteer.Browser

  async init (): Promise<void> {
    this._browser = await puppeteer.launch()
  }

  async dispose (): Promise<void> {
    await this._browser!.close()
  }

  async rasterize (
    svgXml: string,
    width: number,
    height: number,
    format: RasterizerOutputFormat
  ): Promise<Buffer> {
    const html = createHtml(svgXml, width, height)
    return this._capture(html, width, height, format)
  }

  async _capture (
    html: string,
    width: number,
    height: number,
    format: RasterizerOutputFormat
  ): Promise<Buffer> {
    const page = await this._browser!.newPage()
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
