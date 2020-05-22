import puppeteer from 'puppeteer'

export class BrowserFacade {
  protected browser?: puppeteer.Browser

  async init () {
    this.browser = await puppeteer.launch()
  }

  async dispose () {
    await this.browser!.close()
  }
}
