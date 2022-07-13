import { Font, Path } from 'opentype.js'

export function getAlignMiddlePath (
  font: Font,
  fontSize: number,
  x: number,
  y: number,
  text: string
): Path {
  const { ascender, unitsPerEm, descender }: Font = font
  return font.getPath(
    text,
    x,
    y + fontSize * (ascender / 2 / (unitsPerEm - descender)),
    fontSize
  )
}
