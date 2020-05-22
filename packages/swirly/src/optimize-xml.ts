import SVGO from 'svgo'

export const optimizeXml = async (unoptXml: string): Promise<string> => {
  const svgo = new SVGO({ plugins: [{ removeViewBox: false }] })
  const { data: optXml } = await svgo.optimize(unoptXml)
  return optXml
}
