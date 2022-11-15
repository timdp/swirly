import { Path } from 'opentype.js'

import { DiagramContext } from '../diagram-context'
import { ObservableStyle } from '../observable-style'
import { getAlignMiddlePath } from '../util/get-align-middle-path'
import { stringToColor } from '../util/string-to-color'
import { fragment } from '../xml/fragment'
import { tag } from '../xml/tag'
import { XmlNode } from '../xml/xml-node'

export function nextView (
  context: DiagramContext,
  style: ObservableStyle,
  x: number,
  y: number,
  value: string
): XmlNode {
  const { styleCatcher } = context
  const {
    strokeWidth,
    strokeColorLight,
    textColorLight,
    strokeColorDark,
    textColorDark
  } = context.style
  const { fontSize, notificationRadius } = style

  const d: Path = getAlignMiddlePath(
    context.font,
    fontSize,
    x - context.font.getAdvanceWidth(value, fontSize) / 2,
    y,
    value
  )

  return fragment([
    tag('circle', {
      class: styleCatcher.attach(
        {
          fill: stringToColor(value, 'light'),
          stroke: strokeColorLight,
          strokeWidth
        },
        { fill: stringToColor(value, 'dark'), stroke: strokeColorDark }
      ),
      cx: x,
      cy: y,
      r: notificationRadius
    }),
    tag('path', {
      class: styleCatcher.attach(
        { fill: textColorLight },
        { fill: textColorDark }
      ),
      d: d.toPathData(1)
    })
  ])
}
