import {
  RasterizationRequest,
  RasterizerName,
  RasterizerOutputFormat
} from '@swirly/types'
// @ts-ignore
import fetch from 'minipass-fetch'

export class RasterizationClient {
  #serverUrl: string

  constructor (serverUrl: string) {
    this.#serverUrl = serverUrl
  }

  async rasterize (
    rasterizer: RasterizerName,
    svgXml: string,
    width: number,
    height: number,
    format: RasterizerOutputFormat
  ): Promise<Buffer> {
    const url = this.#serverUrl + '/rasterize'
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
      let msg: string | null = null
      try {
        msg = (await resp.json()).message
      } catch {}
      throw new Error(`HTTP ${resp.status}: ${msg ?? 'Unknown error'}`)
    }
    const arrayBuffer = await resp.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }
}
