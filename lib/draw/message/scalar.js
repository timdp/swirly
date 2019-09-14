const { createElement } = require('../../util/create-element')
const { mergeStyles } = require('../../util/merge-styles')
const { stringToColor } = require('../../util/string-to-color')
const { translate } = require('../../util/transform')

const COLOR_TO_MODE = {
  auto: 'light',
  auto_light: 'light',
  auto_dark: 'dark'
}

const supports = () => true

const draw = ({ document, styles }, message) => {
  const s = mergeStyles('event_', styles, message.styles)

  const x = message.frame * styles.frame_width - styles.event_radius

  const $group = createElement(document, 'g')
  translate($group, x, 0)

  const fillColorMode = COLOR_TO_MODE[s.fill_color]
  const finalFillColor =
    fillColorMode != null
      ? stringToColor(message.notification.value, fillColorMode)
      : s.fill_color

  $group.appendChild(
    createElement(document, 'ellipse', {
      cx: styles.event_radius,
      cy: styles.event_radius,
      rx: styles.event_radius - s.stroke_width / 2,
      ry: styles.event_radius - s.stroke_width / 2,
      fill: finalFillColor,
      stroke: s.stroke_color,
      'stroke-width': s.stroke_width
    })
  )

  $group.appendChild(
    createElement(
      document,
      'text',
      {
        x: styles.event_radius,
        y: styles.event_radius,
        fill: s.value_color,
        'font-family': s.value_font_family,
        'font-size': s.value_font_size + 'px',
        'font-weight': s.value_font_weight,
        'font-style': s.value_font_style,
        'dominant-baseline': 'middle',
        'text-anchor': 'middle'
      },
      message.notification.value
    )
  )

  const bbox = {
    x1: x,
    y1: 0,
    x2: x + styles.event_radius * 2,
    y2: styles.event_radius * 2
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
