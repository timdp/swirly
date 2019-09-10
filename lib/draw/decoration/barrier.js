const { createElement } = require('../../util/create-element')
const { mergeStyles } = require('../../util/merge-styles')
const { translate } = require('../../util/transform')

const draw = ({ document, styles, bbox, scaleTime }, decoration) => {
  const s = mergeStyles('barrier_', styles, decoration)

  const x =
    scaleTime(decoration.frame) * styles.frame_width - s.stroke_width / 2
  const y = bbox.y1
  const height = bbox.y2 - bbox.y1

  const $line = createElement(document, 'line', {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: height,
    stroke: s.color,
    'stroke-width': s.stroke_width,
    'stroke-dasharray': s.stroke_dash_width
  })

  translate($line, x, y)

  return {
    element: $line
  }
}

module.exports = { draw }
