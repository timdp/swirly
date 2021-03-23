import { extendDefaultPlugins, optimize } from 'svgo'

export const optimizeXml = (unoptXml: string): string => {
  const { data } = optimize(unoptXml, {
    plugins: extendDefaultPlugins([
      {
        name: 'removeViewBox',
        active: false
      }
    ])
  })
  return data
}
