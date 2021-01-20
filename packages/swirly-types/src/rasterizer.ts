export type RasterizerName = 'puppeteer' | 'inkscape'

export type RasterizerOutputFormat = 'png' | 'jpeg'

export type Rasterizer = (
  svgXml: string,
  width: number,
  height: number,
  format: RasterizerOutputFormat
) => Promise<Buffer>

export type RasterizationRequest = {
  rasterizer: RasterizerName
  svgXml: string
  width: number
  height: number
  format: RasterizerOutputFormat
}
