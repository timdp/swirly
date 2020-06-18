import { RasterizerOutputFormat } from '@swirly/types'
import { spawnSync, StdioOptions } from 'child_process'

export const rasterizeSvg = async (
  svgXml: string,
  width: number,
  height: number,
  format: RasterizerOutputFormat
): Promise<Buffer> => {
  if (format !== 'png') {
    // TODO Support jpeg
    throw new Error('Output type must be "png"')
  }
  const cmd = 'inkscape'
  const args = ['-z', '-e', '-', '-w', '' + width, '-h', '' + height, '-']
  const options = {
    input: svgXml,
    stdio: [null, 'pipe', 'ignore'] as StdioOptions,
    shell: true
  }
  const { stdout } = spawnSync(cmd, args, options)
  return stdout
}
