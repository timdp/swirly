const crypto = require('crypto')
const { createElement } = require('../../util/create-element')
const { mergeStyles } = require('../../util/merge-styles')
const { translate } = require('../../util/transform')

const COLOR_TO_MODE = {
  auto: 'light',
  auto_light: 'light',
  auto_dark: 'dark'
}

const supports = () => true

const getColor = (str, mode) => {
  const hash = crypto
    .createHash('sha1')
    .update(str)
    .digest()
  const hue = (hash.readUInt16LE() / (1 << 16)) * 360
  const saturation = 60
  const lightness = mode === 'dark' ? 20 : 80
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

const draw = ({ document, styles }, notification) => {
  const s = mergeStyles('event_', styles, notification)

  const x = notification.frame * styles.frame_width - styles.event_radius

  const $group = createElement(document, 'g')
  translate($group, x, 0)

  const fillColorMode = COLOR_TO_MODE[s.fill_color]
  const finalFillColor =
    fillColorMode != null
      ? getColor(notification.value, fillColorMode)
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
      notification.value
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
