const { BrowserFacade } = require('./browser')

class HtmlScreenshotter extends BrowserFacade {
  async capture (html, width, height, type) {
    const page = await this._browser.newPage()
    await page.setViewport({ width, height })
    await page.setContent(html)
    return page.screenshot({
      type,
      clip: {
        x: 0,
        y: 0,
        width,
        height
      }
    })
  }
}

module.exports = { HtmlScreenshotter }
