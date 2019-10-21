const SVGO = require('svgo')

const optimizeXml = async unoptXml => {
  const svgo = new SVGO({ plugins: [{ removeViewBox: false }] })
  const { data: optXml } = await svgo.optimize(unoptXml)
  return optXml
}

module.exports = { optimizeXml }
