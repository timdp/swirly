import { RasterizerOutputFormat } from '@swirly/types'

import { BrowserFacade } from './browser'

export class HtmlScreenshotter extends BrowserFacade {
  async capture (
    html: string,
    width: number,
    height: number,
    format: RasterizerOutputFormat
  ): Promise<Buffer> {
    const page = await this.browser!.newPage()
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
}
