const { createElement } = require('../util/create-element')

const drawArrow = (
  { document, styles, streamHeight },
  arrowStyles,
  duration
) => {
  const y = streamHeight / 2
  const width = duration * styles.frame_width + streamHeight
  const arrowHeadWidth = arrowStyles.width
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
        `${width - arrowHeadWidth},${y1}`,
        `${width},${y}`,
        `${width - arrowHeadWidth},${y2}`
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

module.exports = { drawArrow }
