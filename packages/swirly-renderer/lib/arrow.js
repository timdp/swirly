const { createElement } = require('./util/create-element')
const { degreesToRadians } = require('./util/degrees-to-radians')

const drawArrow = (
  { document, styles, streamHeight },
  arrowStyles,
  arrowheadAngle,
  duration
) => {
  const y = streamHeight / 2
  const width = duration * styles.frame_width + streamHeight
  const arrowheadWidth = arrowStyles.width
  const arrowheadHeight =
    arrowheadWidth * Math.tan(degreesToRadians(arrowheadAngle / 2))
  const y1 = y - arrowheadHeight
  const y2 = y + arrowheadHeight

  const $group = createElement(document, 'g')

  $group.appendChild(
    createElement(document, 'line', {
      x1: 0,
      y1: y,
      x2: width,
      y2: y,
      stroke: arrowStyles.stroke_color,
      'stroke-width': arrowStyles.stroke_width
    })
  )

  const fillColor = arrowStyles.fill_color
  const filled = typeof fillColor === 'string' && fillColor !== ''
  const points = [
    `${width - arrowheadWidth},${y1}`,
    `${width},${y}`,
    `${width - arrowheadWidth},${y2}`
  ]
  if (filled) {
    points.push(points[0])
  }

  $group.appendChild(
    createElement(document, 'polyline', {
      points: points.join(' '),
      fill: filled ? fillColor : 'none',
      stroke: arrowStyles.stroke_color,
      'stroke-width': arrowStyles.stroke_width,
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

module.exports = { drawArrow }
