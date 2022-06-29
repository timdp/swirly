import { IRasterizer, RasterizerOutputFormat } from '@swirly/types'
import { execa } from 'execa'

export class ImagemagickRasterizer implements IRasterizer {
  async init (): Promise<void> {}

  async dispose (): Promise<void> {}

  async rasterize (
    svgXml: string,
    width: number,
    height: number,
    format: RasterizerOutputFormat
  ): Promise<Buffer> {
    const cmd = 'convert'
    const args = ['-resize', `${width}x${height}!`, 'svg:-', `${format}:-`]
    const options = {
      encoding: null,
      input: svgXml,
      stdin: undefined,
      sderr: undefined
    }
    const { stdout } = await execa(cmd, args, options)
    return stdout
  }
}
