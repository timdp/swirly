const { drawMessage } = require('./message')
const { createDrawStream } = require('./stream-factory')
const { createElement } = require('../util/create-element')
const { mergeStyles } = require('../util/merge-styles')
const { translate } = require('../util/transform')

const drawStreamImpl = createDrawStream(drawMessage)

const scaleTime = time => time

const drawStream = (ctx, stream) => {
  const { document, styles } = ctx
  const s = mergeStyles('stream_', styles, stream)

  const { element: $streamGroup, bbox } = drawStreamImpl(ctx, scaleTime, stream)

  const $outerGroup = createElement(document, 'g')

  $outerGroup.appendChild(
    createElement(
      document,
      'text',
      {
        x: 0,
        y: styles.event_radius,
        fill: s.title_color,
        'font-family': s.title_font_family,
        'font-size': s.title_font_size + 'px',
        'font-weight': s.title_font_weight,
        'font-style': s.title_font_style,
        'dominant-baseline': 'middle'
      },
      stream.title
    )
  )

  $outerGroup.appendChild($streamGroup)
  translate($streamGroup, s.title_width, 0)

  bbox.x1 = 0
  bbox.x2 += s.title_width

  return {
    element: $outerGroup,
    bbox
  }
}

module.exports = { drawStream }
