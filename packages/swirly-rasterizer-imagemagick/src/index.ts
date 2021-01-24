import { IRasterizer, RasterizerOutputFormat } from '@swirly/types'
import { spawnSync, StdioOptions } from 'child_process'

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
      input: svgXml,
      stdio: [null, 'pipe', 'pipe'] as StdioOptions,
      shell: true,
      encoding: null
    }
    const { status, signal, stdout, stderr } = spawnSync(cmd, args, options)
    if (status !== 0 || signal != null) {
      const err = new Error(stderr.toString())
      Object.assign(err, {
        status,
        signal,
        stdout,
        stderr
      })
      throw err
    }
    return stdout
  }
}
