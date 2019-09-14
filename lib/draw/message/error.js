const { createElement } = require('../../util/create-element')
const { mergeStyles } = require('../../util/merge-styles')
const { translate } = require('../../util/transform')

const supports = ({ notification: { kind } }) => ['E', 'error'].includes(kind)

const draw = ({ document, styles }, message) => {
  const s = mergeStyles('error_', styles, message)

  const x = message.frame * styles.frame_width - s.size / 2
  const y = styles.event_radius - s.size / 2

  const $group = createElement(document, 'g')
  translate($group, x, y)

  $group.appendChild(
    createElement(document, 'line', {
      x1: 0,
      y1: 0,
      x2: s.size,
      y2: s.size,
      stroke: s.color,
      'stroke-width': s.stroke_width
    })
  )

  $group.appendChild(
    createElement(document, 'line', {
      x1: s.size,
      y1: 0,
      x2: 0,
      y2: s.size,
      stroke: s.color,
      'stroke-width': s.stroke_width
    })
  )

  const bbox = {
    x1: x,
    y1: y,
    x2: x + s.size,
    y2: y + s.size
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
