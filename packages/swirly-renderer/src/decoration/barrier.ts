import {
  BarrierDecorationSpecification,
  BarrierDecorationStyles,
  DecorationSpecification
} from 'swirly-types'

import { DecorationRendererContext, DecorationRendererResult } from '../types'
import { createElement } from '../util/create-element'
import { mergeStyles } from '../util/merge-styles'
import { translate } from '../util/transform'

export const renderBarrierDecoration = (
  { document, styles, bbox, scaleTime }: DecorationRendererContext,
  decoration: DecorationSpecification
): DecorationRendererResult => {
  const {
    frame,
    styles: ownStyles
  } = decoration as BarrierDecorationSpecification

  const s: BarrierDecorationStyles = mergeStyles(styles, ownStyles, 'barrier_')

  const x = scaleTime(frame) * styles.frame_width! - s.stroke_width! / 2
  const y = bbox.y1
  const height = bbox.y2 - bbox.y1

  const $line = createElement(document, 'line', {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: height,
    stroke: s.color!,
    'stroke-width': s.stroke_width!,
    'stroke-dasharray': s.stroke_dash_width!
  })

  translate($line, x, y)

  return {
    element: $line
  }
}
