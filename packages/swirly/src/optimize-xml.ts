import { optimize, OptimizedSvg } from 'svgo'

export const optimizeXml = (unoptXml: string): string => {
  const { data } = optimize(unoptXml, {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false
          }
        }
      }
    ]
  }) as OptimizedSvg
  return data
}
