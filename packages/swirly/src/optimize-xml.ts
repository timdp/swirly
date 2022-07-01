import { optimize, OptimizedSvg } from 'svgo'

const replacer = (searchValue: RegExp, replaceValue: string) => (str: string) =>
  str.replace(searchValue, replaceValue)

// svgo uses String#trim() internally, which also removes leading and
// trailing non-breaking spaces. We don't want this, so we temporarily
// replace them with placeholders.
const mangle = replacer(/\xA0/g, '\0')

const unmangle = replacer(/\0/g, '\xA0')

export const optimizeXml = (unoptXml: string): string => {
  const { data } = optimize(mangle(unoptXml), {
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
  return unmangle(data)
}
