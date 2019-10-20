const { createElement } = require('./util/create-element')
const { mergeStyles } = require('./util/merge-styles')

const drawOperator = (ctx, operator) => {
  const { document, styles } = ctx
  const s = mergeStyles('operator_', styles, operator.styles)

  const $group = createElement(document, 'g')

  const $rect = createElement(document, 'rect', {
    x: 0,
    y: s.spacing,
    width: 1,
    height: s.height - s.stroke_width,
    fill: s.fill_color,
    stroke: s.stroke_color,
    'stroke-width': s.stroke_width,
    rx: s.corner_radius
  })
  $group.appendChild($rect)

  const $text = createElement(
    document,
    'text',
    {
      x: s.spacing,
      y: s.spacing + s.height / 2 + 'px',
      fill: s.title_color,
      'font-family': s.title_font_family,
      'font-size': s.title_font_size + 'px',
      'font-weight': s.title_font_weight,
      'font-style': s.title_font_style,
      'dominant-baseline': 'middle',
      'text-anchor': 'middle'
    },
    operator.title
  )
  $group.appendChild($text)

  const bbox = {
    x1: 0,
    y1: 0,
    x2: 1,
    y2: s.height + 2 * s.spacing
  }

  const update = ({ width }) => {
    $rect.setAttribute('width', width)
    $text.setAttribute('x', width / 2)
    $text.setAttribute('width', width)
  }

  return {
    element: $group,
    bbox,
    update
  }
}

module.exports = { drawOperator }
