import { OperatorSpecification, OperatorStyles } from 'swirly-types'

import {
  PostRenderUpdateContext,
  RendererContext,
  UpdatableRendererResult
} from './types'
import { createElement } from './util/create-element'
import { mergeStyles } from './util/merge-styles'

export const renderOperator = (
  ctx: RendererContext,
  operator: OperatorSpecification
): UpdatableRendererResult => {
  const { document, styles, nextIndex } = ctx
  const s: OperatorStyles = mergeStyles(styles, operator.styles, 'operator_')

  // TODO Find a good `role`
  const $group = createElement(document, 'g', {
    'aria-label': 'Operator: ' + operator.title,
    tabindex: nextIndex()
  })

  const $rect = createElement(document, 'rect', {
    x: 0,
    y: s.spacing!,
    width: 1,
    height: s.height! - s.stroke_width!,
    fill: s.fill_color!,
    stroke: s.stroke_color!,
    'stroke-width': s.stroke_width!,
    rx: s.corner_radius!
  })
  $group.appendChild($rect)

  const $text = createElement(
    document,
    'text',
    {
      x: s.spacing!,
      y: s.spacing! + s.height! / 2 + 'px',
      fill: s.title_color!,
      'font-family': s.title_font_family!,
      'font-size': s.title_font_size! + 'px',
      'font-weight': s.title_font_weight!,
      'font-style': s.title_font_style!,
      'dominant-baseline': 'middle',
      'text-anchor': 'middle'
    },
    operator.title
  )
  $group.appendChild($text)

  const bbox = {
    x1: 0,
    y1: 0,
    x2: 1,
    y2: s.height! + 2 * s.spacing!
  }

  const update = ({ width }: PostRenderUpdateContext) => {
    $rect.setAttribute('width', '' + width)
    $text.setAttribute('x', '' + width / 2)
    $text.setAttribute('width', '' + width)
  }

  return {
    element: $group,
    bbox,
    update
  }
}
