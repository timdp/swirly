export type RasterizerOutputFormat = 'png' | 'jpeg'

export type Rasterizer = (
  svgXml: string,
  width: number,
  height: number,
  format: RasterizerOutputFormat
) => Promise<Buffer>
