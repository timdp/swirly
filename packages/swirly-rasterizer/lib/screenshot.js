const { BrowserFacade } = require('./browser')

class Screenshotter extends BrowserFacade {
  async capture (html, width, height) {
    const page = await this._browser.newPage()
    await page.setViewport({ width, height })
    await page.setContent(html)
    return page.screenshot({
      clip: {
        x: 0,
        y: 0,
        width,
        height
      }
    })
  }
}

module.exports = { Screenshotter }
