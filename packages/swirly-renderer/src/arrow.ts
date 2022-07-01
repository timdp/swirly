import { RendererContext, RendererResult } from './types.js'
import { degreesToRadians } from './util/degrees-to-radians.js'
import { createSvgElement } from './util/svg-xml.js'

export const renderArrow = (
  { document, styles, streamHeight }: RendererContext,
  arrowStyles: any,
  arrowheadAngle: number,
  duration: number
): RendererResult => {
  const centerY = streamHeight / 2
  const lineWidth = duration * styles.frame_width! + streamHeight
  const arrowheadWidth = arrowStyles.width!
  const arrowheadHeight =
    arrowheadWidth * Math.tan(degreesToRadians(arrowheadAngle / 2))
  const arrowHeadProtrusion =
    arrowStyles.stroke_width! / Math.sin(degreesToRadians(arrowheadAngle))

  const strokeWidth = arrowStyles.stroke_width!
  const strokeColor = arrowStyles.stroke_color!
  const fillColor = arrowStyles.fill_color!
  const filled = typeof fillColor === 'string' && fillColor !== ''

  const $group = createSvgElement(document, 'g')

  $group.appendChild(
    createSvgElement(document, 'line', {
      x1: 0,
      y1: centerY,
      x2: lineWidth - (filled ? arrowheadWidth : 0),
      y2: centerY,
      stroke: strokeColor,
      'stroke-width': strokeWidth
    })
  )

  const arrowheadTopY = centerY - arrowheadHeight
  const arrowheadBottomY = centerY + arrowheadHeight
  const points = [
    `${lineWidth - arrowheadWidth},${arrowheadTopY}`,
    `${lineWidth},${centerY}`,
    `${lineWidth - arrowheadWidth},${arrowheadBottomY}`
  ]

  $group.appendChild(
    createSvgElement(document, filled ? 'polygon' : 'polyline', {
      points: points.join(' '),
      fill: filled ? fillColor : 'none',
      stroke: strokeColor,
      'stroke-width': strokeWidth,
      'stroke-linecap': 'square'
    })
  )

  const bbox = {
    x1: 0,
    y1: 0,
    x2: lineWidth + arrowHeadProtrusion,
    y2: streamHeight
  }

  return {
    element: $group,
    bbox
  }
}
