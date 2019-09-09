const { createElement } = require('../../util/create-element')
const { translate } = require('../../util/transform')

const draw = (
  { document, styles, scaleTime },
  {
    frame,
    duration,
    fill_color: fillColor,
    stroke_color: strokeColor,
    stroke_width: strokeWidth
  }
) => {
  const x = scaleTime(frame) * styles.frame_size
  const y = styles.event_radius - styles.range_height / 2
  const width = scaleTime(duration) * styles.frame_size
  const height = styles.range_height
  const $rect = createElement(document, 'rect', {
    x: 0,
    y: 0,
    width,
    height,
    fill: fillColor != null ? fillColor : styles.range_fill_color,
    stroke: strokeColor != null ? strokeColor : styles.range_stroke_color,
    'stroke-width':
      strokeWidth != null ? strokeWidth : styles.range_stroke_width
  })
  translate($rect, x, y)
  return {
    element: $rect
  }
}

module.exports = { draw }
