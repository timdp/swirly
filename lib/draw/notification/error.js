const { createElement } = require('../../util/create-element')
const { translate } = require('../../util/transform')

const supports = ({ kind }) => ['E', 'error'].includes(kind)

const draw = ({ document, styles }, { frame }) => {
  const x = frame * styles.frame_size - styles.error_size / 2
  const y = styles.event_radius - styles.error_size / 2

  const $group = createElement(document, 'g')
  translate($group, x, y)

  $group.appendChild(
    createElement(document, 'line', {
      x1: 0,
      y1: 0,
      x2: styles.error_size,
      y2: styles.error_size,
      stroke: styles.error_stroke_color,
      'stroke-width': styles.error_stroke_width
    })
  )

  $group.appendChild(
    createElement(document, 'line', {
      x1: styles.error_size,
      y1: 0,
      x2: 0,
      y2: styles.error_size,
      stroke: styles.error_stroke_color,
      'stroke-width': styles.error_stroke_width
    })
  )

  const bbox = {
    x1: x,
    y1: y,
    x2: x + styles.error_size,
    y2: y + styles.error_size
  }

  return {
    element: $group,
    bbox
  }
}

module.exports = {
  supports,
  draw
}
