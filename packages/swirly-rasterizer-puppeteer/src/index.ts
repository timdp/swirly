import { Rasterizer, RasterizerOutputFormat } from '@swirly/types'
import puppeteer from 'puppeteer'

const captureHtmlScreenshot = async (
  browser: puppeteer.Browser,
  html: string,
  width: number,
  height: number,
  format: RasterizerOutputFormat
): Promise<Buffer> => {
  const page = await browser.newPage()
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
  })
}

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

const captureSvgScreenshot = async (
  browser: puppeteer.Browser,
  svgXml: string,
  width: number,
  height: number,
  format: RasterizerOutputFormat
): Promise<Buffer> => {
  const html = createHtml(svgXml, width, height)
  return captureHtmlScreenshot(browser, html, width, height, format)
}

export const rasterizeSvg: Rasterizer = async (
  svgXml: string,
  width: number,
  height: number,
  format: RasterizerOutputFormat
): Promise<Buffer> => {
  let browser: puppeteer.Browser
  try {
    browser = await puppeteer.launch()
  } catch (err) {
    throw new Error(`Failed to launch browser: ${err}`)
  }

  let imageData: Buffer
  try {
    imageData = await captureSvgScreenshot(
      browser,
      svgXml,
      width,
      height,
      format
    )
  } catch (err) {
    try {
      await browser.close()
    } catch {}
    throw new Error(`Failed to create screenshot: ${err}`)
  }

  try {
    await browser.close()
  } catch (err) {
    throw new Error(`Failed to close browser: ${err}`)
  }

  return imageData
}
