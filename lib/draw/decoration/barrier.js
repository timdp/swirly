const { createElement } = require('../../util/create-element')
const { translate } = require('../../util/transform')

const draw = ({ document, styles, bbox, scaleTime }, { timestamp }) => {
  const x =
    scaleTime(timestamp) * styles.time_unit_size -
    styles.barrier_stroke_width / 2
  const y = bbox.y1
  const height = bbox.y2 - bbox.y1
  const $line = createElement(document, 'line', {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: height,
    stroke: styles.barrier_color,
    'stroke-width': styles.barrier_stroke_width,
    'stroke-dasharray': styles.barrier_stroke_dash_width
  })
  translate($line, x, y)
  return {
    element: $line
  }
}

module.exports = { draw }
