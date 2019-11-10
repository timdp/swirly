const { spawnSync } = require('child_process')

const rasterizeSvg = async (svgXml, width, height, type) => {
  const cmd = 'convert'
  const args = ['-resize', `${width}x${height}!`, 'svg:-', `${type}:-`]
  const options = {
    input: svgXml,
    stdio: [null, 'pipe', 'ignore'],
    shell: true
  }
  const { stdout } = spawnSync(cmd, args, options)
  return stdout
}

module.exports = { rasterizeSvg }
