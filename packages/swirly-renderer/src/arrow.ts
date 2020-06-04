import { RendererContext, RendererResult } from './types'
import { createElement } from './util/create-element'
import { degreesToRadians } from './util/degrees-to-radians'

export const renderArrow = (
  { document, styles, streamHeight }: RendererContext,
  arrowStyles: any,
  arrowheadAngle: number,
  duration: number
): RendererResult => {
  const y = streamHeight / 2
  const width = duration * styles.frame_width! + streamHeight
  const arrowheadWidth = arrowStyles.width!
  const arrowheadHeight =
    arrowheadWidth * Math.tan(degreesToRadians(arrowheadAngle / 2))
  const y1 = y - arrowheadHeight
  const y2 = y + arrowheadHeight

  const fillColor = arrowStyles.fill_color!
  const filled = typeof fillColor === 'string' && fillColor !== ''

  const $group = createElement(document, 'g')

  $group.appendChild(
    createElement(document, 'line', {
      x1: 0,
      y1: y,
      x2: width - (filled ? arrowheadWidth : 0),
      y2: y,
      stroke: arrowStyles.stroke_color!,
      'stroke-width': arrowStyles.stroke_width!
    })
  )

  const points = [
    `${width - arrowheadWidth},${y1}`,
    `${width},${y}`,
    `${width - arrowheadWidth},${y2}`
  ]

  $group.appendChild(
    createElement(document, filled ? 'polygon' : 'polyline', {
      points: points.join(' '),
      fill: filled ? fillColor : 'none',
      stroke: arrowStyles.stroke_color!,
      'stroke-width': arrowStyles.stroke_width!,
      'stroke-linecap': 'square'
    })
  )

  const bbox = {
    x1: 0,
    y1,
    x2: width,
    y2
  }

  return {
    element: $group,
    bbox
  }
}
