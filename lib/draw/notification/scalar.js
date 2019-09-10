const { createElement } = require('../../util/create-element')
const { translate } = require('../../util/transform')

const supports = () => true

const draw = (
  { document, styles },
  {
    frame,
    value,
    fill_color: fillColor,
    stroke_color: strokeColor,
    stroke_width: strokeWidth,
    value_color: valueColor
  }
) => {
  const x = frame * styles.frame_width - styles.event_radius

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
        fill: valueColor != null ? valueColor : styles.event_value_color,
        'font-family': styles.event_value_font_family,
        'font-size': styles.event_value_font_size + 'px',
        'font-weight': styles.event_value_font_weight,
        'font-style': styles.event_value_font_style,
        'dominant-baseline': 'middle',
        'text-anchor': 'middle'
      },
      value
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
