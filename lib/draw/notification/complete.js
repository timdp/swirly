const { createElement } = require('../../util/create-element')
const { translate } = require('../../util/transform')

const supports = ({ kind }) => ['C', 'complete', 'completion'].includes(kind)

const draw = ({ document, styles }, { frame }) => {
  const x =
    frame * styles.frame_size - styles.completion_stroke_width / 2
  const y1 = styles.event_radius - styles.completion_height / 2
  const y2 = y1 + styles.completion_height

  const $group = createElement(document, 'g')
  translate($group, x, 0)

  $group.appendChild(
    createElement(document, 'line', {
      x1: 0,
      y1,
      x2: 0,
      y2,
      stroke: styles.completion_stroke_color,
      'stroke-width': styles.completion_stroke_width
    })
  )

  const bbox = {
    x1: x - styles.completion_stroke_width / 2,
    y1,
    x2: x + styles.completion_stroke_width / 2,
    y2
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
