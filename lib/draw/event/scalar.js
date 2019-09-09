const { createElement } = require('../../util/create-element')
const { translate } = require('../../util/transform')

const supports = () => true

const draw = (
  { document, styles },
  {
    timestamp,
    label,
    fill_color: fillColor,
    stroke_color: strokeColor,
    stroke_width: strokeWidth,
    label_color: labelColor
  }
) => {
  const x = timestamp * styles.time_unit_size - styles.event_radius

  const $group = createElement(document, 'g')
  translate($group, x, 0)

  $group.appendChild(
    createElement(document, 'ellipse', {
      cx: styles.event_radius,
      cy: styles.event_radius,
      rx: styles.event_radius - styles.event_stroke_width / 2,
      ry: styles.event_radius - styles.event_stroke_width / 2,
      fill: fillColor != null ? fillColor : styles.event_fill_color,
      stroke: strokeColor != null ? strokeColor : styles.event_stroke_color,
      'stroke-width':
        strokeWidth != null ? strokeWidth : styles.event_stroke_width
    })
  )

  $group.appendChild(
    createElement(
      document,
      'text',
      {
        x: styles.event_radius,
        y: styles.event_radius,
        fill: labelColor != null ? labelColor : styles.event_label_color,
        'font-family': styles.event_label_font_family,
        'font-size': styles.event_label_font_size + 'px',
        'font-weight': styles.event_label_font_weight,
        'font-style': styles.event_label_font_style,
        'dominant-baseline': 'middle',
        'text-anchor': 'middle'
      },
      label
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
