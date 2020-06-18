import { RasterizerOutputFormat } from '@swirly/types'
import { spawnSync, StdioOptions } from 'child_process'

export const rasterizeSvg = async (
  svgXml: string,
  width: number,
  height: number,
  format: RasterizerOutputFormat
): Promise<Buffer> => {
  const cmd = 'convert'
  const args = ['-resize', `${width}x${height}!`, 'svg:-', `${format}:-`]
  const options = {
    input: svgXml,
    stdio: [null, 'pipe', 'ignore'] as StdioOptions,
    shell: true,
    encoding: null
  }
  const { stdout } = spawnSync(cmd, args, options)
  return stdout
}
