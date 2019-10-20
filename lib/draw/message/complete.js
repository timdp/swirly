const { createElement } = require('../../util/create-element')
const { ItemKind } = require('../../util/item-kind')
const { mergeStyles } = require('../../util/merge-styles')
const { translate } = require('../../util/transform')

const supports = ({ notification: { kind } }) =>
  ItemKind.is(ItemKind.COMPLETE, kind)

const draw = ({ document, styles, streamHeight }, message) => {
  const s = mergeStyles('completion_', styles, message.styles)

  const x = message.frame * styles.frame_width - s.stroke_width / 2
  const y1 = (streamHeight - s.height) / 2
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
