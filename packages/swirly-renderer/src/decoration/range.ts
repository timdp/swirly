import {
  DecorationSpecification,
  RangeDecorationSpecification,
  RangeDecorationStyles
} from '@swirly/types'

import {
  DecorationRenderer,
  DecorationRendererContext,
  DecorationRendererResult
} from '../types'
import { createElement } from '../util/create-element'
import { mergeStyles } from '../util/merge-styles'
import { translate } from '../util/transform'

export const renderRangeDecoration = (
  { document, styles, streamHeight, scaleTime }: DecorationRendererContext,
  decoration: DecorationSpecification
): DecorationRendererResult => {
  const {
    frame,
    duration,
    styles: ownStyles
  } = decoration as RangeDecorationSpecification

  const s: RangeDecorationStyles = mergeStyles(styles, ownStyles, 'range_')

  const x = scaleTime(frame) * styles.frame_width!
  const y = (streamHeight - s.height!) / 2
  const width = scaleTime(duration) * styles.frame_width!
  const height = s.height!

  const $rect = createElement(document, 'rect', {
    x: 0,
    y: 0,
    width,
    height,
    fill: s.fill_color!,
    stroke: s.stroke_color!,
    'stroke-width': s.stroke_width!
  })

  translate($rect, x, y)

  return {
    element: $rect
  }
}
