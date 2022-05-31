import { StreamSpecification, StreamStyles } from '@swirly/types'

import { renderMessage } from './message'
import { createRenderStream } from './stream-factory'
import { RendererContext, RendererResult } from './types'
import { createElement } from './util/create-element'
import { mergeStyles } from './util/merge-styles'
import { translate } from './util/transform'

const renderStreamImpl = createRenderStream(renderMessage)

export const renderStream = (
  ctx: RendererContext,
  stream: StreamSpecification
): RendererResult => {
  const { document, styles, streamHeight, streamTitleEnabled } = ctx
  const s: StreamStyles = mergeStyles(styles, stream.styles, 'stream_')

  const renderStreamResult = renderStreamImpl(ctx, stream, false, false)

  const { element: $streamGroup, bbox } = renderStreamResult

  if (stream.frame != null && stream.frame > 0) {
    const dx = stream.frame * styles.frame_width!
    translate($streamGroup, dx, 0)
    bbox.x1 += dx
    bbox.x2 += dx
  }

  if (!streamTitleEnabled) {
    return renderStreamResult
  }

  const $outerGroup = createElement(document, 'g')

  const title = typeof stream.title === 'string' ? stream.title : ''
  $outerGroup.appendChild(
    createElement(
      document,
      'text',
      {
        x: 0,
        y: streamHeight / 2,
        fill: s.title_color!,
        'font-family': s.title_font_family!,
        'font-size': s.title_font_size! + 'px',
        'font-weight': s.title_font_weight!,
        'font-style': s.title_font_style!,
        'dominant-baseline': 'middle'
      },
      title
    )
  )

  $outerGroup.appendChild($streamGroup)
  translate($streamGroup, s.title_width!, 0)

  bbox.x1 = 0
  bbox.x2 += s.title_width!

  return {
    element: $outerGroup,
    bbox
  }
}
