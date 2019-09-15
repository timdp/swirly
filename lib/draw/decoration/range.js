const { createElement } = require('../../util/create-element')
const { mergeStyles } = require('../../util/merge-styles')
const { translate } = require('../../util/transform')

const draw = ({ document, styles, streamHeight, scaleTime }, decoration) => {
  const s = mergeStyles('range_', styles, decoration.styles)

  const x = scaleTime(decoration.frame) * styles.frame_width
  const y = (streamHeight - s.height) / 2
  const width = scaleTime(decoration.duration) * styles.frame_width
  const height = s.height

  const $rect = createElement(document, 'rect', {
    x: 0,
    y: 0,
    width,
    height,
    fill: s.fill_color,
    stroke: s.stroke_color,
    'stroke-width': s.stroke_width
  })

  translate($rect, x, y)

  return {
    element: $rect
  }
}

module.exports = { draw }
