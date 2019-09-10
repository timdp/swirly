const { createElement } = require('../util/create-element')

const drawArrow = ({ document, styles }, arrowStyles, duration) => {
  const y = styles.event_radius
  const lineWidth = duration * styles.frame_width
  const width = lineWidth + arrowStyles.width
  const arrowheadHeight = arrowStyles.width / Math.sqrt(2)
  const y1 = y - arrowheadHeight
  const y2 = y + arrowheadHeight

  const $group = createElement(document, 'g')

  $group.appendChild(
    createElement(document, 'line', {
      x1: 0,
      y1: y,
      x2: width,
      y2: y,
      stroke: arrowStyles.color,
      'stroke-width': arrowStyles.stroke_width
    })
  )

  $group.appendChild(
    createElement(document, 'polyline', {
      points: [
        `${lineWidth},${y1}`,
        `${width},${y}`,
        `${lineWidth},${y2}`
      ].join(' '),
      stroke: arrowStyles.color,
      'stroke-width': arrowStyles.stroke_width,
      fill: 'none'
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

module.exports = {
  drawArrow
}
