import { IRasterizer, RasterizerOutputFormat } from '@swirly/types'
import execa from 'execa'

export class InkscapeRasterizer implements IRasterizer {
  async init (): Promise<void> {}

  async dispose (): Promise<void> {}

  async rasterize (
    svgXml: string,
    width: number,
    height: number,
    format: RasterizerOutputFormat
  ): Promise<Buffer> {
    if (format !== 'png') {
      // TODO Support jpeg
      throw new Error('Output type must be "png"')
    }
    const cmd = 'inkscape'
    const args = [
      '--pipe',
      '--export-type',
      format,
      '--export-width',
      String(width),
      '--export-height',
      String(height)
    ]
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
