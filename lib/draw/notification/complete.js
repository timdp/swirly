const { createElement } = require('../../util/create-element')
const { mergeStyles } = require('../../util/merge-styles')
const { translate } = require('../../util/transform')

const supports = ({ kind }) => ['C', 'complete', 'completion'].includes(kind)

const draw = ({ document, styles }, notification) => {
  const s = mergeStyles('completion_', styles, notification)

  const x = notification.frame * styles.frame_width - s.stroke_width / 2
  const y1 = styles.event_radius - s.height / 2
  const y2 = y1 + s.height

  const $group = createElement(document, 'g')
  translate($group, x, 0)

  $group.appendChild(
    createElement(document, 'line', {
      x1: 0,
      y1,
      x2: 0,
      y2,
      stroke: s.stroke_color,
      'stroke-width': s.stroke_width
    })
  )

  const bbox = {
    x1: x - s.stroke_width / 2,
    y1,
    x2: x + s.stroke_width / 2,
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
