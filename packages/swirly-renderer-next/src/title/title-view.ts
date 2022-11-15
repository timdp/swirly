import { Path } from 'opentype.js'

import { DiagramContext } from '../diagram-context'
import { getAlignMiddlePath } from '../util/get-align-middle-path'
import { tag } from '../xml/tag'
import { XmlNode } from '../xml/xml-node'

export function titleView (
  context: DiagramContext,
  x: number,
  y: number,
  title: string
): XmlNode {
  const { font, styleCatcher } = context
  const { titleFontSize, textColorLight, textColorDark } = context.style
  const d: Path = getAlignMiddlePath(font, titleFontSize, x, y, title)

  return tag('path', {
    class: styleCatcher.attach(
      { fill: textColorLight },
      { fill: textColorDark }
    ),
    d: d.toPathData(1)
  })
}
