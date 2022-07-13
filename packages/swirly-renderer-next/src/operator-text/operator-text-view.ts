import { Path } from 'opentype.js'

import { DiagramContext } from '../diagram-context'
import { getAlignMiddlePath } from '../util/get-align-middle-path'
import { tag } from '../xml/tag'
import { XmlNode } from '../xml/xml-node'

export function operatorTextView (
  context: DiagramContext,
  x: number,
  y: number,
  text: string
): XmlNode {
  const { font, styleCatcher } = context
  const { operatorFontSize, textColorLight, textColorDark } = context.style

  const d: Path = getAlignMiddlePath(font, operatorFontSize, x, y, text)

  return tag('path', {
    class: styleCatcher.attach(
      { fill: textColorLight },
      { fill: textColorDark }
    ),
    d: d.toPathData(1)
  })
}
