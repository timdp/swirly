const puppeteer = require('puppeteer')

class BrowserFacade {
  constructor () {
    this._browser = null
  }

  async init () {
    this._browser = await puppeteer.launch()
  }

  async dispose () {
    await this._browser.close()
    this._browser = null
  }
}

module.exports = { BrowserFacade }
