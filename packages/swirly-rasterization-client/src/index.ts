import {
  RasterizationRequest,
  RasterizerName,
  RasterizerOutputFormat
} from '@swirly/types'
import fetch from 'node-fetch'

export class RasterizationClient {
  private _serverUrl: string

  constructor (serverUrl: string) {
    this._serverUrl = serverUrl
  }

  async rasterize (
    rasterizer: RasterizerName,
    svgXml: string,
    width: number,
    height: number,
    format: RasterizerOutputFormat
  ): Promise<Buffer> {
    const url = this._serverUrl + '/rasterize'
    const body: RasterizationRequest = {
      rasterizer,
      svgXml,
      width,
      height,
      format
    }
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    if (!resp.ok) {
      let msg: string
      try {
        msg = (await resp.json()).message
      } catch {
        msg = 'Unknown error'
      }
      throw new Error(`HTTP ${resp.status}: ${msg}`)
    }
    return resp.buffer()
  }
}
