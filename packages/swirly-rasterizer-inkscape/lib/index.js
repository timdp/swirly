const { spawnSync } = require('child_process')

const rasterizeSvg = async (svgXml, width, height, type) => {
  if (type !== 'png') {
    // TODO Support jpeg
    throw new Error('Output type must be "png"')
  }
  const cmd = 'inkscape'
  const args = ['-z', '-e', '-', '-w', width, '-h', height, '-']
  const options = {
    input: svgXml,
    stdio: [null, 'pipe', 'ignore'],
    shell: true
  }
  const { stdout } = spawnSync(cmd, args, options)
  return stdout
}

module.exports = { rasterizeSvg }
