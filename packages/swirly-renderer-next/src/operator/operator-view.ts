import { OperatorSpecification } from '@swirly/types'

import { DiagramContext } from '../diagram-context'
import { getObservableWidth } from '../observable/get-observable-width'
import { observableView } from '../observable/observable-view'
import { ObservableStyle } from '../observable-style'
import { getOperatorTextWidth } from '../operator-text/get-operator-text-width'
import { operatorTextView } from '../operator-text/operator-text-view'
import { findNegativePositive } from '../util/find-negative-positive'
import { fragment } from '../xml/fragment'
import { tag } from '../xml/tag'
import { XmlNode } from '../xml/xml-node'
import { getOperatorObservableStyle } from './get-operator-observable-style'
import { getOperatorWidth } from './get-operator-width'
import { getOperatorYOffsets } from './get-operator-y-offsets'

export function operatorView (
  context: DiagramContext,
  x: number,
  y: number,
  width: number,
  specification: OperatorSpecification
): XmlNode {
  const { styleCatcher } = context
  const {
    operatorPadding,
    operatorBgColorLight,
    strokeColorLight,
    strokeWidth,
    operatorBgColorDark,
    strokeColorDark
  } = context.style

  const style: ObservableStyle = getOperatorObservableStyle(context)

  const minWidth = getOperatorWidth(context, specification)
  const [top, bottom] = findNegativePositive(
    getOperatorYOffsets(context, specification)
  )

  const parts: XmlNode[] = []

  let offsetX = x + operatorPadding + (width - minWidth) / 2

  for (const { type, value } of specification.title) {
    let part: XmlNode
    let partWidth: number

    switch (type) {
      case 'text':
        part = operatorTextView(context, offsetX, y - top, value)
        partWidth = getOperatorTextWidth(context, value)

        break

      case 'stream':
        part = observableView(context, style, offsetX, y - top, 0, value)
        partWidth = getObservableWidth(style, value)

        break
    }

    parts.push(part)
    offsetX += partWidth
  }

  return fragment([
    tag('rect', {
      class: styleCatcher.attach(
        {
          fill: operatorBgColorLight,
          stroke: strokeColorLight,
          strokeWidth,
          strokeLinejoin: 'round'
        },
        {
          fill: operatorBgColorDark,
          stroke: strokeColorDark
        }
      ),
      x,
      y,
      width,
      height: -top + bottom
    }),
    fragment(parts)
  ])
}
