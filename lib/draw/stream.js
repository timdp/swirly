const { drawMessage } = require('./message')
const { createDrawStream } = require('./stream-factory')
const { createElement } = require('../util/create-element')
const { mergeStyles } = require('../util/merge-styles')
const { translate } = require('../util/transform')

const drawStreamImpl = createDrawStream(drawMessage)

const scaleTime = time => time

const drawStream = (ctx, stream) => {
  const { document, styles, streamHeight } = ctx
  const s = mergeStyles('stream_', styles, stream.styles)

  const drawStreamResult = drawStreamImpl(ctx, scaleTime, stream)

  const { element: $streamGroup, bbox } = drawStreamResult

  if (stream.frame > 0) {
    const dx = stream.frame * styles.frame_width
    translate($streamGroup, dx, 0)
    bbox.x1 += dx
    bbox.x2 += dx
  }

  if (stream.title == null || stream.title === '') {
    return drawStreamResult
  }

  const $outerGroup = createElement(document, 'g')

  $outerGroup.appendChild(
    createElement(
      document,
      'text',
      {
        x: 0,
        y: streamHeight / 2,
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
