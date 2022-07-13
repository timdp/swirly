import { DiagramSpecification } from '@swirly/types'
import { Font } from 'opentype.js'

import { defaultStyle } from './default-diagram-style'
import { DiagramContext } from './diagram-context'
import { DiagramStyle } from './diagram-style'
import { getObservableStyle } from './observable/get-observable-style'
import { getObservableWidth } from './observable/get-observable-width'
import { getObservableYOffsets } from './observable/get-observable-y-offsets'
import { observableView } from './observable/observable-view'
import { ObservableStyle } from './observable-style'
import { getOperatorWidth } from './operator/get-operator-width'
import { getOperatorYOffsets } from './operator/get-operator-y-offsets'
import { operatorView } from './operator/operator-view'
import { StyleCatcher } from './style-catcher'
import { getTitleWidth } from './title/get-title-width'
import { titleView } from './title/title-view'
import { findNegativePositive } from './util/find-negative-positive'
import { nullMax } from './util/null-max'
import { fragment } from './xml/fragment'
import { tag } from './xml/tag'
import { XmlNode } from './xml/xml-node'

export function diagramView (
  partialStyles: Partial<DiagramStyle>,
  font: Font,
  specification: DiagramSpecification
): XmlNode {
  const style: DiagramStyle = defaultStyle(partialStyles)

  const { bgColorDark, bgColorLight, padding, rowGap, titleMarginRight } = style

  let titleWidth: number | null = null
  let operatorWidth = 0
  let observableWidth = 0

  const styleCatcher = new StyleCatcher()

  const context: DiagramContext = { font, style, styleCatcher }

  for (const item of specification.content) {
    switch (item.kind) {
      case 'S':
        titleWidth = nullMax(titleWidth, getTitleWidth(context, item))
        observableWidth = Math.max(
          observableWidth,
          getObservableWidth(getObservableStyle(context), item)
        )

        break
      case 'O':
        operatorWidth = Math.max(operatorWidth, getOperatorWidth(context, item))
        break
      default:
        throw new Error('Not implemented')
    }
  }

  const contentWidth = Math.max(
    operatorWidth,
    titleWidth === null
      ? observableWidth
      : titleWidth + titleMarginRight + observableWidth
  )

  let y = style.padding

  const observableStyle: ObservableStyle = getObservableStyle(context)

  const body: XmlNode[] = []

  for (const item of specification.content) {
    let top: number
    let bottom: number

    let observableX: number

    switch (item.kind) {
      case 'S':
        ;[top, bottom] = findNegativePositive(
          getObservableYOffsets(observableStyle, 0, 0, item)
        )

        observableX = padding

        if (titleWidth !== null) {
          observableX += titleWidth + titleMarginRight
        }

        if (item.title !== null) {
          body.push(titleView(context, padding, y - top, item.title))
        }

        body.push(
          observableView(
            context,
            observableStyle,
            observableX,
            y - top,
            0,
            item
          )
        )

        break
      case 'O':
        ;[top, bottom] = findNegativePositive(
          getOperatorYOffsets(context, item)
        )

        body.push(operatorView(context, padding, y, contentWidth, item))

        break
      default:
        throw new Error('Not implemented')
    }

    y += -top + bottom + rowGap
  }

  const width = padding * 2 + contentWidth
  const height = y - rowGap + padding

  const rootClass = styleCatcher.attach({ colorScheme: 'light dark' }, {})

  const bgClass = context.styleCatcher.attach(
    { fill: bgColorLight },
    { fill: bgColorDark }
  )

  return tag(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      class: rootClass,
      width,
      height,
      viewBox: `0 0 ${width} ${height}`
    },
    [
      tag('defs', {}, [tag('style', {}, [styleCatcher.toXmlNode()])]),
      tag('rect', { class: bgClass, width, height }),
      fragment(body)
    ]
  )
}
