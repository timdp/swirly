import SVGO from 'svgo'

export const optimizeXml = async (unoptXml: string): Promise<string> => {
  const svgo = new SVGO({
    plugins: [
      {
        removeUnknownsAndDefaults: { keepRoleAttr: true },
        removeViewBox: false
      }
    ]
  })
  const { data: optXml } = await svgo.optimize(unoptXml)
  return optXml
}
