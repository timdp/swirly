import { Rasterizer, RasterizerOutputFormat } from '@swirly/types'
import { spawnSync, StdioOptions } from 'child_process'

export const rasterizeSvg: Rasterizer = async (
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
    input: svgXml,
    stdio: [null, 'pipe', 'pipe'] as StdioOptions,
    shell: true
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
