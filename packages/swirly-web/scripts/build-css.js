import fs from 'node:fs/promises'

import CleanCSS from 'clean-css'

const inputPath = new URL('../src/style.css', import.meta.url)
const outputPath = new URL('../dist/style.css', import.meta.url)
const source = await fs.readFile(inputPath, 'utf8')
const { errors, styles, warnings } = new CleanCSS().minify(source)

if (errors.length > 0) {
  throw new Error(errors.join('\n'))
}

if (warnings.length > 0) {
  console.warn(warnings.join('\n'))
}

await fs.writeFile(outputPath, styles)
